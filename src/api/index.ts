import axios from "axios"
import { toRound } from "src/contracts/prediction"
import { Urls } from "../constants"
import { web3Provider } from "../utils/web3"
import { csvToJson } from "./utils"

export const fetchBnbPrice = async () => {
  const url = Urls.bnbPrice
  const res = await axios.get(url)
  return res.data.price as number
}

export const getBalance = async (game: GameType, address: string) => {
  const web3 = web3Provider(game.chain)

  const bnbPrice = await fetchBnbPrice()
  const balance = web3.eth.getBalance(web3.utils.toChecksumAddress(address))

  return Promise.all([bnbPrice, balance])
    .then(([price, bal]) => {
      const balanceEth = web3.utils.fromWei(bal, "ether")
      const balanceUsd = Number(balanceEth) * price
      return { balance: bal, balanceUsd, balanceEth, bnbPrice: price }
    })
}

export const getArchivedRounds = async (props: { latest: boolean, game: GameType }) => {
  const { latest, game } = props
  if (game === undefined) {
    return []
  }
  const url = latest ? Urls.latestRounds[game.chain] : Urls.allRounds[game.chain]
  const res = await axios.get(url)
  const roundResponse = csvToJson(res.data) as RoundResponse[]
  return roundResponse.map(toRound)
}

export const getLeaderboard = async (props: { evenMoney: boolean, game: GameType }): Promise<Leaderboard[]> => {
  const { evenMoney, game } = props
  if (game === undefined) {
    return []
  }
  const url = evenMoney ? Urls.leaderboardEvenMoney[game.chain] : Urls.leaderboard[game.chain]
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
