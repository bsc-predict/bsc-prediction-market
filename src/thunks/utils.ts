import { web3Provider } from "../utils/web3"
import predictionAbi from "../contracts/prediction_abi.json"
import oracleAbi from "../contracts/oracle_abi.json"
import type {AbiItem} from "web3-utils"
import { PredictionAddress } from "../contracts/prediction"
import { OracleAddresses } from "../contracts/oracle"

export const getPredictionContract = (game: GameType) => {
  const web3 = web3Provider(game.chain)
  const address = PredictionAddress[game.chain]
  return new web3.eth.Contract(predictionAbi as AbiItem[], address)
}

export const getOracleContract = (game: GameType) => {
  const web3 = web3Provider(game.chain)
  const address = OracleAddresses[game.chain]
  return new web3.eth.Contract(oracleAbi as AbiItem[], address)
}
