import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

export default createPublicClient({
  chain: mainnet,
  transport: http(process.env.ALCHEMY_ENDPOINT),
});
