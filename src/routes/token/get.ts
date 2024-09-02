import { Router } from "express";
import { isAddress } from "viem";
import Token from "../../models/Token";

export default function attachGetHandlers(router: Router) {
  router.get("/owned-by/:address", async (req, res) => {
    const address = req.params.address;

    if (typeof address != "string" || !isAddress(address))
      return res.sendStatus(400);

    const tokens = await Token.find({ owner: address });

    return res.status(200).send({ tokens: tokens, owner: address });
  });

  router.get("/by-address/:address", async (req, res) => {
    const address = req.params.address;

    if (typeof address != "string" || !isAddress(address))
      return res.sendStatus(400);

    const token = await Token.findOne({ address: address });

    return res.status(200).send(token);
  });

  router.get("/listings", (req, res) => {});
}
