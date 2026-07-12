const bcrypt = require("bcrypt");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const { signAccessToken, signRefreshToken, hashToken } = require("../utils/tokens");
const { generateCode, hashCode, compareCode, codeExpiry } = require("../utils/codes");

const SALT_ROUNDS = 10;
const MAX_ATTEMPTS = 5;
// Precomputed hash used to spend the same time as a real compare when the user
// does not exist — prevents timing-based account enumeration.
const DUMMY_HASH = bcrypt.hashSync("cinema-constant-time-dummy", SALT_ROUNDS);

// Sign an access + refresh pair, store the refresh hash on the user (for rotation
// and reuse detection), and persist.
const issueTokens = async (userDoc) => {
  const accessToken = signAccessToken(userDoc);
  const refreshToken = signRefreshToken(userDoc);
  userDoc.refreshTokenHash = hashToken(refreshToken);
  await userDoc.save();
  return { accessToken, refreshToken };
};

const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const code = generateCode();
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    verification: { codeHash: await hashCode(code), expiresAt: codeExpiry(10), attempts: 0 },
  });

  return {
    user: { _id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
    code,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    await bcrypt.compare(password, DUMMY_HASH); // constant-time: always compare
    throw new AppError("Invalid email or password", 401);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }
  if (!user.isVerified) {
    throw new AppError("Please verify your email before logging in", 403);
  }
  return user; // full doc; caller issues tokens
};

const verifyEmail = async ({ email, code }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || user.isVerified) {
    throw new AppError("Invalid or expired verification code", 400);
  }
  const v = user.verification || {};
  if (!v.codeHash || !v.expiresAt || v.expiresAt < new Date() || v.attempts >= MAX_ATTEMPTS) {
    throw new AppError("Invalid or expired verification code", 400);
  }
  if (!(await compareCode(code, v.codeHash))) {
    user.verification.attempts += 1;
    await user.save();
    throw new AppError("Invalid or expired verification code", 400);
  }
  user.isVerified = true;
  user.verification = { codeHash: null, expiresAt: null, attempts: 0 };
  await user.save();
  return user;
};

// Returns a fresh code if one should be sent, or null (caller responds generically
// either way, so account existence is not revealed).
const resendVerification = async ({ email }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || user.isVerified) return null;
  const code = generateCode();
  user.verification = { codeHash: await hashCode(code), expiresAt: codeExpiry(10), attempts: 0 };
  await user.save();
  return code;
};

module.exports = { register, login, issueTokens, verifyEmail, resendVerification };
