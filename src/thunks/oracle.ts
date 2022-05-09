import { createAsyncThunk } from "@reduxjs/toolkit"
import { fetchBnbPrice } from "src/api"
import { toOracle } from "../contracts/oracle"
import { RootState } from "../stores"
import { getOracleContract } from "./utils"

export const fetchLatestOracle = createAsyncThunk(
  "oracle/fetch",
  async (_props: void, thunkAPI) => {
    const { game: { game } } = thunkAPI.getState() as RootState
    if (game === undefined) {
      return { game, oracle: undefined }
    }
    if (game.service === "prdt" && game.pair === "bnbusdt") {
      // TODO: use https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=BNB-USDT
      const answer = await fetchBnbPrice()
      return { game, oracle: { answer: Number(answer) * Math.pow(10, 8) } }
    } else if (game.service === "ps") {
      const contract = getOracleContract(game)
      const data = await contract.methods.latestRoundData().call() as OracleResponse
      const oracle = toOracle(data)
      return { game, oracle }
    } else {
      return { game, oracle: undefined }
    }

  }
)
