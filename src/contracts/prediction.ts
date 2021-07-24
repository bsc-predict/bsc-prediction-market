import predictionAbi from "./prediction_abi.json"
import {useContext} from "react"
import {AbiItem} from "web3-utils"
import web3 from "../utils/web3"
import useWeb3 from "../hooks/useWeb3"
import { useWeb3React } from "@web3-react/core"
import { NotificationsContext } from "../contexts/NotificationsContext"
import { BetsContext } from "../contexts/BetsContext"

const predictionAddress = "0x516ffd7D1e0Ca40b1879935B2De87cb20Fc1124b"


const contract = new web3.eth.Contract(predictionAbi as AbiItem[], predictionAddress)

const bearBet = "0x0088160f"
const bullBet = "0x821daba1"
const claimPrefix = /(?<=0x379607f5).+/g

export const usePredictionContract = () => {
  const web3 = useWeb3()
  const {account} = useWeb3React()
  const {setMessage} = useContext(NotificationsContext)
  const {updateBetStatus} = useContext(BetsContext)

  const makeBet = async (direction: "bull" | "bear", eth: number) => {

    // TODO: Check gas price
    const value = web3.utils.toWei(eth.toString(), "ether")
    const betMethod = direction === "bull" ? "betBull" : "betBear"
    const contract = new web3.eth.Contract(predictionAbi as AbiItem[], predictionAddress)
    return contract.methods[betMethod]()
      .send({ from: account, value })
      .once('sent', () => {
        setMessage({type: "info", message: "", title: "Bet sent", duration: 7000})
      })
      .once('confirmation', async () => {
        setMessage({type: "success", message: "", title: "Bet processed", duration: 7000})
      })
      .once('error', (error: Error | undefined) => {
        setMessage({type: "error", message: error?.message || "", title: "Bet failed", duration: 7000})
      })
  }
  
  const claim = async (epoch: string) => {
    const contract = new web3.eth.Contract(predictionAbi as AbiItem[], predictionAddress)
    contract.methods.claim(epoch)
      .send({from: account})
      .once('sending', () => {
        updateBetStatus(epoch, "pending")
        setMessage({type: "info", message: "", title: "Claim sent", duration: 3000})
      })
      .once('confirmation', async () => {
        updateBetStatus(epoch, "claimed")
        setMessage({type: "success", message: "", title: "Claim processed", duration: 3000})
      })
      .once('error', (error: Error | undefined) => {
        updateBetStatus(epoch, "claimable")
        setMessage({type: "error", message: error?.message || "", title: "Claim failed", duration: 3000})
      })
  }

  return {claim, makeBet}
}


export const getInputType = (input: string): InputType | undefined => {
  if (input === bearBet) {
    return {tag: "bear"}
  } else if (input === bullBet) {
    return {tag: "bull"}
  } else {
    const match = input.match(claimPrefix)
    const epoch = match !== null ? parseInt(match.toString(), 16) : Number.NaN
    if (!Number.isNaN(epoch)) {
      return {tag: "claim", epoch}
    }
  }
  return undefined
}

export const getCurrentEpoch = async (): Promise<string> => contract.methods.currentEpoch().call()

export const getGamePaused = async (): Promise<boolean> => contract.methods.paused().call()

export const fetchRounds = async (epochs: Array<string | number>) => {
  const rounds = epochs.map(async epoch => {
    const r = await contract.methods.rounds(epoch.toString()).call() as Object
    return toRound(r as RoundResponse)
  })
  return await Promise.all(rounds)
}

export const fetchLatestRounds = async (n: number, skip: string[]): Promise<Round[]> => {
  const skipSet = new Set(skip)
  const epoch = await contract.methods.currentEpoch().call()
  const epochs = Array.from(Array(n).keys()).map(offset => `${epoch - offset}`).filter(e => !skipSet.has(e))
  return fetchRounds(epochs)
}

export const toRound = (r: RoundResponse): Round => {
  const bearPayout = ((Number(r.bearAmount) + Number(r.bullAmount)) * 0.97) / Number(r.bearAmount)
  const bullPayout = ((Number(r.bearAmount) + Number(r.bullAmount)) * 0.97) / Number(r.bullAmount)
  const bearPayoutGross = ((Number(r.bearAmount) + Number(r.bullAmount))) / Number(r.bearAmount)
  const bullPayoutGross = ((Number(r.bearAmount) + Number(r.bullAmount))) / Number(r.bullAmount)
  const prizePool = (Number(r.bearAmount) + Number(r.bullAmount)).toString()

  return {
    id: r.epoch,
    oracleCalled: r.oracleCalled,
    bearAmount: r.bearAmount,
    bullAmount: r.bullAmount,
    closePrice: r.closePrice,
    epoch: r.epoch,
    lockBlock: r.lockBlock,
    lockPrice: r.lockPrice,
    rewardAmount: r.rewardAmount,
    rewardBaseCalAmount: r.rewardBaseCalAmount,
    startBlock: r.startBlock,
    totalAmount: r.totalAmount,
    bearAmountNum: Number(r.bearAmount),
    bullAmountNum: Number(r.bullAmount),
    closePriceNum: Number(r.closePrice),
    epochNum: Number(r.epoch),
    lockBlockNum: Number(r.lockBlock),
    lockPriceNum: Number(r.lockPrice),
    rewardAmountNum: Number(r.rewardAmount),
    rewardBaseCalAmountNum: Number(r.rewardBaseCalAmount),
    startBlockNum: Number(r.startBlock),
    totalAmountNum: Number(r.totalAmount),
    bullPayout,
    bearPayout,
    bullPayoutGross,
    bearPayoutGross,
    prizePool,
  }
}