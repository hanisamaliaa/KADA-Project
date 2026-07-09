const express = require("express");

const router = express.Router();

const {
  register,
  login,
} = require("../controllers/authController");
const validateRegistration = require("../middlewares/validateRegistration");

router.post("/register", validateRegistration, register);

router.post("/login", login);

module.exports = router;