import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/user.js";

const register = async (req, res) => {
  try {
    const username = req.body.username.trim();
    const password = req.body.password.trim();

    if (!isNaN(username) || !isNaN(password)) {
      return res.status(400).json({
        message: "Invalid username or password format!",
      });
    }

    const user = await userModel.findOne({ username });

    if (user) {
      return res.status(409).json({
        message: "User already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully.",
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!isNaN(username) || !isNaN(password)) {
      return res.status(400).json({
        message: "Invalid username or password format!",
      });
    }

    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(404).json({
        message: "User doesn't exit!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Username or password is incorrect!",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      "secret"
    );

    res.status(200).json({
      message: "Login success.",
      token,
      userId: user._id,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

export { register, login };
