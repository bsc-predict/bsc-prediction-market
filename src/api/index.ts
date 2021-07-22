import axios from "axios"
import { getInputType, toRound } from "../contracts/prediction"
import getConfig from "next/config"
import web3 from "../utils/web3"
import { csvToJson } from "./utils"

const Urls = {
  bets: (address: string) => `https://jkfwxgcdmc.execute-api.us-east-1.amazonaws.com/dev/bets/${address}`,
  addressTransactions: (address: string) => `https://account.bscpredict.workers.dev/${address}`,
  bnbPrice: "https://api1.binance.com/api/v3/ticker/price?symbol=BNBUSDT",
  latestRounds: "https://raw.githubusercontent.com/bsc-predict/bsc-predict-updater/master/data/latest.csv",
  allRounds: "https://raw.githubusercontent.com/bsc-predict/bsc-predict-updater/master/data/rounds.csv",
}

export const fetchBets = async (address: string) => {
  const url = Urls.bets(web3.utils.toChecksumAddress(address))
  const res = await axios.get(url)
  return {...res.data, claimed: new Set(res.data.claimed)}
}

// export const fetchBets = async (address: string) => {
//   const url = Urls.addressTransactions(address)
//   const res = await axios.get(url)
//   const transactions = res.data as TransactionResponse
//   const bets: Bet[] = []
//   const claimed = new Set<number>()
//   try {
//     transactions.result.forEach(tran => {
//       const betType = getInputType(tran.input)
//       if (betType?.tag === "claim") {
//         claimed.add(betType.epoch)
//       } else if (betType?.tag === "bull" || betType?.tag === "bear") {
//         bets.push({
//           value: tran.value,
//           valueNum: Number(tran.value),
//           valueEthNum: Number(web3.utils.fromWei(tran.value, "ether")),
//           blockNumber: tran.blockNumber,
//           direction: betType.tag,
//           timeStamp: tran.timeStamp,
//           blockNumberNum: Number(tran.blockNumber),
//         })
//       }
//     })
//     return {bets, claimed}  
//   } catch {
//     return {bets: [], claimed: new Set<number>()}
//   }
// }

export const fetchBnbPrice = async (): Promise<number> => {
  const url = Urls.bnbPrice
  const res = await axios.get(url)
  return res.data.price
}

export const fetchArchivedRounds = async (latest: boolean): Promise<Round[]> => {
  const url = latest ? Urls.latestRounds : Urls.allRounds
  const res = await axios.get(url)
  const roundResponse = csvToJson(res.data) as RoundResponse[]
  return roundResponse.map(toRound)
}
