import { createAsyncThunk } from "@reduxjs/toolkit"
import { fromWei, toChecksumAddress, toWei } from "../utils/utils"
import { RootState } from "../stores"
import { Urls } from "../constants"
import axios from "axios"
import { PredictionAddress } from "../contracts/prediction"
import predictionAbi from "../contracts/prediction_abi.json"
import type {AbiItem} from "web3-utils"
import Web3 from "web3"

interface BetCallbacks {
  onSent: () => void
  onConfirmed: () => void
  onError: (error: Error | undefined) => void
}

interface MakeBetProps extends BetCallbacks {
  direction: BetType
  eth: number
}

interface ClaimBetProps extends BetCallbacks {
  epoch: string
}

export const claim = createAsyncThunk(
  "bets/claim",
  async (props: ClaimBetProps, thunkApi) => {

    const { epoch, onSent, onConfirmed, onError } = props
    const {game: { game, account, library }} = thunkApi.getState() as RootState
    if (!game) {
      return
    }
    const web3 = new Web3(library)
    const address = PredictionAddress[game.chain]
    const contract = new web3.eth.Contract(predictionAbi as AbiItem[], address)
    return contract.methods.claim(epoch)
      .send({from: account})
      .once('sending', onSent)
      .once('confirmation', onConfirmed)
      .once('error', onError)
  }
)

export const makeBet = createAsyncThunk(
  "bets/make",
  async (props: MakeBetProps, thunkApi) => {
    const { direction, eth, onSent, onConfirmed, onError } = props

    const {game: { game, account, library }} = thunkApi.getState() as RootState
    if (game === undefined) {
      onError(new Error("Game not defined"))
    } else if (account === undefined || library === undefined) {
      onError(new Error("Not logged ing"))
    } else {
      const address = PredictionAddress[game.chain]
      const web3 = new Web3(library)
      const value = toWei(eth.toString(), "ether")
      const betMethod = direction === "bull" ? "betBull" : "betBear"
      const contract = new web3.eth.Contract(predictionAbi as AbiItem[], address)
      return contract.methods[betMethod]()
        .send({ from: account, value })
        .once('sent', onSent)
        .once('confirmation', onConfirmed)
        .once('error', onError)
    }  
  }
)

export const fetchBets = createAsyncThunk(
  "bets/fetch",
  async (address: string, thunkApi) => {
    const {game: { game }} = thunkApi.getState() as RootState
    console.log(game)

    if (game === undefined) {
      return {bets: [], claimed: new Set<number>()}
    }
    const url = Urls.bets[game.chain](toChecksumAddress(address))
    return axios.get(url)
      .then((res: {data: BetResponse}) => {
        const bets: Bet[] = res.data.bets.map(b => ({
          ...b,
          valueNum: Number(b.value),
          valueEthNum: Number(fromWei(b.value, "ether")),
          blockNumberNum: Number(b.blockNumber),
        }))
        const claimed = new Set(res.data.claimed)
        return {bets, claimed}
      })
  }
)

