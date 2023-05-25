import jwt from "jsonwebtoken";
import userModel from "../models/user.js";

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        message: "Unauthorized: Missing token",
      });
    }
    const user = await userModel.findOne({
      refresh_token: refreshToken,
    });

    if (!user) {
      return res.status(403).json({
        message: "Forbidden: Invalid token",
      });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decode) => {
      if (err) {
        return res.status(403).json({
          message: "Forbidden: Invalid token",
        });
      }
      const accessToken = jwt.sign(
        {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: "15s",
        }
      );
      res.status(200).json({
        accessToken,
      });
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

export default refreshToken;
