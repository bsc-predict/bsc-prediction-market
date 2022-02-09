import { web3Provider } from "../utils/web3"
import predictionAbi from "../contracts/prediction_abi.json"
import oracleAbi from "../contracts/oracle_abi.json"
import type {AbiItem} from "web3-utils"
import { BnbUsdtPredictionAddress } from "../contracts/prediction"
import { OracleAddresses } from "../contracts/oracle"

export const getPredictionContract = (game: GameType) => {
  const web3 = web3Provider(game.chain)
  const address = BnbUsdtPredictionAddress[game.chain]
  return new web3.eth.Contract(predictionAbi as AbiItem[], address)
}

export const getOracleContract = (game: GameType) => {
  const web3 = web3Provider(game.chain)
  const address = OracleAddresses[game.chain]
  return new web3.eth.Contract(oracleAbi as AbiItem[], address)
}

export const maxMod = (n: number, k: number) => {
  // Returns the number less than or equal to k that gives you the maximum modulus when MOD n
  let max = k
  let prior = 0
  while (max > 0) {
    const mod = n % max
    if (prior > mod) {
      return max + 1
    }
    prior = mod
    max -= 1
  }
  return max
}

