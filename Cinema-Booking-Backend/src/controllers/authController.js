const authService = require("../services/authService");

const generateToken = require("../utils/generateToken");

const User = require("../models/User");

const cookieOptions = {
  httpOnly: true,
  secure: false, // Set to true if using HTTPS
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};


const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await authService.register({ name, email, password });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login({ email, password });
    const token = generateToken(user);
    res.cookie("token", token, cookieOptions);
    res.status(200).json({ success: true, message: "Login successful", data: user });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ success: false, message: error.message || "Internal server error" });
  }
};

const me = async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.status(200).json({ success: true, data: user }); // { _id, name, email, role }
};

const logout = async (req, res) => {
  res.clearCookie("token", {httpOnly: true, secure: false, sameSite: "lax"});
  res.status(200).json({ success: true, message: "Logout successful" });
}

module.exports = {
  register,
  login,
  me,
  logout,
};