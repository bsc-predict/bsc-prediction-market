import { createAsyncThunk } from "@reduxjs/toolkit"
import { web3Provider } from "../utils/web3"
import { RootState } from "../stores"
import { getPredictionContract } from "./utils"

export const setupGame = createAsyncThunk(
    "game",
    async (_state: undefined, thunkApi) => {
      const {game: { game }} = thunkApi.getState() as RootState
      if (game === undefined) {
        return
      }
      // console.log(`setting up game ${game.chain}`)
      const web3 = web3Provider(game.chain)
      const contract = getPredictionContract(game)
      const buffer = contract.methods.bufferSeconds().call()
      const interval = contract.methods.intervalSeconds().call()
      const rewardRate = contract.methods.treasuryFee().call()
      const blockNumber = await web3.eth.getBlockNumber()
      const block = await web3.eth.getBlock(blockNumber)
      return Promise.all([buffer, interval, rewardRate]).then(([b, i, p]) => ({
        bufferBlocks: Number(b),
        intervalBlocks: Number(i),
        rewardRate: 1.0 - (Number(p) / 10000), // treasury fee is in bps
        block: {initial: { timestamp: Number(block.timestamp) }, time: new Date()},
        game
      }))
    }
  )
  