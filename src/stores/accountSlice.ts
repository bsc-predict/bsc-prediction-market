import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { fetchBalance, fetchCakeBalance } from "src/thunks/account"


export interface AccountState {
  account?: string
  library?: any
  balance: Balance
  cakeBalance: Balance
}

const initialState: AccountState = {
  balance: { balance: "0", balanceEth: 0, balanceUsd: 0, price: 0 },
  cakeBalance: { balance: "0", balanceEth: 0, balanceUsd: 0, price: 0 },
}

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setAccount(state, action: PayloadAction<{ account?: string, library?: any }>) {
      state.account = action.payload.account
      state.library = action.payload.library
      state.balance = { balance: "0", balanceUsd: 0, balanceEth: 0, price: state.balance.price }
      state.cakeBalance = { balance: "0", balanceUsd: 0, balanceEth: 0, price: state.balance.price }
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchBalance.fulfilled, (state, action) => {
      if (action.payload) {
        state.balance = action.payload
      }
    })
    builder.addCase(fetchCakeBalance.fulfilled, (state, action) => {
      console.log(action.payload)
      if (action.payload) {
        state.cakeBalance = action.payload
      }
    })
  }
})

export const { setAccount } = gameSlice.actions

export default gameSlice.reducer
