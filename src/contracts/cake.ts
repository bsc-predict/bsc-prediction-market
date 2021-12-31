import { web3Provider } from "src/utils/web3"
import cakeAbi from "../contracts/cake_abi.json"
import type { AbiItem } from "web3-utils"
import { fetchCakePrice } from "src/api"
import { MaxUint256 } from "@ethersproject/constants"
import Web3 from "web3"

export const CakeAddress = {
  main: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
  test: ""
}

const DIVISOR = 1e+18

export const getCakeBalance = async (account: string): Promise<Balance> => {
  const web3 = web3Provider("main")
  const contract = new web3.eth.Contract(cakeAbi as AbiItem[], CakeAddress.main)
  const cakePrice = fetchCakePrice()
  const balance = await contract.methods.balanceOf(web3.utils.toChecksumAddress(account)).call() as string
  return Promise.all([cakePrice, balance]).then(([price, bal]) => {
    const balanceEth = Number(balance) / DIVISOR
    return {
      balance: bal,
      balanceUsd: balanceEth * Number(price),
      price: Number(price),
      balanceEth
    }
  })
}

export const isApprovedCakeSpender = async (owner: string, spender: string): Promise<boolean> => {
  const web3 = web3Provider("main")
  const contract = new web3.eth.Contract(cakeAbi as AbiItem[], CakeAddress.main)
  const res = await contract.methods.allowance(owner, spender).call() as string
  return Number(res) > 0
}

export const approveCakeSpender = async (props: {
  account: string,
  library: any,
  spender: string,
  onSent: () => void,
  onConfirmed: () => void,
  onError: (e: Error) => void
}) => {
  const { account, library, spender, onSent, onConfirmed, onError } = props
  const web3 = new Web3(library)
  const contract = new web3.eth.Contract(cakeAbi as AbiItem[], CakeAddress.main)

  contract.methods.approve(spender, MaxUint256)
    .send({ from: account })
    .once('sent', onSent)
    .once('confirmation', onConfirmed)
    .once('error', onError)

}