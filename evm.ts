import crypto from "crypto";

import {
  createPublicClient,
  createWalletClient,
  getContract,
  http,
  publicActions,
} from "viem";
import { Chain } from "viem/chains";

const openCampusTestnet: Chain = {
  id: 0xa045c,
  name: "Open Campus Codex Sepolia",
  nativeCurrency: { symbol: "EDU", name: "EDU", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://open-campus-codex-sepolia.drpc.org"],
      webSocket: ["wss://open-campus-codex-sepolia.drpc.org"],
    },
    public: {
      http: ["https://open-campus-codex-sepolia.drpc.org"],
      webSocket: ["wss://open-campus-codex-sepolia.drpc.org"],
    },
  },
  testnet: true,
  blockExplorers: {
    default: {
      name: "blockscout",
      url: "https://opencampus-codex.blockscout.com",
    },
  },
};

const primaryChain = openCampusTestnet;

const rpcUrl = primaryChain.rpcUrls.default.http[0];
const pvtKey = crypto.randomBytes(32).toString("hex");

// const publicClient = createPublicClient({
//   chain: primaryChain,
//   transport: http(rpcUrl),
// });

const client = createWalletClient({
  chain: primaryChain,
  transport: http(rpcUrl),
  key: pvtKey,
}).extend(publicActions);

async function getBlockNumber() {
  return await client.getBlockNumber();
}

export default { client, getBlockNumber };
