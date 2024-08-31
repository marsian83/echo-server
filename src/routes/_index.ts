import express from "express";
import exampleRouter from "./example";
import walletRouter from "./wallet";
import tokenRouter from "./token";
import collectionRouter from "./collection";

const router = express.Router();

router.use("/example", exampleRouter);
router.use("/wallet", walletRouter);
router.use("/token", tokenRouter);
router.use("/collection", collectionRouter);

router.get("/", (req, res) => {
  res.send(
    `Backend running successfully on ${
      req.protocol + "://" + req.get("host") + req.originalUrl
    }`
  );
});

export default router;
