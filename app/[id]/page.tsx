import { getProposal } from "@/data/builder";
import { getContractMetadata, getDaoAddresses } from "@/data/contract";
import { PageProps } from "@/types/PageProps";
import Image from "next/image";
import { Address } from "viem";

export default async function Create({ params }: PageProps) {
  const { id } = params;
  const [contract, propsalId] = (id as string).split("-");

  const { token, metadata } = await getDaoAddresses({
    address: contract as Address,
  });
  const [contractMetadata, prop] = await Promise.all([
    getContractMetadata(token, metadata),
    getProposal(propsalId as string),
  ]);

  return (
    <div>
      <div className="font-semibold ">{prop.title}</div>
      <div className="grid grid-cols-3 gap-6 mt-4 w-full">
        {prop.votes
          .filter((x) => !!x.reason)
          .map((x) => {
            const data = encodeURIComponent(
              JSON.stringify({ vote: x, contractMetadata, title: prop.title })
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
                  unoptimized
                  src={`/api/image?data=${data}`}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
