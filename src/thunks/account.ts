import { createAsyncThunk } from "@reduxjs/toolkit"
import { RootState } from "../stores"
import { getBalance } from "../api"
import { getCakeBalance } from "src/contracts/cake"

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

export const fetchCakeBalance = createAsyncThunk(
  "cakeBalance",
  async (address: string | undefined) => {
    if (address === undefined) {
      return 0
    }
   return getCakeBalance(address)
  }
)
