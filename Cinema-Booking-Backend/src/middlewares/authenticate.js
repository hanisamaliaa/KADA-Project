const { verifyAccessToken } = require("../utils/tokens");

const authenticate = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    req.user = verifyAccessToken(token);
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
