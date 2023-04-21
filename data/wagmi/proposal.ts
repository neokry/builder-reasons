import { getContract } from "@wagmi/core";
import DefaultProvider from "./client";
import { BigNumber } from "ethers";
import { governorAbi } from "@/constants/abi";
import { Hex, Address } from "viem";
import { getEnsName } from "../viem";

export type Proposal = {
  proposalId: `0x${string}`;
  targets: `0x${string}`[];
  values: number[];
  calldatas: `0x${string}`[];
  description: string;
  descriptionHash: `0x${string}`;
  proposal: ProposalDetails;
  state: number;
};

export type ProposalDetails = {
  proposer: `0x${string}`;
  timeCreated: number;
  againstVotes: number;
  forVotes: number;
  abstainVotes: number;
  voteStart: number;
  voteEnd: number;
  proposalThreshold: number;
  quorumVotes: number;
  executed: boolean;
  canceled: boolean;
  vetoed: boolean;
};

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

export interface Vote {
  voter?: `0x${string}` | undefined;
  proposalId?: `0x${string}` | undefined;
  support?: string | undefined;
  reason?: string | undefined;
  ens?: string | null;
  avatar?: string;
}

export const getProposal = async (address: Address, proposalId: Hex) => {
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

  return logs.map((x) => x.args).find((x: any) => x.proposalId === proposalId);
};

export const getProposalVotes = async (address: Address, proposalId: Hex) => {
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
          ...x,
          support: x.support.toString(),
          weight: undefined,
          ens: name,
        };
      })
  );
};
