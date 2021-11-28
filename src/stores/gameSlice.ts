import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { fetchArchivedRounds, fetchLatestRounds, fetchRounds } from "../thunks/round"
import { setupGame } from "../thunks/game"
import { fetchBets } from "../thunks/bet"
import { enrichBets } from "../utils/bets"
import type { RootState } from "./index"
import { fetchBalance } from "../thunks/account"
import { fetchLatestOracle } from "../thunks/oracle"


export interface GameBlock {initial: { timestamp: number }, time: Date}
export interface GameState {
  account?: string
  library?: any
  bufferSeconds: number
  intervalSeconds: number
  rewardRate: number
  block: GameBlock
  game?: GameType
  rounds: Round[]
  bets: Bet[]
  paused: boolean
  fetchingRounds?: string
  oracle: Oracle
  balance: {
    balance: string
    balanceEth: string
    balanceUsd: number
    bnbPrice: number
  }
}

const initialState: GameState = {
  bufferSeconds: 20,
  intervalSeconds: 300,
  rewardRate: 0.97,
  block: {initial: { timestamp: 0 }, time: new Date()},
  game: undefined,
  rounds: [],
  bets: [],
  paused: false,
  oracle: {
    answer: 0,
    answeredInRound: 0,
    roundId: 0,
    startedAt: 0,
    updatedAt: 0
  },
  balance: {
    balance: "0",
    balanceEth: "0",
    balanceUsd: 0,
    bnbPrice: 0,
  }
}

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setAccount(state, action: PayloadAction<{account?: string, library?: any}>) {
      state.account = action.payload.account
      state.library = action.payload.library
      state.bets = []
      state.balance = {balance: "0", balanceUsd: 0, balanceEth: "0", bnbPrice: state.balance.bnbPrice}
    },
    setGame(state, action: PayloadAction<GameType>) {
      state.game = action.payload
      state.rounds = []
      state.bets = []
      state.block = {initial: { timestamp: new Date().getTime() }, time: new Date()}
      state.paused = false
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchRounds.pending, (state) => {
        if (state.fetchingRounds === undefined) {
          state.fetchingRounds = "rounds/fetch"
        }
      })
      .addCase(fetchRounds.fulfilled, (state, action) => {
        const merged = mergeRounds(state.rounds, action.payload)
        const enriched = enrichBets({
          bets: state.bets,
          rounds: merged,
          block: state.block,
          bufferSeconds: state.bufferSeconds,
          intervalSeconds: state.intervalSeconds,
          evenMoney: false,
        })
        state.bets = enriched
        state.rounds = merged
        state.fetchingRounds = undefined
      })
      .addCase(fetchArchivedRounds.pending, (state) => {
        if (state.fetchingRounds === undefined) {
          state.fetchingRounds = "archive/rounds/fetch"
        }
      })
      .addCase(fetchLatestOracle.fulfilled, (state, action) => {
        if (action.payload) {
          state.oracle = action.payload
        }
      })
      .addCase(fetchArchivedRounds.fulfilled, (state, action) => {
        const merged = mergeRounds(state.rounds, action.payload)
        const enriched = enrichBets({
          bets: state.bets,
          rounds: merged,
          block: state.block,
          bufferSeconds: state.bufferSeconds,
          intervalSeconds: state.intervalSeconds,
          evenMoney: false,
        })
        state.bets = enriched
        state.rounds = merged
        state.fetchingRounds = undefined
      })
      .addCase(setupGame.fulfilled, (state, action) => {
        if (action.payload === undefined) {
          state = initialState
        } else {
          state.intervalSeconds = action.payload.intervalBlocks
          state.bufferSeconds = action.payload.bufferBlocks
          state.rewardRate = action.payload.rewardRate
          state.block = action.payload.block
          state.game = action.payload.game
        }
      })
      .addCase(fetchLatestRounds.pending, (state) => {
        if (state.fetchingRounds === undefined) {
          state.fetchingRounds = "rounds/fetchLatest"
        }
      })
      .addCase(fetchLatestRounds.fulfilled, (state, action) => {
        const { updatedRounds, paused } = action.payload
        const merged = mergeRounds(state.rounds, updatedRounds)
        const enriched = enrichBets({
          bets: state.bets,
          rounds: merged,
          block: state.block,
          bufferSeconds: state.bufferSeconds,
          intervalSeconds: state.intervalSeconds,
          evenMoney: false,
        })
        state.paused = paused
        state.bets = enriched
        state.rounds = merged
        state.fetchingRounds = undefined
      })
      .addCase(fetchBets.fulfilled, (state, action) => {
        const enriched = enrichBets({
          bets: action.payload.bets,
          rounds: state.rounds,
          block: state.block,
          bufferSeconds: state.bufferSeconds,
          intervalSeconds: state.intervalSeconds,
          evenMoney: false,
        })
        state.bets = enriched
    })
    .addCase(fetchBalance.fulfilled, (state, action) => {
      if (action.payload) {
        state.balance = action.payload
      }
    })
  }
})

export const { setAccount, setGame } = gameSlice.actions

export const rounds = (state: RootState) => state.game.rounds

export default gameSlice.reducer

const mergeRounds = (orig: Round[], update: Round[]) => {
  const toUpdate = new Set(update.map(r => r.epochNum))
  const updated = orig
    .filter(r => !toUpdate.has(r.epochNum))
    .concat(update)
    .sort((r1, r2) => Number(r1.epochNum) < Number(r2.epochNum) ? 1 : -1)
  return updated
}