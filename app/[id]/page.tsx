import {
  getBlockNumber,
  getContractMetadata,
  getDaoAddresses,
  getProposal,
  getProposalVotes,
} from "@/data/eth";
import { PageProps } from "@/types/PageProps";
import Image from "next/image";
import { Address, Hex } from "viem";

export default async function Create({ params }: PageProps) {
  const { id } = params;
  const [contract, propsalId] = (id as string).split("-");

  const [{ token, metadata, governor }, blockNumber] = await Promise.all([
    getDaoAddresses({
      address: contract as Address,
    }),
    getBlockNumber(),
  ]);

  const [contractMetadata, prop, votes] = await Promise.all([
    getContractMetadata(token, metadata),
    getProposal(governor, propsalId as Hex, blockNumber),
    getProposalVotes(governor, propsalId as Hex, blockNumber),
  ]);
  const title = prop?.description.split("&&")[0];

  return (
    <div>
      <div className="font-semibold ">{title}</div>
      <div className="grid grid-cols-3 gap-6 mt-4 w-full">
        {votes
          .filter((x) => !!x.reason)
          .map((x) => {
            const data = encodeURIComponent(
              JSON.stringify({ vote: x, contractMetadata, title })
            );

            return (
              <div
                className="relative w-full h-full"
                style={{ height: 400 }}
                key={x.voter}
              >
                <Image
                  alt="vote"
                  fill
                  className="object-contain w-full"
                  src={`/api/image?data=${data}`}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
