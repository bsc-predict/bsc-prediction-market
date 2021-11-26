import { gql, request } from "graphql-request"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { createArray, fromWei, toWei } from "../utils/utils"
import { RootState } from "../stores"
import { Urls } from "../constants"
import { PredictionAddress } from "../contracts/prediction"
import predictionAbi from "../contracts/prediction_abi.json"
import type { AbiItem } from "web3-utils"
import Web3 from "web3"
import { event } from '../utils/gtag'

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
    const { game: { game, account, library } } = thunkApi.getState() as RootState
    if (!game) {
      return
    }
    event({ action: "claim", category: game.chain, label: "claim", value: 0 })
    const web3 = new Web3(library)
    const address = PredictionAddress[game.chain]
    const contract = new web3.eth.Contract(predictionAbi as AbiItem[], address)
    return contract.methods.claim(epochs)
      .send({ from: account })
      .once('sending', onSent)
      .once('confirmation', onConfirmed)
      .once('error', onError)
  }
)

export const makeBet = createAsyncThunk(
  "bets/make",
  async (props: MakeBetProps, thunkApi) => {
    const { epoch, direction, eth, onSent, onConfirmed, onError } = props

    const { game: { game, account, library } } = thunkApi.getState() as RootState

    if (game === undefined) {
      onError(new Error("Game not defined"))
    } else if (account === undefined || library === undefined) {
      onError(new Error("Not logged in"))
    } else {
      event({ action: "bet", category: game.chain, label: direction, value: 0 })
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
    const { game: { game, library } } = thunkApi.getState() as RootState

    if (game === undefined || library === undefined) {
      return { bets: [] }
    }
    const bets = await getUserRounds(library, game, address, true)
    return { bets }
    // let bets = await getBetHistory(game, { user: address.toLowerCase() })
    // let numBets = bets.length
    // let idx = 1
    // const MAX_QUERIES = 5
    // while (numBets === 1000 && idx < MAX_QUERIES) {
    //   const additional = await getBetHistory(game, { user: address.toLowerCase() }, 1000, 1000 * idx)
    //   bets = bets.concat(additional)
    //   numBets = additional.length
    //   idx += 1
    // }

    // return { bets }
  }
)

export const getBetHistory = async (game: GameType, where: WhereClause = {}, first = 1000, skip = 0): Promise<Bet[]> => {
  const res = await getBetHistoryGql(game, where, first, skip)
  const b: Bet[] = res.bets.map(bet => {
    let winner: string | undefined = undefined
    const closePrice = bet.round.closePrice === null ? null : Number(bet.round.closePrice)
    const lockPrice = Number(bet.round.lockPrice)
    const bullAmountNum = Number(bet.round.bullAmount)
    const bearAmountNum = Number(bet.round.bearAmount)
    const baseReward = (bullAmountNum + bearAmountNum) * 0.97
    let payoff = 0

    if (closePrice === null || closePrice === 0) {
      winner = "Live"
    } else if (closePrice > lockPrice) {
      winner = "Bull"
      payoff = baseReward / bullAmountNum - 1
    } else if (closePrice < lockPrice) {
      winner = "Bear"
      payoff = baseReward / bearAmountNum - 1
    } else {
      winner = "Draw"
    }
    const won = winner === "Live" ? undefined : bet.position === winner
    const value = toWei(bet.amount, "ether")
    const valueNum = Number(value)

    let wonAmount = won ? payoff * valueNum : -valueNum

    return {
      value,
      valueNum,
      valueEthNum: Number(bet.amount),
      direction: bet.position === "Bear" ? "bear" : "bull",
      claimed: bet.claimed,
      epoch: bet.round.epoch,
      won,
      wonAmount,
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
        bets(first: $first, skip: $skip, where: $where, orderBy: block, orderDirection: desc) {
          amount
          block
          position
          claimed
          round {
            bearAmount
            bullAmount
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

export const getUserRounds = async (
  library: any,
  game: GameType,
  user: string,
  latest = false,
) => {
  const web3 = new Web3(library)
  const contractAddress = PredictionAddress[game.chain]
  const contract = new web3.eth.Contract(predictionAbi as AbiItem[], contractAddress)
  const userRoundsLength = latest ? await contract.methods.getUserRoundsLength(user).call().then((n: string) => Number(n)) as number : 0
  let remaining = 0
  let ct = latest ? userRoundsLength - 999 : 0
  const MAX_ITER = latest ? ct + 1 : 20 * 1000
  const bets: Bet[] = []
  while (ct < MAX_ITER) {
    const res = await contract.methods.getUserRounds(
      web3.utils.toChecksumAddress(user),
      ct,
      1000
    ).call() as { 0: string[], 1: Array<[string, string, boolean]>, 2: string }
    const [rounds, results, rem] = [res[0], res[1], res[2]]
    remaining = Number(rem)
    const numItems = Math.min(rounds.length, results.length)
    createArray(0, numItems).forEach(idx => {
      const epoch = rounds[idx]
      const [direction, size, claimed] = results[idx]
      bets.push({
        value: size,
        valueNum: Number(size),
        valueEthNum: Number(fromWei(size, "ether")),
        direction: direction === "0" ? "bull" : "bear",
        claimed,
        epoch,
      })
    })
    ct += numItems
    if (numItems < 1000) { break }
  }
  return bets
}
