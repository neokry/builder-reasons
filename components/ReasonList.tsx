"use client";

import { ImageGenerationRequest } from "@/app/api/image/route";
import { ContractMetadata } from "@/data/viem";
import { Vote } from "@/data/wagmi";
import Image from "next/image";
import ModalWrapper from "./ModalWraper";
import { useState } from "react";

export interface ReasonListProps {
  votes: Vote[];
  contractMetadata: ContractMetadata;
  title: string;
}

export const ReasonList: React.FC<ReasonListProps> = ({
  votes,
  contractMetadata,
  title,
}) => {
  const [open, setOpen] = useState(false);
  const [vote, setVote] = useState<Vote | undefined>();
  const props = { contractMetadata, title };

  const onSelected = (vote: Vote) => {
    setVote(vote);
    setOpen(true);
  };

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4 mt-8">
      <Modal open={open} setOpen={setOpen} vote={vote} {...props} />
      {votes
        .filter((x) => !!x.reason)
        .map((x) => (
          <Preview key={x.voter} vote={x} onSelected={onSelected} {...props} />
        ))}
    </div>
  );
};

const Preview: React.FC<
  ImageGenerationRequest & { onSelected: (vote: Vote) => void }
> = ({ vote, onSelected }) => {
  const name = vote.ens ?? `${vote.voter?.slice(0, 8)}...`;

  const getSupport = () => {
    switch (vote.support) {
      case "0":
        return "Against";
      case "1":
        return "For";
      case "2":
        return "Abstain";
    }
  };

  return (
    <button
      onClick={() => onSelected(vote)}
      className="break-inside-avoid break-after-column border w-full text-left p-4 rounded-lg hover:scale-105 transition-transform"
      key={vote.voter}
    >
      <div className="text-sm">{vote.reason}</div>
      <div className="flex items-center justify-between mt-6">
        <div>{name}</div>
        <div>{getSupport()}</div>
      </div>
    </button>
  );
};

const Modal: React.FC<
  Partial<ImageGenerationRequest> & {
    open: boolean;
    setOpen: (value: boolean) => void;
  }
> = ({ vote, contractMetadata, title, open, setOpen }) => {
  const data = encodeURIComponent(
    JSON.stringify({ vote, contractMetadata, title })
  );

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <div className="relative h-[80vw] sm:h-[50vw] md:h-[500px] w-[80vw] sm:w-[50vw] md:w-[500px]">
        <Image
          alt="vote"
          className="object-contain"
          unoptimized
          fill
          src={`/api/image?data=${data}`}
        />
      </div>
    </ModalWrapper>
  );
};
