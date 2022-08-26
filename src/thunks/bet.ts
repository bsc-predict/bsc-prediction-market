import { gql, request } from "graphql-request"
import { createAsyncThunk } from "@reduxjs/toolkit"
import { toWei } from "../utils/utils"
import { RootState } from "../stores"
import { Urls } from "../constants"
import { PsBnbUsdt } from "../contracts/psPrediction"
import { PrdtBnbUsdt } from "src/contracts/prdtPrediction"
interface BetCallbacks {
  onSent: () => void
  onConfirmed: () => void
  onError: (error: Error | undefined) => void
}

interface MakeBetProps extends BetCallbacks {
  epoch: string
  direction: BetType
  eth: number
  account: string
  library: any
}

interface ClaimBetProps extends BetCallbacks {
  epochs: string[]
  account: string
  library: any
}

export const claim = createAsyncThunk(
  "bets/claim",
  async (props: ClaimBetProps, thunkApi) => {

    const { epochs, onSent, onConfirmed, onError, account, library } = props
    const { game: { game } } = thunkApi.getState() as RootState
    if (!game) {
      return
    }

    if (game.pair === "bnbusdt") {
      return PsBnbUsdt.claim({ game, epochs, library, onSent, onConfirmed, onError, account })
    }
  }
)

export const makeBet = createAsyncThunk(
  "bets/make",
  async (props: MakeBetProps, thunkApi) => {
    const { epoch, direction, eth, onSent, onConfirmed, onError, account, library } = props

    const { game: { game } } = thunkApi.getState() as RootState

    if (game === undefined) {
      onError(new Error("Game not defined"))
    } else if (account === undefined || library === undefined) {
      onError(new Error("Not logged in"))
    } else if (game.pair === "bnbusdt") {
      const f = game.service === "prdt" ? PrdtBnbUsdt.makeBet : PsBnbUsdt.makeBet
      f({
        game,
        library,
        direction,
        epoch,
        account,
        eth,
        onSent,
        onConfirmed,
        onError,
      })
    }
  }
)

export const fetchBets = createAsyncThunk(
  "bets/fetch",
  async (props: { account: string }, thunkApi) => {
    const { account } = props
    const { game: { game } } = thunkApi.getState() as RootState

    if (game === undefined) {
      return { bets: [] }
    }
    const bets = await PsBnbUsdt.fetchUserRounds({ game, account, latest: true })
    return { game, bets }
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
  const url = Urls.bsBnbUsdt.gqlPrediction[game.chain]
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
