import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { fetchArchivedRounds, fetchLatestRounds, fetchRounds } from "../thunks/round"
import { setupGame } from "../thunks/game"
import { fetchBets } from "../thunks/bet"
import { enrichBets } from "../utils/bets"
import type { RootState } from "./index"
import { fetchBalance } from "../thunks/account"
import { fetchLatestOracle } from "../thunks/oracle"

interface LotteryState {
  lottery: Lottery[]
}

const initialState: LotteryState = {
  lottery: []
}

export const lotterySlice = createSlice({
  name: "lottery",
  initialState,
  reducers: {},
  extraReducers: builder => builder
})

// export const { } = lotterySlice.actions


export default lotterySlice.reducer
