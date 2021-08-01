import { useContext } from "react"
import oracleAbi from "./oracle_abi.json"
import Web3 from "web3"
import {AbiItem} from "web3-utils"
import { BlockchainContext, Chain } from "../contexts/BlockchainContext"

const OracleAddresses = {
  main: "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE",
  test: "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526"
}

export const useOracleContract = (chain: Chain) => {
  const {web3Provider} = useContext(BlockchainContext)
  const web3 = web3Provider()
  const oracleAddress = chain === "main" ? OracleAddresses.main : OracleAddresses.test
  const contract = new web3.eth.Contract(oracleAbi as AbiItem[], oracleAddress)

  const getLatestOracleRound = async (): Promise<Oracle> => contract.methods.latestRoundData().call()

  return {getLatestOracleRound}
}
