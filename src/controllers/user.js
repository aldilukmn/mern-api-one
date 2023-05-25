import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/user.js";

// try {
//   const username = req.body.username.trim();
//   const password = req.body.password.trim();

//   if (!isNaN(username) || !isNaN(password)) {
//     return res.status(400).json({
//       message: "Invalid username or password format!",
//     });
//   }

//   const user = await userModel.findOne({ username });

//   if (user) {
//     return res.status(409).json({
//       message: "User already exists!",
//     });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const newUser = new userModel({
//     username,
//     password: hashedPassword,
//   });

//   await newUser.save();

//   res.status(201).json({
//     message: "User registered successfully.",
//   });
// } catch (err) {
//   res.status(400).json(err);
// }
const register = async (req, res) => {
  try {
    const username = req.body.username.trim();
    const email = req.body.email.trim();
    const password = req.body.password.trim();

    if (!isNaN(username) || !isNaN(email) || !isNaN(password)) {
      return res.status(400).json({
        message: "Invalid username, email or password format!",
      });
    }

    // Check the existing username;
    const existUsername = await userModel.findOne({ username });
    if (existUsername) {
      return res.status(409).json({
        message: "Username already exists!",
      });
    }

    // Check the existing email;
    const existEmail = await userModel.findOne({ email });
    if (existEmail) {
      return res.status(409).json({
        message: "Email already exists!",
      });
    }

    // Hashed password
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new userModel({
        username,
        email,
        password: hashedPassword,
      });

      await user.save();

      res.status(201).json({
        message: "User registered successfully.",
      });
    }
  } catch (error) {
    return res.status(500).send(error);
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

    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "20s",
      }
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: "1d",
      }
    );

    // Simpan refreshToken di database
    await userModel.updateOne({ _id: user._id }, { refresh_token: refreshToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure: true (For HTTPS)
    });

    res.status(200).json({
      message: "Login success.",
      accessToken,
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(203).json({
      message: "No content",
    });
  }
  const user = await userModel.findOne({
    refresh_token: refreshToken,
  });

  if (!user) {
    return res.status(204).json({
      message: "No content",
    });
  }

  const userId = user._id;

  await users.updateOne({ _id: userId }, { refresh_token: null });

  res.clearCookie("refreshToken");

  return res.status(200).json({
    message: "Logout success.",
  });
};

const getUser = async (req, res) => {
  try {
    const users = await userModel.find().select("username email -_id");
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};

export { register, login, logout, getUser };
