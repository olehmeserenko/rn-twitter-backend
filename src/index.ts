import express from "express";
import { authenticateToken } from "./middlewares/authMiddleware";
import authRoutes from "./routes/authRoutes";
import tweetRoutes from "./routes/tweetRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();
app.use(express.json());
app.use("/user", authenticateToken, userRoutes);
app.use("/tweet", authenticateToken, tweetRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
