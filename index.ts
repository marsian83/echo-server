import "dotenv/config";

import express from "express";
import cors from "cors";
import indexRouter from "./src/routes/_index";

import { frontendUrl } from "./config";
import mongoose from "mongoose";

const PORT = Number(process.env.PORT) || 9000;

const app = express();

app.use(cors()); //origin: frontendUrl }));
app.use(express.json());
app.use(express.urlencoded());

app.use("*", (req, res, next) => {
  console.log(req.path);
  next();
});

app.use("/", indexRouter);

async function main() {
  if (!process.env.MONGODB_URI) throw "Connection URI not found";

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("DB connection established");

  app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
  });
}

main();
