import { Address, Hex } from "viem";
import client from "./client";
import { governorAbi } from "@/constants/abi";
import { getEnsName } from "./ens";

export interface Vote {
  voter?: `0x${string}` | undefined;
  proposalId?: `0x${string}` | undefined;
  support?: string | undefined;
  reason?: string | undefined;
  ens?: string | null;
  avatar?: string;
}

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

  const logs = await client.getFilterLogs({ filter });
  return logs.map((x) => x.args).find((x) => x.proposalId === proposalId);
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

  const logs = await client.getFilterLogs({ filter });

  return await Promise.all(
    logs
      .map((x) => x.args)
      .filter((x) => x.proposalId === proposalId)
      .map(async (x) => {
        const name = await getEnsName({ address: x.voter });

        return {
          ...x,
          support: x.support.toString(),
          weight: undefined,
          ens: name,
        };
      })
  );
};
