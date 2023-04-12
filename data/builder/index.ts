import { Address } from "viem";

export interface Proposal {
  proposalNumber: number;
  proposer: Address;
  title: string;
  description: string;
  votes: Vote[];
}

export interface Vote {
  voter: Address;
  support: "FOR" | "AGAINST" | "ABSTAIN";
  weight: number;
  reason: string;
}

export const getProposal = (id: string): Promise<Proposal> =>
  fetch(`http://localhost:3001/api/proposal/${id}`).then((x) => x.json());
