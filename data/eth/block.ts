import client from "./client";

export const getBlockNumber = () => {
  return client.getBlockNumber();
};
