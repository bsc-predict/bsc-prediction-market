import axios from "axios"
import { Urls } from "../constants"
import { web3Provider } from "../utils/web3"

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
      return{ balance: bal, balanceUsd, balanceEth, bnbPrice: price }
    })
  }
