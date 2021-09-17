import { useWeb3React } from "@web3-react/core"
import Web3 from "web3"

export const useWeb3 = (chain: Chain) => {
  const { library } = useWeb3React()
  const rpc = chain === "main" ? "https://data-seed-prebsc-2-s1.binance.org:8545" : "https://bsc-dataseed1.binance.org:443"
  const web3 = library ? new Web3(library) : new Web3(rpc)
  return web3
}
