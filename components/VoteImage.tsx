import { Vote } from "@/data/builder";
import { ImageResponse } from "next/server";

export interface VoteImageProps {
  vote: Vote;
}

export const VoteImage = ({ vote }: VoteImageProps) => {
  return new ImageResponse(<div>Hello</div>);
};
