import oracleAbi from "./oracle_abi.json"
import Web3 from "web3"
import {AbiItem} from "web3-utils"

const oracleAddress = "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE"

const web3 = new Web3('https://bsc-dataseed1.binance.org:443')

const contract = new web3.eth.Contract(oracleAbi as AbiItem[], oracleAddress)

export const getLatestOracleRound = async (): Promise<Oracle> => {
  const round = await contract.methods.latestRoundData().call()
  return round
}
