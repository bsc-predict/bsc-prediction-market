import { createAsyncThunk } from "@reduxjs/toolkit"

import { calcBlockNumber, createArray, roundComplete } from "../utils/utils"
import { RootState } from "../stores"
import { Urls } from "../constants"
import axios from "axios"
import { csvToJson } from "../api/utils"
import { getContract } from "./utils"


export const fetchArchivedRounds = createAsyncThunk(
  "archive/rounds/fetch",
  async (props: {latest: boolean}, thunkAPI) => {
    const { latest } = props
    const {game: {game, fetchingRounds }} = thunkAPI.getState() as RootState
    if (game === undefined || fetchingRounds !== "archive/rounds/fetch") {
      return []
    }
    const url = latest ? Urls.latestRounds[game.chain] : Urls.allRounds[game.chain]
    const res = await axios.get(url)
    const roundResponse = csvToJson(res.data) as RoundResponse[]
    return roundResponse.map(toRound)
  }
)

export const fetchRounds = createAsyncThunk(
  "rounds/fetch",
  async (props: {epochs: number[]}, thunkAPI) => {
    const {game: {game, rounds, fetchingRounds}} = thunkAPI.getState() as RootState
    if (game === undefined || fetchingRounds !== "rounds/fetch") {
      return []
    }
    const {epochs} = props
    const available = new Set()
    rounds.forEach(r => available.add(r.epochNum))
    const contract = getContract(game)
    const updated = epochs
      .filter(e => !available.has(e))
      .map(async epoch => {
        const r = await contract.methods.rounds(epoch.toString()).call() as Object
        return toRound(r as RoundResponse)
      })
    return Promise.all(updated)
  }
)

export const fetchLatestRounds = createAsyncThunk(
  "rounds/fetchLatest",
  async (n: number, thunkApi) => {
    const {game: {rounds, game, block, intervalBlocks, bufferBlocks, fetchingRounds}} = thunkApi.getState() as RootState
    if (game === undefined || fetchingRounds !== "rounds/fetchLatest") {
      return {updatedRounds: [], paused: false}
    }
    console.log(`fetching... ${game.chain}`)

    const availableEpochs = new Set(rounds.filter(r => roundComplete(r, block, intervalBlocks, bufferBlocks)).map(r => Number(r.id)))
    const contract = getContract(game)
    const currentBlock = calcBlockNumber(block)
    const latest = await contract.methods.currentEpoch().call().then((l: string) => Number(l)) as number
    const epochs = createArray(Math.max(0, latest - n), latest + 1).filter(e => !availableEpochs.has(e))
    const updated = epochs.map(async epoch => {
      const r = await contract.methods.rounds(epoch.toString()).call() as Object
      return toRound(r as RoundResponse)
    })
    
    const updatedRounds = await Promise.all(updated)
    const latestLockBlock = updatedRounds.reduce((lock, r) => r.lockBlockNum > lock ? r.lockBlockNum : lock, 0)
    let paused = false
    if ((currentBlock + bufferBlocks + intervalBlocks) > latestLockBlock) {
      paused = await contract.methods.paused().call()
    }
    return {updatedRounds, paused}
  }
)

export const toRound = (r: RoundResponse): Round => {
  const bearPayout = ((Number(r.bearAmount) + Number(r.bullAmount)) * 0.97) / Number(r.bearAmount)
  const bullPayout = ((Number(r.bearAmount) + Number(r.bullAmount)) * 0.97) / Number(r.bullAmount)
  const bearPayoutGross = ((Number(r.bearAmount) + Number(r.bullAmount))) / Number(r.bearAmount)
  const bullPayoutGross = ((Number(r.bearAmount) + Number(r.bullAmount))) / Number(r.bullAmount)
  const prizePool = (Number(r.bearAmount) + Number(r.bullAmount)).toString()

  return {
    id: r.epoch,
    oracleCalled: r.oracleCalled.toString().toLowerCase().startsWith("true"),
    bearAmount: r.bearAmount,
    bullAmount: r.bullAmount,
    closePrice: r.closePrice,
    epoch: r.epoch,
    lockBlock: r.lockBlock,
    lockPrice: r.lockPrice,
    rewardAmount: r.rewardAmount,
    rewardBaseCalAmount: r.rewardBaseCalAmount,
    startBlock: r.startBlock,
    totalAmount: r.totalAmount,
    bearAmountNum: Number(r.bearAmount),
    bullAmountNum: Number(r.bullAmount),
    closePriceNum: Number(r.closePrice),
    epochNum: Number(r.epoch),
    lockBlockNum: Number(r.lockBlock),
    lockPriceNum: Number(r.lockPrice),
    rewardAmountNum: Number(r.rewardAmount),
    rewardBaseCalAmountNum: Number(r.rewardBaseCalAmount),
    startBlockNum: Number(r.startBlock),
    totalAmountNum: Number(r.totalAmount),
    bullPayout,
    bearPayout,
    bullPayoutGross,
    bearPayoutGross,
    prizePool,
  }
}

