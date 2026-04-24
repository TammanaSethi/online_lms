import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";

// ================= SIGNUP =================
export const signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 🔹 check existing user
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔹 validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // 🔹 validate password
    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    // 🔹 hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // 🔹 create user
    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role: role || "student", // fallback
    });

    // 🔹 generate token
    const token = await genToken(user._id);

    // 🔹 set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true in production (HTTPS)
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json(user);

  } catch (error) {
    return res.status(500).json({
      message: `Signup error: ${error.message}`,
    });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔹 find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔹 check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // 🔹 generate token
    const token = await genToken(user._id);

    // 🔹 set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({
      message: `Login error: ${error.message}`,
    });
  }
};

// ================= LOGOUT =================
export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({
      message: `Logout error: ${error.message}`,
    });
  }
};