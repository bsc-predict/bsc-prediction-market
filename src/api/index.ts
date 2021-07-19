import axios from "axios"
import { getInputType, toRound } from "../contracts/prediction"
import getConfig from "next/config"
import web3 from "../utils/web3"
import { csvToJson } from "./utils"

const { publicRuntimeConfig } = getConfig()

const apiKey = publicRuntimeConfig.BSC_API_KEY

const Urls = {
  addressTransactions: (address: string) =>
    `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=1&endblock=99999999&sort=asc&apikey=${apiKey}`,
  bnbPrice: "https://api1.binance.com/api/v3/ticker/price?symbol=BNBUSDT",
  latestRounds: "https://raw.githubusercontent.com/bsc-predict/bsc-predict-updater/master/data/latest.csv",
  allRounds: "https://raw.githubusercontent.com/bsc-predict/bsc-predict-updater/master/data/rounds.csv",
}

export const fetchBets = async (address: string) => {
  const url = Urls.addressTransactions(address)
  const res = await axios.get(url)
  const transactions = res.data as TransactionResponse
  const bets: Bet[] = []
  const claimed = new Set<number>()
  transactions.result.forEach(tran => {
    const betType = getInputType(tran.input)
    if (betType?.tag === "claim") {
      claimed.add(betType.epoch)
    } else if (betType?.tag === "bull" || betType?.tag === "bear") {
      bets.push({
        value: tran.value,
        valueNum: Number(tran.value),
        valueEthNum: Number(web3.utils.fromWei(tran.value, "ether")),
        blockNumber: tran.blockNumber,
        direction: betType.tag,
        timeStamp: tran.timeStamp,
        blockNumberNum: Number(tran.blockNumber),
      })
    }
  })
  return {bets, claimed}
}

export const fetchBnbPrice = async (): Promise<number> => {
  const url = Urls.bnbPrice
  const res = await axios.get(url)
  return res.data.price
}

export const fetchRounds = async (latest: boolean): Promise<Round[]> => {
  const url = latest ? Urls.latestRounds : Urls.allRounds
  const res = await axios.get(url)
  const roundResponse = csvToJson(res.data) as RoundResponse[]
  return roundResponse.map(toRound)
}
