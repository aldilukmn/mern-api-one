import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path from "path";
import userRouter from "./src/routes/user.js";

// Configuration
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: path.join(__dirname, ".env")});
app.use(bodyParser.json());
app.use(cors());


// Router
app.use("/v1/auth", userRouter)

// Mongodb connection
const port = process.env.PORT || 6001;
try {
   await mongoose.connect(process.env.MONGO_URL)
    app.listen(port, () => console.log(`Server started on port`, port));
  } catch(err) {
    console.log(`${err} did not connect!`)
  }