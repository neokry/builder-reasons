import { Address } from "viem";
import client from "./client";
import { normalize } from "viem/ens";

export const getEnsName = ({ address }: { address: Address }) => {
  return client.getEnsName({ address });
};

export const getEnsAvatar = ({ name }: { name: string }) => {
  return client.getEnsAvatar({ name: normalize(name) });
};
