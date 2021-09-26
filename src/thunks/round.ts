import { createAsyncThunk } from "@reduxjs/toolkit"

import { calcBlockTimestamp, createArray, roundComplete, toWei } from "../utils/utils"
import { RootState } from "../stores"
import { Urls } from "../constants"
import axios from "axios"
import { csvToJson } from "../api/utils"
import { getPredictionContract } from "./utils"
import { toRound } from "../contracts/prediction"
import request, { gql } from "graphql-request"


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
    const available = new Set(rounds.map(r => r.epoch))
    const remaining = props.epochs.map(e => e.toString()).filter(r => !available.has(r))
    if (remaining.length === 0){
      return []
    }
    return fetchRoundHistory(game, { "epoch_in": remaining } )
    // const {epochs} = props
    // const available = new Set()
    // rounds.forEach(r => available.add(r.epochNum))
    // const contract = getPredictionContract(game)
    // const updated = epochs
    //   .filter(e => !available.has(e))
    //   .map(async epoch => {
    //     const r = await contract.methods.rounds(epoch.toString()).call() as Object
    //     return toRound(r as RoundResponse)
    //   })
    // return Promise.all(updated)
  }
)

export const fetchLatestRounds = createAsyncThunk(
  "rounds/fetchLatest",
  async (n: number, thunkApi) => {
    const {game: {rounds, game, block, intervalSeconds: intervalBlocks, bufferSeconds: bufferBlocks, fetchingRounds}} = thunkApi.getState() as RootState
    if (game === undefined || fetchingRounds !== "rounds/fetchLatest") {
      return {updatedRounds: [], paused: false}
    }

    const availableEpochs = new Set(rounds.filter(r => roundComplete(r, block, intervalBlocks, bufferBlocks)).map(r => r.epochNum))
    const contract = getPredictionContract(game)
    const currentBlock = calcBlockTimestamp(block)
    const latest = await contract.methods.currentEpoch().call().then((l: string) => Number(l)) as number
    const epochs = createArray(Math.max(0, latest - n), latest + 1).filter(e => !availableEpochs.has(e))
    const updated = epochs.map(async epoch => {
      const r = await contract.methods.rounds(epoch.toString()).call() as Object
      return toRound(r as RoundResponse)
    })
    
    const updatedRounds = await Promise.all(updated)
    const latestLockBlock = updatedRounds.reduce((lock, r) => r.lockTimestampNum > lock ? r.lockTimestampNum : lock, 0)

    let paused = false
    if ((currentBlock + bufferBlocks + intervalBlocks) > latestLockBlock) {
      paused = await contract.methods.paused().call()
    }
    return {updatedRounds, paused}
  }
)

const fetchRoundHistory = async (game: GameType, where: WhereClause = {}, first = 1000, skip = 0): Promise<Round[]> => {
  const rounds = await getRoundHistoryGql(game, where, first, skip).then(res => res.rounds.map(r => ({
    bearAmount: toWei(r.bearAmount, "ether"),
    bullAmount: toWei(r.bullAmount, "ether"),
    closePrice: r.closePrice === null ? null : r.closePrice,
    epoch: r.epoch,
    lockAt: r.lockAt,
    lockPrice: r.lockPrice === null ? null : r.lockPrice,
    startAt: r.startAt,
    totalAmount: toWei(r.totalAmount, "ether")
  })))
  const b: Round[] = rounds.map(round => {
    const bearAmountNum = Number(round.bearAmount)
    const bullAmountNum = Number(round.bullAmount)
    const rewardAmountNum = bearAmountNum + bullAmountNum
    
    // TODO: get this treasury fee from contract
    const rewardBaseCalAmountNum = (bearAmountNum + bullAmountNum) * 0.97
    const bearPayout = rewardBaseCalAmountNum / bearAmountNum
    const bullPayout = rewardBaseCalAmountNum / bullAmountNum
    const bearPayoutGross = rewardAmountNum / bearAmountNum
    const bullPayoutGross = rewardAmountNum / bullAmountNum

    const lockPriceNum = round.lockPrice === null ? 0 : Number(round.lockPrice) * 1e+8
    const closePriceNum = round.closePrice === null ? 0 : Number(round.closePrice) * 1e+8

    return {
        oracleCalled: round.closePrice !== null,
        bearAmount: round.bearAmount,
        bullAmount: round.bullAmount,
        closePrice: closePriceNum.toString(),
        epoch: round.epoch,
        lockTimestamp: round.lockAt === null ? "0" : round.lockAt,
        lockPrice: lockPriceNum.toString(),
        rewardAmount: rewardAmountNum.toString(),
        rewardBaseCalAmount: rewardBaseCalAmountNum.toString(),
        startTimestamp: round.startAt,
        totalAmount: round.totalAmount,
        bearAmountNum,
        bullAmountNum,
        closePriceNum,
        epochNum: Number(round.epoch),
        lockTimestampNum: round.lockAt === null ? 0 : Number(round.lockAt),
        lockPriceNum,
        rewardAmountNum,
        rewardBaseCalAmountNum,
        startTimestampNum: Number(round.startAt),
        totalAmountNum: Number(round.totalAmount),
        bullPayout,
        bearPayout,
        bullPayoutGross,
        bearPayoutGross,
        prizePool: rewardAmountNum.toString(),
      }
    })
  return b
}

const getRoundHistoryGql = async (game: GameType, where: WhereClause = {}, first = 1000, skip = 0): Promise<GraphQlRoundResponse> => {
  const url = Urls.gqlPrediction[game.chain]
  const response = await request<GraphQlRoundResponse>(
    url,
    gql`
      query getRoundHistory($first: Int!, $skip: Int!, $where: Round_filter) {
        rounds(first: $first, skip: $skip, where: $where, orderBy: epoch, orderDirection: desc) {
          bearAmount
          bullAmount
          closePrice
          epoch
          lockAt
          lockPrice
          startAt
          totalAmount
        }
      }
    `,
    { first, skip, where },
  )
  return response
}