import axios from "axios"
import { PrdtBnbUsdt } from "src/contracts/prdtPrediction"
import { PsBnbUsdt } from "src/contracts/psPrediction"
import { Urls } from "../constants"
import { web3Provider } from "../utils/web3"
import { csvToJson } from "./utils"

export const fetchBnbPrice = async () => {
  const url = Urls.bnbPrice
  const res = await axios.get(url)
  return res.data.price as string
}

export const fetchCakePrice = async () => {
  const url = Urls.cakePrice
  const res = await axios.get(url)
  return res.data.price as string
}

export const getBalance = async (game: GameType, address: string) => {
  const web3 = web3Provider(game.chain)

  const bnbPrice = await fetchBnbPrice()
  const balance = web3.eth.getBalance(web3.utils.toChecksumAddress(address))

  return Promise.all([bnbPrice, balance])
    .then(([price, bal]) => {
      const balanceEth = Number(web3.utils.fromWei(bal, "ether"))
      const balanceUsd = Number(balanceEth) * Number(price)
      return { balance: bal, balanceUsd, balanceEth, price: Number(price) }
    })
}

export const getArchivedRounds = async (props: { latest: boolean, game: GameType }) => {
  const { latest, game } = props
  if (game === undefined) {
    return []
  }

  let url = ""
  if (game.service === "ps") {
    url = latest ? Urls.bsBnbUsdt.latestRounds[game.chain] : Urls.bsBnbUsdt.allRounds[game.chain]
  } else if (game.service === "prdt") {
    url = latest ? Urls.prdtBnbUsdt.latestRounds[game.chain] : Urls.prdtBnbUsdt.allRounds[game.chain]
  }
  const res = await axios.get(url)
  const roundResponse = csvToJson(res.data)
  if (game.service === "ps") {
    return (roundResponse as PsRoundResponse[]).map(PsBnbUsdt.toRound)
  } else if (game.service === "prdt") {
    const r = (roundResponse as Array<PrdtResponse & PrdtTimestampResponse>).map(r => PrdtBnbUsdt.toRound(r, r))
    return r
  } else {
    return []
  }
}

export const getLeaderboard = async (props: { evenMoney: boolean, game: GameType }): Promise<Leaderboard[]> => {
  const { evenMoney, game } = props
  if (game === undefined) {
    return []
  }
  const url = evenMoney ? Urls.bsBnbUsdt.leaderboardEvenMoney[game.chain] : Urls.bsBnbUsdt.leaderboard[game.chain]
  const res = await axios.get(url)
  const leaderBoardResponse = csvToJson(res.data) as LeaderboardResponse[]
  return leaderBoardResponse.map(r => ({
    account: r.account,
    played: Number(r.played),
    winnings: Number(r.winnings),
    winningsEvenMoney: Number(r.winningsevenmoney),
    averageBetSize: Number(r.averagebetsize)
  }))
}
