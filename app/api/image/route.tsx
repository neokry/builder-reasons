import { ContractMetadata, Vote } from "@/data/contract";
import { ImageResponse } from "next/server";

export interface ImageGenerationRequest {
  vote: Vote;
  contractMetadata: ContractMetadata;
  title: string;
}

const IPFS_GATEWAY =
  process.env.NEXT_PUBLIC_IPFS_GATEWAY ||
  "https://ipfs.decentralized-content.com";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawData = searchParams.get("data");

  if (!rawData) return new Response(null, { status: 404 });

  const { vote, title, contractMetadata } = JSON.parse(
    decodeURIComponent(rawData)
  ) as ImageGenerationRequest;

  const fetchableContractImage = contractMetadata.contractImage.replace(
    "ipfs://",
    `${IPFS_GATEWAY}/ipfs/`
  );

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

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          height: "100%",
          width: "100%",
          padding: 40,
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: "#090909",
          borderRadius: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            style={{
              height: 80,
              width: 80,
              marginRight: 12,
              borderRadius: 9999,
            }}
            alt="dao"
            src={fetchableContractImage}
          />
          <h1 style={{ fontSize: 60, fontWeight: 800 }}>
            {contractMetadata.name}
          </h1>
        </div>
        <h2 style={{ fontSize: 40, fontWeight: 800 }}>{title}</h2>
        <p style={{ fontSize: 30 }}>{vote.reason}</p>
        <p style={{ position: "absolute", fontSize: 40, bottom: 40, left: 40 }}>
          {vote.voter?.slice(0, 8)}...
        </p>
        <p
          style={{ position: "absolute", fontSize: 40, bottom: 40, right: 40 }}
        >
          {getSupport()}
        </p>
      </div>
    ),
    { height: 1000, width: 1000 }
  );
}
