import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { generateOTP } from '../utils/generateOTP.js';
import { sendOTPEmail } from '../services/emailService.js';

const handleRegister = async (req, res) => {
  try {
    const { fullname, password } = req.body;

    const identifier = req.body.identifier?.trim();

    if (!fullname | !identifier | !password) {
      return res.status(400).json({
        success: false,
        message: "Missing Fields!"
      });
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isPhone = /^\d{10}$/.test(identifier);

    if (!isEmail && !isPhone) {
      return res.status(400).json({
        message: "Please enter a valid email or phone number.",
      });
    }

    const duplicate = await User.findOne({ identifier }).exec();
    if (duplicate) {
      return res.status(409).json({
        message: `A user is already registered with ${identifier}`
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname, identifier, password: hashedPassword
    });

    if (isEmail) {
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
      await user.save();
      await sendOTPEmail(user.identifier, otp);
    }

    return res.status(201).json({ 
      success: true, 
      userId: user._id,
      message: `New user created: ${fullname} & otp is sent`}
    );
    
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${err}`
    });
  }
}

const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const foundUser = await User.findById(userId);

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (foundUser.otpExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    if (otp !== foundUser.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    foundUser.isVerified = true;
    foundUser.otp = undefined;
    foundUser.otpExpiresAt = undefined;

    await foundUser.save();

    return res.status(200).json({
      success: true,
      message: "Account verified successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    });
  }
}

const resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    const foundUser = await User.findById(userId);

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (foundUser.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified.",
      });
    }

    const otp = generateOTP();

    foundUser.otp = otp;
    foundUser.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await foundUser.save();

    await sendOTPEmail(foundUser.identifier, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    });
  }
};

const handleLogin = async (req, res) => {

  try {
    const { password } = req.body;

    const identifier = req.body.identifier?.trim();

    if ( !identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing Fields!"
      });
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const isPhone = /^\d{10}$/.test(identifier);

    if (!isEmail && !isPhone) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email or phone number.",
      });
    }

    const foundUser = await User.findOne({ identifier }).exec();
    if (!foundUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    if (!foundUser.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your account first.",
        userId: foundUser._id.toString()
      });
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
      const userId = foundUser._id.toString();
      const role = foundUser.role;

      const accessToken = jwt.sign(
        {
          "UserInfo": { id: userId, role }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        {
          "UserInfo": { id: userId }
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
      );
      foundUser.refreshToken = refreshToken;
      await foundUser.save();

      res.cookie('refreshToken', refreshToken, { 
        httpOnly: true, 
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 1 * 24 * 60 * 60 * 1000 
      });
      return res.json({ 
        success: true, 
        accessToken, 
        user: {
          id: userId,
          role,
        }});

    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Server Error: ${err.message}`
    })
  }
};

const handleRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        'success': false,
        'message': 'Invalid or no refreshToken.'
      })
    }

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
      return res.status(403).json({
        'success': false,
        'message': 'RefreshToken not available.'
      });
    }

    if (!foundUser.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your account first."
      });
    }
    
    const userId = foundUser._id.toString();
    const role = foundUser.role;

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || userId !== decoded.UserInfo.id ) {
          return res.status(401).json({
            'success': false,
            'message': err?.message || 'Invalid UserInfo.'
          });
        }
        const accessToken = jwt.sign(
          {
            "UserInfo": { id: userId, role }
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '15m' }
        );
        return res.json({ 
          'success': true,
          accessToken,
          user: {
            id: userId,
            role
          }
        });
      }
    )
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Server Error: ${err.message}`
    });
  }
};

const handleLogout = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.sendStatus(204);
  }

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    return res.sendStatus(204);
  }

  foundUser.refreshToken = '';
  await foundUser.save();

  res.clearCookie('refreshToken', { 
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
  });
  return res.sendStatus(204);
};

export { handleRegister, verifyOTP, resendOTP, handleLogin, handleRefreshToken, handleLogout };