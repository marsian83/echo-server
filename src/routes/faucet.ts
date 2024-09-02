import express from "express";
import { getContract, isAddress } from "viem";
import evm from "../../evm";
import contracts from "../contracts";
const router = express.Router();

const faucet = getContract({
  ...contracts.faucet,
  client: evm.faucetClient,
});

router.post("/request/:account", (req, res) => {
  const { account } = req.params;

  if (typeof account != "string" || !isAddress(account))
    return res.sendStatus(400);

  faucet.write
    .claimEdu([account], { account: evm.faucetClient.account })
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(500));
});

router.get("/config", (req, res) => {
  faucet.read
    .eduClaimConfig()
    .then((r) => res.send({ amount: r[0], cooldown: r[1] }))
    .catch(() => res.sendStatus(500));
});

router.get("/info/:account", (req, res) => {
  const { account } = req.params;

  if (typeof account != "string" || !isAddress(account))
    return res.sendStatus(400);

  faucet.read
    .lastEduClaim([account])
    .then((r) => res.send({ lastClaim: r }))
    .catch(() => res.sendStatus(500));
});

export default router;
