import User from "../models/User.js";

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -refreshToken -otp -otpExpiresAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (err) {
    console.error("Get current user error:", err);

    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${err.message}`,
    });
  }
};

export {
  getCurrentUser,
};