import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { fetchArchivedRounds, fetchLatestRounds, fetchRounds } from "../thunks/round"
import { setupGame } from "../thunks/game"
import { fetchBets } from "../thunks/bet"
import { enrichBets } from "../utils/bets"
import type { RootState } from "./index"
import { fetchLatestOracle } from "../thunks/oracle"


export interface GameBlock {initial: { timestamp: number }, time: Date}
export interface GameState {
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
  },
}

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {

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
        if (action.payload.oracle && gameEqual(action.payload.game, state.game)) {
          state.oracle = action.payload.oracle
        }
      })
      .addCase(fetchArchivedRounds.fulfilled, (state, action) => {
        if (!gameEqual(action.payload.game, state.game)) { return }
        const merged = mergeRounds(state.rounds, action.payload.rounds)
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
          state.fetchingRounds = undefined
        }
      })
      .addCase(fetchLatestRounds.pending, (state) => {
        if (state.fetchingRounds === undefined) {
          state.fetchingRounds = "rounds/fetchLatest"
        }
      })
      .addCase(fetchLatestRounds.fulfilled, (state, action) => {
        if (!gameEqual(action.payload.game, state.game)) {
          state.fetchingRounds = undefined
          return
        }
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
        if (!gameEqual(action.payload.game, state.game)) { return }
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
  }
})

const gameEqual = (game: GameType | undefined, other: GameType | undefined) => {
  if (game === undefined || other === undefined) {
    return false
  }
  return game.chain === other.chain && game.service === other.service && game.pair === other.pair
}

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