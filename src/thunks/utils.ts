import { web3Provider } from "../utils/web3"
import prdtPredictionAbi from "../contracts/prdt_prediction_abi.json"
import psPredictionAbi from "../contracts/ps_prediction_abi.json"
import oracleAbi from "../contracts/oracle_abi.json"
import type {AbiItem} from "web3-utils"
import { PsBnbUsdtPredictionAddress } from "../contracts/psPrediction"
import { PrdtBnbUsdtPredictionAddress } from "../contracts/prdtPrediction"
import { OracleAddresses } from "../contracts/oracle"

export const getPredictionContract = (game: GameType) => {
  const web3 = web3Provider(game.chain)
  if (game.service === "ps") {
    const address = PsBnbUsdtPredictionAddress[game.chain]
    return new web3.eth.Contract(psPredictionAbi as AbiItem[], address)      
  } else {
    const address = PrdtBnbUsdtPredictionAddress[game.chain]
    return new web3.eth.Contract(prdtPredictionAbi as AbiItem[], address)
  }
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

