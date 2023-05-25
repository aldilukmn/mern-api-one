import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import path from "path";
import userRouter from "./src/routes/user.js";
import connect from "./src/databases/index.js";
import cookieParser from "cookie-parser";

// Configuration
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser())
app.disable("x-powered-by");

// Router
app.use("/v1/auth", userRouter);

// Connection
const port = process.env.PORT || 6001;
connect()
  .then(() => {
    try {
      app.listen(port, () => console.log(`Server started on port ${port}.`));
    } catch (err) {
      console.log("Cannot connect to the server!");
    }
  })
  .catch((err) => {
    console.log("Invalid database connection!");
  });
