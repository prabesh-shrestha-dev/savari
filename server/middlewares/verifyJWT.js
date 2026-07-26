import jwt from 'jsonwebtoken';

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Invalid Authorization Header.'
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Invalid form of accessToken'
    })
  }
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: err.message || "Invalid or expired access-token."
        });
      }
      req.user = {
        id: decoded.UserInfo.id,
        role: decoded.UserInfo.role
      }
      next();
    }
  )
};

export default verifyJWT;