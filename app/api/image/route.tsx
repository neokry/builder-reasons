import { ContractMetadata, Vote } from "@/data/eth";
import { ImageResponse } from "next/server";

export const runtime = "edge";

export interface ImageGenerationRequest {
  vote: Vote;
  contractMetadata: ContractMetadata;
  title: string;
}

const ptRootRegular = fetch(
  new URL("public/fonts/pt-root-ui_regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const ptRootMedium = fetch(
  new URL("public/fonts/pt-root-ui_medium.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const ptRootBold = fetch(
  new URL("public/fonts/pt-root-ui_bold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const IPFS_GATEWAY =
  process.env.NEXT_PUBLIC_IPFS_GATEWAY ||
  "https://ipfs.decentralized-content.com";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawData = searchParams.get("data");

  if (!rawData) return new Response(null, { status: 404 });

  const [ptRootRegularData, ptRootMediumData, ptRootBoldData] =
    await Promise.all([ptRootRegular, ptRootMedium, ptRootBold]);

  const { vote, title, contractMetadata } = JSON.parse(
    rawData
  ) as ImageGenerationRequest;

  const fetchableContractImage = contractMetadata.contractImage.replace(
    "ipfs://",
    `${IPFS_GATEWAY}/ipfs/`
  );

  const fetchableAvatar = vote.avatar?.replace(
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

  const name = vote.ens ?? `${vote.voter?.slice(0, 8)}...`;

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
          fontFamily: "PT Root UI",
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
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 40,
            display: "flex",
            alignItems: "center",
          }}
        >
          {fetchableAvatar && (
            <img
              alt="user avatar"
              style={{
                height: 40,
                width: 40,
                borderRadius: 9999,
                marginRight: 10,
              }}
              src={fetchableAvatar}
            />
          )}
          <p style={{ fontSize: 40 }}>{name}</p>
        </div>
        <p
          style={{ position: "absolute", fontSize: 40, bottom: 40, right: 40 }}
        >
          {getSupport()}
        </p>
      </div>
    ),
    {
      height: 1000,
      width: 1000,
      fonts: [
        {
          name: "PT Root UI",
          data: ptRootRegularData,
          style: "normal",
          weight: 400,
        },
        {
          name: "PT Root UI",
          data: ptRootMediumData,
          style: "normal",
          weight: 500,
        },
        {
          name: "PT Root UI",
          data: ptRootBoldData,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
