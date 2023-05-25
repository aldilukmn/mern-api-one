import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    refresh_token: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("user", userSchema);

export default user;
