import { Address, Hex } from "viem";
import { managerAbi, tokenAbi, metadataAbi } from "constants/abi";
import client from "./client";
import { PUBLIC_MANAGER_ADDRESS } from "@/constants/addresses";

export interface ContractMetadata {
  name: string;
  contractImage: string;
}

export const getDaoAddresses = async ({ address }: { address: Address }) => {
  const [metadata, auction, treasury, governor] = await client.readContract({
    address: PUBLIC_MANAGER_ADDRESS,
    abi: managerAbi,
    functionName: "getAddresses",
    args: [address],
  });

  return { token: address, auction, metadata, treasury, governor };
};

export const getContractMetadata = async (
  token: Address,
  metadata: Address
): Promise<ContractMetadata> => {
  const [name, contractImage] = await client.multicall({
    contracts: [
      {
        address: token,
        abi: tokenAbi,
        functionName: "name",
      },
      {
        address: metadata,
        abi: metadataAbi,
        functionName: "contractImage",
      },
    ],
  });

  return { name: name.result || "", contractImage: contractImage.result || "" };
};
