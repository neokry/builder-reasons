"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export const ProposalInput = () => {
  const [propLink, setPropLink] = useState("");

  const { propId, contract } = useMemo(() => {
    const linkStart = "https://nouns.build/dao/";
    if (!propLink.startsWith(linkStart) || !propLink.includes("vote"))
      return {};
    const cleanLink = propLink.split("?")[0];
    const propId = cleanLink.slice(-66);
    const contract = cleanLink.replace(linkStart, "").slice(0, 42);
    return { propId, contract };
  }, [propLink]);

  const link =
    propId && contract ? (
      <Link
        href={`/prop/${contract}-${propId}`}
        className="bg-black text-white rounded-md py-2 mt-2 text-center"
      >
        Continue
      </Link>
    ) : (
      <div className="bg-gray-500 text-white rounded-md py-2 mt-2 text-center">
        Continue
      </div>
    );

  return (
    <div className="w-full flex items-center justify-around">
      <div className="flex flex-col w-full sm:w-[500px] p-4 sm:p-12">
        <div className="font-semibold">Proposal link</div>
        <input
          value={propLink}
          placeholder="https://nouns.build...."
          onChange={(e) => setPropLink(e.target.value)}
          className="bg-gray-100 rounded-md py-2 px-4 mt-1 focus:outline-none"
        />
        {link}
      </div>
    </div>
  );
};
