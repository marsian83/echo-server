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

  faucet.write.claimEdu([account], { account: evm.faucetClient.account });
});

export default router;
