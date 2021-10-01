import { createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../stores"
import { getBalance } from "../api"

export const fetchBalance = createAsyncThunk(
  "balance",
  async (address: string, thunkApi) => {
    const {game: { game }} = thunkApi.getState() as RootState

    if (game === undefined) {
      return
    }
   return getBalance(game, address)
  }
)
