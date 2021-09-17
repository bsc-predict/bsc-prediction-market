import { createAsyncThunk } from "@reduxjs/toolkit"
import { web3Provider } from "../utils/web3"
import predictionAbi from "../contracts/prediction_abi.json"
import type {AbiItem} from "web3-utils"
import { PredictionAddress } from "../contracts/prediction"
import { RootState } from "../stores"

export const setupGame = createAsyncThunk(
    "game",
    async (_state: undefined, thunkApi) => {
      const {game: { game }} = thunkApi.getState() as RootState
      if (game === undefined) {
        return
      }
      console.log(`setting up game ${game.chain}`)
      const web3 = web3Provider(game.chain)
      const address = PredictionAddress[game.chain]
      const contract = new web3.eth.Contract(predictionAbi as AbiItem[], address)
      const buffer = contract.methods.bufferBlocks().call()
      const interval = contract.methods.intervalBlocks().call()
      const rewardRate = contract.methods.rewardRate().call()
      const blockNumber = web3.eth.getBlockNumber()
      return Promise.all([buffer, interval, rewardRate, blockNumber]).then(([b, i, p, block]) => ({
        bufferBlocks: Number(b),
        intervalBlocks: Number(i),
        rewardRate: Number(p),
        block: {initial: block, time: new Date()},
        game
      }))
    }
  )
  