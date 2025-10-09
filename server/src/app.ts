import path from "path";
import dotenv from "dotenv";
import express, { Request, Response, Application } from "express";
import cors from "cors";
import connection from "./db/mongodb";
import authRouter from "./routes/AuthRoute";

// ------------------ Load environment variables ------------------
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ------------------ Connect to MongoDB ------------------
connection();

// ------------------ Create Express app ------------------
const app: Application = express();

// ------------------ Middleware ------------------
app.use(express.json());
app.use(
  cors({
    origin: "https://generate-password-backend.onrender.com", // frontend URL
    credentials: true,
  })
);

// ------------------ Routes ------------------
app.use("/Auth", authRouter);

app.get("/", (req: Request, res: Response) => {
  res.json({ success: true, message: "Home Route is Working" });
});

// ------------------ Start server ------------------
const port: number = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
