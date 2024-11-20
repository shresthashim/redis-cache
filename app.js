import express from "express";
import mongoose from "mongoose";

const app = express();

mongoose.connect("mongodb://root:root@localhost:27017/node_cache?authSource=admin");

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
