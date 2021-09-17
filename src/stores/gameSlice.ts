import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { fetchArchivedRounds, fetchLatestRounds, fetchRounds } from "../thunks/round"
import { setupGame } from "../thunks/game"
import { fetchBets } from "../thunks/bet"
import { enrichBets } from "../utils/bets"
import type { RootState } from "./index"

export interface GameState {
  account?: string
  library?: any
  bufferBlocks: number
  intervalBlocks: number
  rewardRate: number
  block: {initial: number, time: Date}
  game?: GameType
  rounds: Round[]
  bets: Bet[]
  paused: boolean
  fetchingRounds?: string
}

const initialState: GameState = {
  bufferBlocks: 20,
  intervalBlocks: 100,
  rewardRate: 0.97,
  block: {initial: 0, time: new Date()},
  game: undefined,
  rounds: [],
  bets: [],
  paused: false,
}

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setAccount(state, action: PayloadAction<{account?: string, library?: any}>) {
      state.account = action.payload.account
      state.library = action.payload.library
    },
    setGame(state, action: PayloadAction<GameType>) {
      state.game = action.payload
      state.rounds = []
      state.bets = []
      state.block = {initial: 0, time: new Date()}
      state.paused = false
    }
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
          bufferBlocks: state.bufferBlocks,
          intervalBlocks: state.intervalBlocks,
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
      .addCase(fetchArchivedRounds.fulfilled, (state, action) => {
        const merged = mergeRounds(state.rounds, action.payload)
        const enriched = enrichBets({
          bets: state.bets,
          rounds: merged,
          block: state.block,
          bufferBlocks: state.bufferBlocks,
          intervalBlocks: state.intervalBlocks,
        })
        state.bets = enriched
        state.rounds = merged
        state.fetchingRounds = undefined
      })
      .addCase(setupGame.fulfilled, (state, action) => {
        if (action.payload === undefined) {
          state = initialState
        } else {
          state.intervalBlocks = action.payload.intervalBlocks
          state.bufferBlocks = action.payload.bufferBlocks
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
          bufferBlocks: state.bufferBlocks,
          intervalBlocks: state.intervalBlocks,
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
          claimed: action.payload.claimed,
          bufferBlocks: state.bufferBlocks,
          intervalBlocks: state.intervalBlocks
        })
        state.bets = enriched
    })
  }
})

export const { setAccount, setGame } = gameSlice.actions

export const rounds = (state: RootState) => state.game.rounds

export default gameSlice.reducer

const mergeRounds = (orig: Round[], update: Round[]) => {
  const toUpdate = new Set(update.map(r => r.id))
  const updated = orig
    .filter(r => !toUpdate.has(r.id))
    .concat(update)
    .sort((r1, r2) => Number(r1.id) < Number(r2.id) ? 1 : -1)
  return updated
}