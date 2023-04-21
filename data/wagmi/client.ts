import { providers } from "ethers";

const provider = new providers.InfuraProvider(
  "mainnet",
  process.env.INFURA_API_KEY
);

export default provider;
