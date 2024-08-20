import { Router } from "express";
import { getContract, isAddress } from "viem";
import contractDefinitions from "../../contracts";
import evm from "../../../evm";
import Token from "../../models/Token";

const refreshTimeouts: Record<string, number> = {};
const refreshCooldown = 10 * 60 * 1000; //ms

export default function attachPostHandlers(router: Router) {
  router.post("/refresh/:address", (req, res) => {
    const address = req.params.address;

    if (refreshTimeouts[address] && refreshTimeouts[address] > Date.now()) {
      return res.sendStatus(429);
    }

    if (typeof address != "string" || !isAddress(address))
      return res.sendStatus(400);

    setTimeout(async () => {
      const tokenContract = getContract({
        ...contractDefinitions.token,
        address: address,
        client: evm.client,
      });

      try {
        const name = await tokenContract.read.name();
        const owner = await tokenContract.read.owner();
        const symbol = await tokenContract.read.symbol();
        const newToken = new Token({
          address: address,
          name: name,
          symbol: symbol,
          owner: owner,
        });

        await Token.findOneAndDelete({ address: address });
        await newToken.save();

        refreshTimeouts[address] = Date.now() + refreshCooldown;

        return res.sendStatus(200);
      } catch (e) {
        return res.sendStatus(404);
      }
    }, 90 * 1000);
  });
}
