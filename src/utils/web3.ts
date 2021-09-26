import Web3 from "web3"
import { Urls } from "../constants"

export const web3Provider = (chain: Chain) => {
  const rpc = chain === "test" ? Urls.rpc.test : Urls.rpc.main
  return new Web3(rpc)
}
