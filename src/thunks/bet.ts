import { gql, request } from "graphql-request"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { fromWei, toChecksumAddress, toWei } from "../utils/utils"
import { RootState } from "../stores"
import { Urls } from "../constants"
import axios from "axios"
import { PredictionAddress } from "../contracts/prediction"
import predictionAbi from "../contracts/prediction_abi.json"
import type {AbiItem} from "web3-utils"
import Web3 from "web3"

interface BetCallbacks {
  onSent: () => void
  onConfirmed: () => void
  onError: (error: Error | undefined) => void
}

interface MakeBetProps extends BetCallbacks {
  epoch: string
  direction: BetType
  eth: number
}

interface ClaimBetProps extends BetCallbacks {
  epochs: string[]
}

export const claim = createAsyncThunk(
  "bets/claim",
  async (props: ClaimBetProps, thunkApi) => {

    const { epochs, onSent, onConfirmed, onError } = props
    const {game: { game, account, library }} = thunkApi.getState() as RootState
    if (!game) {
      return
    }
    const web3 = new Web3(library)
    const address = PredictionAddress[game.chain]
    const contract = new web3.eth.Contract(predictionAbi as AbiItem[], address)
    return contract.methods.claim(epochs)
      .send({from: account})
      .once('sending', onSent)
      .once('confirmation', onConfirmed)
      .once('error', onError)
  }
)

export const makeBet = createAsyncThunk(
  "bets/make",
  async (props: MakeBetProps, thunkApi) => {
    const { epoch, direction, eth, onSent, onConfirmed, onError } = props

    const {game: { game, account, library }} = thunkApi.getState() as RootState
    if (game === undefined) {
      onError(new Error("Game not defined"))
    } else if (account === undefined || library === undefined) {
      onError(new Error("Not logged in"))
    } else {
      const address = PredictionAddress[game.chain]
      const web3 = new Web3(library)
      const value = toWei(eth.toString(), "ether")
      const betMethod = direction === "bull" ? "betBull" : "betBear"
      const contract = new web3.eth.Contract(predictionAbi as AbiItem[], address)
      return contract.methods[betMethod](epoch)
        .send({ from: account, value })
        .once('sent', onSent)
        .once('confirmation', onConfirmed)
        .once('error', onError)
    }  
  }
)

export const fetchBets = createAsyncThunk(
  "bets/fetch",
  async (address: string, thunkApi) => {
    const {game: { game }} = thunkApi.getState() as RootState

    if (game === undefined) {
      return {bets: []}
    }
    let bets = await getBetHistory(game, { user: address.toLowerCase() })
    let numBets = bets.length
    let idx = 1
    const MAX_QUERIES = 5
    while (numBets === 1000 && idx < MAX_QUERIES) {
      const additional = await getBetHistory(game, { user: address.toLowerCase() }, 1000, 1000 * idx)
      bets = bets.concat(additional)
      numBets = additional.length
      idx += 1
    }
      
    return { bets }
  }
)

const getBetHistory = async (game: GameType, where: WhereClause = {}, first = 1000, skip = 0): Promise<Bet[]> => {
  const res = await getBetHistoryGql(game, where, first, skip)
  const b: Bet[] = res.bets.map(bet => {
    let winner: string | undefined = undefined
    const closePrice = bet.round.closePrice === null ? null : Number(bet.round.closePrice)
    const lockPrice = Number(bet.round.lockPrice)
     if (closePrice === null) {
      winner = "Live"
    } else if (closePrice > lockPrice) {
      winner = "Bull"
    } else if (closePrice < lockPrice) {
      winner = "Bear"
    } else {
      winner = "Draw"
    }
    const won = winner === "Live" ? undefined : bet.position === winner

    return {
      value: toWei(bet.amount, "ether"),
      valueNum: Number(toWei(bet.amount, "ether")),
      valueEthNum: Number(bet.amount),
      direction: bet.position === "Bear" ? "bear" : "bull",
      claimed: bet.claimed,
      epoch: bet.round.epoch,
      won,
      status: bet.claimed ? "claimed" : won ? "claimable" : winner === "Live" ? "pending" : undefined 
    }
  })
  return b
}

const getBetHistoryGql = async (game: GameType, where: WhereClause = {}, first = 1000, skip = 0): Promise<GraphQlBetResponse> => {
  const url = Urls.gqlPrediction[game.chain]
  const response = await request<GraphQlBetResponse>(
    url,
    gql`
      query getBetHistory($first: Int!, $skip: Int!, $where: Bet_filter) {
        bets(first: $first, skip: $skip, where: $where, order: block, orderDirection: desc) {
          amount
          block
          position
          claimed
          round {
            epoch
            failed
            closePrice
            lockPrice
          }
        }
      }
    `,
    // TODO: pull these in somewhere
    // user {
    //   id
    //   createdAt
    //   updatedAt
    //   block
    //   totalBets
    //   totalBetsBull
    //   totalBetsBear
    //   totalBNB
    //   totalBNBBull
    //   totalBNBBear
    //   totalBetsClaimed
    //   totalBNBClaimed
    //   winRate
    //   averageBNB
    //   netBNB
    // }

    { first, skip, where },
  )
  return response
}