import { Router } from "express";
import { getContract, isAddress, verifyMessage } from "viem";
import contractDefinitions from "../../contracts";
import evm from "../../../evm";
import Token from "../../models/Token";
import { getRandomHex } from "../../utils";

const refreshTimeouts: Record<string, number> = {};
const refreshCooldown = 10 * 60 * 1000; //ms
const listingNonceStore: Record<string, string> = {};

export default function attachPostHandlers(router: Router) {
  router.post("/refresh/:address", async (req, res) => {
    const address = req.params.address;

    if (refreshTimeouts[address] && refreshTimeouts[address] > Date.now()) {
      return res.sendStatus(429);
    }

    if (typeof address != "string" || !isAddress(address))
      return res.sendStatus(400);

    let wait = 20 * 1000;
    if (await Token.exists({ address: address })) wait = 1;

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
        const mintable = await tokenContract.read.mintable();
        const burnable = await tokenContract.read.burnable();
        const newToken = new Token({
          address: address,
          name: name,
          symbol: symbol,
          owner: owner,
          mintable: mintable,
          burnable: burnable,
        });

        await Token.findOneAndDelete({ address: address });
        await newToken.save();

        refreshTimeouts[address] = Date.now() + refreshCooldown;

        return res.sendStatus(200);
      } catch (e) {
        return res.sendStatus(404);
      }
    }, wait);
  });

  router.post("/list/request-nonce", async (req, res) => {
    const { address } = req.query;

    if (typeof address != "string" || !isAddress(address))
      return res.sendStatus(400);

    if (await Token.exists({ address: address })) {
      listingNonceStore[address] = getRandomHex(8);
      listingNonceStore[
        address
      ] = `I consent to listing token with address ${address}\non Echo's token browsing platform\nNonce : ${listingNonceStore[address]}`;
      return res.status(200).send({
        nonce: listingNonceStore[address],
      });
    } else return res.sendStatus(404);
  });

  router.post("/list", async (req, res) => {
    const { address, signature } = req.query;

    if (typeof address != "string" || !isAddress(address))
      return res.sendStatus(400);
    if (typeof signature != "string" || !signature.startsWith("0x"))
      return res.sendStatus(400);

    const msg = listingNonceStore[address];

    const token = await Token.findOne({ address: address });

    if (!token) return res.sendStatus(404);
    if (!isAddress(token.owner)) return res.sendStatus(500);

    const valid = await verifyMessage({
      message: msg,
      signature: signature as `0x${string}`,
      address: token.owner,
    });

    if (!valid) return res.sendStatus(401);

    token.listed = true;
    await token.save();

    return res.sendStatus(200);
  });

  router.post("/update", async (req, res) => {
    const { address, signature, signedAt } = req.query;
    const newData = req.body;

    if (typeof address != "string" || !isAddress(address))
      return res.sendStatus(400);
    if (typeof signature != "string" || signature.startsWith("0x"))
      return res.sendStatus(400);
    if (typeof signedAt != "number" || signedAt < Date.now() - 60 * 60 * 1000)
      return res.sendStatus(400);

    const token = await Token.findOne({ address: address });

    if (!token) return res.sendStatus(404);
    if (!isAddress(token.owner)) return res.sendStatus(500);

    const valid = await verifyMessage({
      address: token.owner,
      signature: signature as `0x${string}`,
      message: `${JSON.stringify(newData)}${signedAt}`.replace(/ /g, ""),
    });
    if (!valid) return res.sendStatus(401);

    newData.image && (token.image = newData.image);
    newData.banner && (token.banner = newData.banner);
    newData.description && (token.description = newData.description);
    newData.twitter && (token.twitter = newData.twitter);
    newData.telegram && (token.telegram = newData.telegram);
    newData.discord && (token.discord = newData.discord);
    newData.website && (token.website = newData.website);

    await token.save();

    return res.sendStatus(200);
  });
}
