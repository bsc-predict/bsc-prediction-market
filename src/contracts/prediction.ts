import { web3Provider } from "../utils/web3"
import predictionAbi from "../contracts/prediction_abi.json"
import type {AbiItem} from "web3-utils"

export const PredictionAddress = {
  main: "0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA",
  test: "0x5E5D4d6337Ac83Ef71fEb143669D95073D0e9462"
}

const bearBet = "0xaa6b873a"
const bullBet = "0x57fb096f"
const claimPrefix = /(?<=0x6ba4c138).+/g


export const getInputType = (input: string): InputType | undefined => {
  if (input.startsWith(bearBet)) {
    return {tag: "bear"}
  } else if (input.startsWith(bullBet)) {
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

export const fetchRounds = async (
  game: GameType,
  epochs: Array<string | number>
  ): Promise<Round[]> => {
  const web3 = web3Provider(game.chain)
  const address = PredictionAddress[game.chain]
  const contract = new web3.eth.Contract(predictionAbi as AbiItem[], address)

  const rounds = epochs.map(async epoch => {
    const r = await contract.methods.rounds(epoch.toString()).call() as Object
    return toRound(r as RoundResponse)
  })
  return await Promise.all(rounds)
}


export const toRound = (r: RoundResponse): Round => {
  const bearPayout = ((Number(r.bearAmount) + Number(r.bullAmount)) * 0.97) / Number(r.bearAmount)
  const bullPayout = ((Number(r.bearAmount) + Number(r.bullAmount)) * 0.97) / Number(r.bullAmount)
  const bearPayoutGross = ((Number(r.bearAmount) + Number(r.bullAmount))) / Number(r.bearAmount)
  const bullPayoutGross = ((Number(r.bearAmount) + Number(r.bullAmount))) / Number(r.bullAmount)
  const prizePool = (Number(r.bearAmount) + Number(r.bullAmount)).toString()

  return {
    oracleCalled: r.oracleCalled.toString().toLowerCase().startsWith("true"),
    bearAmount: r.bearAmount,
    bullAmount: r.bullAmount,
    closePrice: r.closePrice,
    epoch: r.epoch,
    lockTimestamp: r.lockTimestamp,
    lockPrice: r.lockPrice,
    rewardAmount: r.rewardAmount,
    rewardBaseCalAmount: r.rewardBaseCalAmount,
    startTimestamp: r.startTimestamp,
    totalAmount: r.totalAmount,
    bearAmountNum: Number(r.bearAmount),
    bullAmountNum: Number(r.bullAmount),
    closePriceNum: Number(r.closePrice),
    epochNum: Number(r.epoch),
    lockTimestampNum: Number(r.lockTimestamp),
    lockPriceNum: Number(r.lockPrice),
    rewardAmountNum: Number(r.rewardAmount),
    rewardBaseCalAmountNum: Number(r.rewardBaseCalAmount),
    startTimestampNum: Number(r.startTimestamp),
    totalAmountNum: Number(r.totalAmount),
    bullPayout,
    bearPayout,
    bullPayoutGross,
    bearPayoutGross,
    prizePool,
  }
}
