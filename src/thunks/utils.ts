import { web3Provider } from "../utils/web3"
import predictionAbi from "../contracts/prediction_abi.json"
import type {AbiItem} from "web3-utils"
import { PredictionAddress } from "../contracts/prediction"

export const getContract = (game: GameType) => {
    const web3 = web3Provider(game.chain)
    const address = PredictionAddress[game.chain]
    return new web3.eth.Contract(predictionAbi as AbiItem[], address)
  }
  