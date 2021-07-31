import { useWeb3React } from "@web3-react/core"
import Web3 from "web3"
import { fetchBnbPrice } from "../api"
import { useWeb3 } from "../hooks/useWeb3"

export const getBalance = async (web3: Web3, account: string): Promise<Balance> => {

  const bnbPrice = fetchBnbPrice()
  const balance = web3.eth.getBalance(web3.utils.toChecksumAddress(account))

  return Promise.all([bnbPrice, balance])
    .then(([price, bal]) => {
      const balanceEth = web3.utils.fromWei(bal, "ether")
      const balanceUsd = Number(balanceEth) * price
      return{balance: bal, balanceUsd, balanceEth, bnbPrice: price}
    })
}

export const shortenAddress = (address: string) => address.slice(0,4).concat("...").concat(address.slice(address.length-4))
