import mongoose from "mongoose";

const connect = async () => {
  const db = await mongoose.connect(process.env.MONGO_URL);
  console.log("Database connected.");
  return db;
};

export default connect;
