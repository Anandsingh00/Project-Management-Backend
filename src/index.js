import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/connectDB.js";
dotenv.config({
  path: "./.env",
});

connectDB();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening on : http://localhost:${port}`);
});
