const { verifyAccessToken } = require("../utils/tokens");

const authenticate = (req, res, next) => {
  try {
    // Support both cookie-based and Bearer token authentication
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7);
      }
    }

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
