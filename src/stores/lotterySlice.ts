import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { fetchLatestLotteryThunk, fetchLotteryBetsThunk, fetchLotteryHistoryThunk } from "src/thunks/lottery"
import { uniqBy } from "src/utils/utils"

export interface LotteryState {
  history: Lottery[]
  latest?: Lottery
  bets: UserInfo[]
  lotteriesQueried: number[]
}

const initialState: LotteryState = {
  lotteriesQueried: [],
  history: [],
  bets: [],
}

export const lotterySlice = createSlice({
  name: "lottery",
  initialState,
  reducers: {},

  extraReducers: builder => {
    builder.addCase(fetchLotteryHistoryThunk.fulfilled, (state, action) => {
      state.history = action.payload.sort((a, b) => a.id < b.id ? 1 : -1)
    })
    builder.addCase(fetchLatestLotteryThunk.fulfilled, (state, action) => {
      state.latest = action.payload
    })
    builder.addCase(fetchLotteryBetsThunk.fulfilled, (state, action) => {
      if (action.payload) {
        const { bets, ids } = action.payload
        const combined = uniqBy(state.bets.concat(bets), b => b.ticketId)
        const updated = uniqBy(state.lotteriesQueried.concat(ids), i => i).sort((a, b) => a < b ? 1 : -1)
        state.bets = combined
        state.lotteriesQueried = updated
      }
    })

  }
})

// export const { } = lotterySlice.actions


export default lotterySlice.reducer
