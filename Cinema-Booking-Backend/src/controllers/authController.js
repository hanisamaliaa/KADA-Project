const register = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Register endpoint",
  });
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