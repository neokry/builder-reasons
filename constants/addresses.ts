import { Address } from "viem";

export const PUBLIC_MANAGER_ADDRESS = {
  1: "0xd310a3041dfcf14def5ccbc508668974b5da7174",
  5: "0x0E9F3382Cf2508E3bc83248B5b4707FbA86D7Ee0",
}[process.env.NEXT_PUBLIC_CHAIN_ID || 1] as Address;
