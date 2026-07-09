const express = require("express");

const router = express.Router();
const authenticate = require("../middlewares/authenticate");

const {
  register,
  login,
  me,
  logout,
} = require("../controllers/authController");
const validateRegistration = require("../middlewares/validateRegistration");


router.post("/register", validateRegistration, register);

router.post("/login", login);

router.get("/me", authenticate, me);

router.post("/logout", authenticate, logout);

module.exports = router;