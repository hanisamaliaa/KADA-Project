const authService = require("../services/authService");

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
  res.status(200).json({
    success: true,
    message: "Login endpoint",
  });
};

module.exports = {
  register,
  login,
};