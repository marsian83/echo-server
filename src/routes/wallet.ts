import express from "express";
// import Moralis from "moralis";
import { isAddress } from "viem";
import evm from "../../evm";
const router = express.Router();

const Moralis = {} as any;

router.get("/tokens", async (req, res) => {
  const { address } = req.query;

  if (typeof address != "string" || !isAddress(address))
    return res.sendStatus(400);

  const data = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
    address: address,
  });

  res.send(data);
});

router.get("/profits", async (req, res) => {
  const { address } = req.query;

  if (typeof address != "string" || !isAddress(address))
    return res.sendStatus(400);

  const data = await Moralis.EvmApi.wallets.getWalletProfitabilitySummary({
    address: address,
  });

  res.send(data);
});

router.get("/history", async (req, res) => {
  const { address } = req.query;

  if (typeof address != "string" || !isAddress(address))
    return res.sendStatus(400);

  const data = await Moralis.EvmApi.wallets.getWalletHistory({
    address: address,
  });

  res.send(data);
});

router.get("/faucet/:address", async (req, res) => {
  const { address } = req.params;

  if (typeof address != "string" || !isAddress(address))
    return res.sendStatus(400);

  await evm.faucetClient.sendTransaction({
    to: address,
    value: BigInt(0.1 * Math.pow(10, 18)),
    account: (await evm.faucetClient?.getAddresses())?.[0] || "0x",
  });
});

export default router;
