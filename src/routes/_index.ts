import express from "express";
import exampleRouter from "./example";
import walletRouter from "./wallet";
import tokenRouter from "./token";

const router = express.Router();

router.use("/example", exampleRouter);
router.use("/wallet", walletRouter);
router.use("/token", tokenRouter);

router.get("/", (req, res) => {
  res.send(
    `Backend running successfully on ${
      req.protocol + "://" + req.get("host") + req.originalUrl
    }`
  );
});

export default router;
