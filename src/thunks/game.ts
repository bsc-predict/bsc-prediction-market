import { createAsyncThunk } from "@reduxjs/toolkit"
import { web3Provider } from "../utils/web3"
import { getPredictionContract } from "./utils"

export const setupGame = createAsyncThunk(
    "game",
    async (game: GameType) => {
      const web3 = web3Provider(game.chain)
      const contract = getPredictionContract(game)
      let buffer = 0
      let interval = 0
      let rewardRate = 0
      if (game.service === "ps") {
        buffer = contract.methods.bufferSeconds().call()
        interval = contract.methods.intervalSeconds().call()
        rewardRate = contract.methods.treasuryFee().call()
      } else if (game.service === "prdt") {
        interval = contract.methods.intervalSeconds().call()
        rewardRate = contract.methods.treasuryRate().call() * 1000
      }
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
  