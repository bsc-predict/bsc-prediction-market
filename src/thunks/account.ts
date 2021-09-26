import { createAsyncThunk } from "@reduxjs/toolkit"
import { web3Provider } from "../utils/web3"
import { RootState } from "../stores"
import { fetchBnbPrice } from "../api"

export const fetchBalance = createAsyncThunk(
  "balance",
  async (address: string, thunkApi) => {
    const {game: { game }} = thunkApi.getState() as RootState

    if (game === undefined) {
      return
    }
    const web3 = web3Provider(game.chain)
    
    const bnbPrice = await fetchBnbPrice()
    const balance = web3.eth.getBalance(web3.utils.toChecksumAddress(address))

  return Promise.all([bnbPrice, balance])
    .then(([price, bal]) => {
      const balanceEth = web3.utils.fromWei(bal, "ether")
      const balanceUsd = Number(balanceEth) * price
      return{ balance: bal, balanceUsd, balanceEth, bnbPrice: price }
    })
  }
)
