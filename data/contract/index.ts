import { Address, Hex } from "viem";
import { managerAbi, tokenAbi, metadataAbi, governorAbi } from "constants/abi";
import client from "./client";
import { PUBLIC_MANAGER_ADDRESS } from "@/constants/addresses";

export interface ContractMetadata {
  name: string;
  contractImage: string;
}

export interface Vote {
  voter?: `0x${string}` | undefined;
  proposalId?: `0x${string}` | undefined;
  support?: string | undefined;
  reason?: string | undefined;
}

export const getBlockNumber = () => {
  return client.getBlockNumber();
};

export const getDaoAddresses = async ({ address }: { address: Address }) => {
  const [metadata, auction, treasury, governor] = await client.readContract({
    address: PUBLIC_MANAGER_ADDRESS,
    abi: managerAbi,
    functionName: "getAddresses",
    args: [address],
  });

  return { token: address, auction, metadata, treasury, governor };
};

export const getProposal = async (
  governor: Address,
  proposalId: Hex,
  blockNumber: bigint
) => {
  const filter = await client.createContractEventFilter({
    abi: governorAbi,
    address: governor,
    eventName: "ProposalCreated",
    fromBlock: 0n,
    toBlock: blockNumber,
  });

  try {
    const logs = await client.getFilterLogs({ filter });
    return logs.map((x) => x.args).find((x) => x.proposalId === proposalId);
  } catch (err) {
    console.log("filter error 1", err);
  }
  return {};
};

export const getProposalVotes = async (
  governor: Address,
  proposalId: Hex,
  blockNumber: bigint
) => {
  const filter = await client.createContractEventFilter({
    abi: governorAbi,
    address: governor,
    eventName: "VoteCast",
    fromBlock: 0n,
    toBlock: blockNumber,
  });

  try {
    const logs = await client.getFilterLogs({ filter });

    return logs
      .map((x) => x.args)
      .filter((x) => x.proposalId === proposalId)
      .map((x) => ({
        ...x,
        support: x.support.toString(),
        weight: undefined,
      }));
  } catch (err) {
    console.log("filter error 2");
  }
  return [];
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
