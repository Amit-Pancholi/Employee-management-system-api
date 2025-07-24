const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user-model");
const JWT_SECRET = process.env.JWT_SECRET;
const { check, validationResult } = require("express-validator");

// ========== SIGNUP ==========
exports.postSignup = [
  check("username")
    .trim()
    .notEmpty()
    .withMessage("Please enter username")
    .isLength({
      min: 2,
    })
    .withMessage("Username must be at least 2 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Username can only contain letters and spaces"),
  check("email")
    .notEmpty()
    .withMessage("Please enter email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Please enter a password")
    .isLength({
      min: 8,
    })
    .withMessage("Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({
        Message: "Error occure in sending data",
        error: error.array().map((err) => err.msg),
      });
    } else {
      next();
    }
  },
  async (req, res, next) => {
    try {
      const { username, email, password, confirmPassword } = req.body;

      if (!email || !password || !username) {
        return res.status(400).json({ Message: "All fields are required" });
      }
      if (password != confirmPassword)
        return res
          .status(400)
          .json({ Message: "Password and confirm Password must be same" });

      const userExist = await User.findOne({ email: email });
      if (userExist) {
        return res.status(409).json({ Message: "This email already exists" });
      }

      const user = new User({ username, email, password });
      await user.save();

      return res.status(201).json({
        Message: "User created successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ Message: "Error creating user", error: error.message });
    }
  },
];

// ========== LOGIN ==========
exports.postLogin = [
  check("email")
    .notEmpty()
    .withMessage("Please enter email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  check("password")
    .trim()
    .notEmpty()
    .withMessage("Please enter a password")
    .isLength({
      min: 8,
    })
    .withMessage("Password must be at least 8 characters long"),
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({
        Message: "Error occure in sending data",
        error: error.array().map((err) => err.msg),
      });
    } else {
      next();
    }
  },
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ Message: "Email and password are required" });
      }

      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ Message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ Message: "Invalid Password" });
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

      return res.status(200).json({
        Message: "User logged in successfully",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ Message: "Error logging in user", error: error.message });
    }
  },
];

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (!user)
      return res.status(404).json({ Message: "User not found or Invalid Id" });
    res.status(200).json({ Message: "User remove successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ Message: "Error removing in user", error: error.message });
  }
};
