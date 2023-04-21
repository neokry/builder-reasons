import {
  getContractMetadata,
  getDaoAddresses,
  getProposal,
  getProposalVotes,
} from "@/data/eth";
import { PageProps } from "@/types/PageProps";
import Image from "next/image";
import { Address, Hex } from "viem";
import { ReasonList } from "@/components/ReasonList";

const IPFS_GATEWAY =
  process.env.NEXT_PUBLIC_IPFS_GATEWAY ||
  "https://ipfs.decentralized-content.com";

export default async function Create({ params }: PageProps) {
  const { id } = params;
  const [contract, propsalId] = (id as string).split("-");

  const { token, metadata, governor } = await getDaoAddresses({
    address: contract as Address,
  });

  if (!token || !metadata || !governor) return null;

  const [contractMetadata, prop, votes] = await Promise.all([
    getContractMetadata(token, metadata),
    getProposal(governor, propsalId as Hex),
    getProposalVotes(governor, propsalId as Hex),
  ]);

  if (!prop) return null;

  const fetchableContractImage = contractMetadata.contractImage.replace(
    "ipfs://",
    `${IPFS_GATEWAY}/ipfs/`
  );

  const title = prop.description.split("&&")[0];

  return (
    <div>
      <div className="flex items-center justify-around">
        <div className="flex flex-col items-center">
          <div className="text-center mt-4">
            <div className="flex items-center justify-center">
              <div className="relative mr-1 w-6 h-6 sm:h-8 sm:w-8">
                <Image
                  alt="contract image"
                  className="object-contain rounded-full"
                  fill
                  unoptimized
                  src={fetchableContractImage}
                />
              </div>
              <div className="text-2xl sm:text-3xl font-bold">
                {contractMetadata.name}
              </div>
            </div>
            <div className="text-lg max-w-screen sm:max-w-xl sm:text-lg bg-gray-100 mt-4 border rounded-2xl p-1 px-6">
              {title}
            </div>
          </div>
        </div>
      </div>
      <ReasonList
        title={title}
        contractMetadata={contractMetadata}
        votes={votes}
      />
    </div>
  );
}
