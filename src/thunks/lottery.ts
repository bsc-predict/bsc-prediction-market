import { createAsyncThunk } from "@reduxjs/toolkit"
import { fetchLatestLottery, fetchLotteryHistory, fetchUserInfo } from "src/contracts/lottery"
import { RootState } from "src/stores"
import { LotteryState } from "src/stores/lotterySlice"

export const fetchLotteryHistoryThunk = createAsyncThunk(
  "lottery-history",
  async () => fetchLotteryHistory()
)

export const fetchLatestLotteryThunk = createAsyncThunk(
  "lottery-latest",
  async () => fetchLatestLottery()
)

export const fetchLotteryBetsThunk = createAsyncThunk(
  "lottery-bets",
  async (props: { ids: number[] }, thunkAPI) => {
    const { account: accountState } = thunkAPI.getState() as RootState
    const account = accountState.account
    if (account) {
      const { ids } = props
      const res = ids.map(id => fetchUserInfo(account, id))
      const bets = await Promise.all(res).then(b => b.flat())
      return { bets, ids }
    }
  }
)
