import path from "path";
import dotenv from "dotenv";
import express, { Request, Response, Application } from "express";
import connection from "./db/mongodb";
import router from "./routes/AuthRoute";
import cors from "cors";
connection();
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const app: Application = express();

const port: number = Number(process.env.PORT) || 4000;
app.use(
  cors({
    origin: "https://generate-password-backend.onrender.com", 
    credentials: true,
  })
);

app.use(express.json());
app.use("/Auth", router);

app.get("/", (req: Request, res: Response) => {
  res.json("Home Route Is Working");
});


app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
