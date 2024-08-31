import { Router } from "express";
import { getContract, isAddress } from "viem";
import contractDefinitions from "../../contracts";
import evm from "../../../evm";
import Token from "../../models/Token";
import Collection from "../../models/Collection";

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
    const collectionExists = (await Token.exists({ address: address }))
      ? true
      : false;
    if (collectionExists) wait = 1;

    setTimeout(async () => {
      const collection = getContract({
        ...contractDefinitions.publicnft,
        address: address,
        client: evm.client,
      });

      try {
        if (collectionExists) {
          const owner = await collection.read.owner();
          await Collection.findOneAndUpdate({ address }, { owner });

          refreshTimeouts[address] = Date.now() + refreshCooldown;

          return res.sendStatus(200);
        } else {
          const name = await collection.read.name();
          const owner = await collection.read.owner();
          const symbol = await collection.read.symbol();
          const image = await collection.read.image();

          const newCollection = new Collection({
            address,
            name,
            owner,
            symbol,
            image,
            data: [],
          });
          await newCollection.save();

          return res.sendStatus(201);
        }
      } catch (e) {
        return res.sendStatus(404);
      }
    }, wait);
  });
}
