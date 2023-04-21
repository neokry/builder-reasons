import { getContract } from "@wagmi/core";
import DefaultProvider from "./client";
import { BigNumber } from "ethers";
import { governorAbi } from "@/constants/abi";
import { Hex, Address } from "viem";
import { getEnsName } from "../viem";

export type Proposal = {
  proposalId: `0x${string}`;
  description: string;
};

export interface Vote {
  voter?: `0x${string}` | undefined;
  proposalId?: `0x${string}` | undefined;
  support?: string | undefined;
  reason?: string | undefined;
  ens?: string | null;
  avatar?: string;
}

export const getUserVotes = async ({
  address,
  user,
  timestamp,
}: {
  address: string;
  user: `0x${string}`;
  timestamp: number;
}) => {
  const governor = getContract({
    signerOrProvider: DefaultProvider,
    address,
    abi: governorAbi,
  });
  return governor.getVotes(user, BigNumber.from(timestamp));
};

export const getProposal = async (
  address: Address,
  proposalId: Hex
): Promise<Proposal | undefined> => {
  const governor = getContract({
    signerOrProvider: DefaultProvider,
    address,
    abi: governorAbi,
  });
  const filter = governor.filters.ProposalCreated(
    null,
    null,
    null,
    null,
    null,
    null,
    null
  );
  const logs = await governor.queryFilter(filter);

  const data = logs
    .map((x) => x.args)
    .find((x: any) => x.proposalId === proposalId);

  return data
    ? { proposalId: data.proposalId, description: data.description }
    : undefined;
};

export const getProposalVotes = async (
  address: Address,
  proposalId: Hex
): Promise<Vote[]> => {
  const governor = getContract({
    signerOrProvider: DefaultProvider,
    address,
    abi: governorAbi,
  });
  const filter = governor.filters.VoteCast(null, null, null, null, null);
  const logs = await governor.queryFilter(filter);

  return await Promise.all(
    logs
      .map((x) => x.args)
      .filter((x: any) => x.proposalId === proposalId)
      .map(async (x: any) => {
        const name = await getEnsName({ address: x.voter });

        return {
          voter: x.voter,
          proposalId: x.proposalId,
          reason: x.reason,
          support: x.support.toString(),
          ens: name,
        };
      })
  );
};
