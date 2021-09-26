import { createAsyncThunk } from "@reduxjs/toolkit"
import { toOracle } from "../contracts/oracle"
import { RootState } from "../stores"
import { getOracleContract } from "./utils"

export const fetchLatestOracle = createAsyncThunk(
  "oracle/fetch",
  async (_props: void, thunkAPI) => {
    const {game: { game }} = thunkAPI.getState() as RootState
    if (game === undefined) {
      return undefined
    }
    const contract = getOracleContract(game)
    const data = await contract.methods.latestRoundData().call() as OracleResponse
    return toOracle(data)
  }
)
