import express from "express";
import tweetRoutes from "./routes/tweetRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();
app.use(express.json());
app.use("/user", userRoutes);
app.use("/tweet", tweetRoutes);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
