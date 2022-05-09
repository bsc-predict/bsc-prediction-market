import { web3Provider } from "../utils/web3"
import predictionAbi from "./prdt_prediction_abi.json"
import type { AbiItem } from "web3-utils"
import mixpanel from "mixpanel-browser"
import Web3 from "web3"
import { createArray, fromWei, toWei } from "src/utils/utils"

export const PrdtBnbUsdtPredictionAddress = {
  main: "0x5C7D19566c330Be63458510AD45B7d5fb6EB7403",
  test: "",
}

const PrdtBnbUsdtPredictionFactoryAddress = {
  main: "0x3fc376530Ac35d37Dd1Fa794F922e0f30CbB2c46",
  test: "",
}

export const PrdtBnbUsdt = {
  fetchRounds: async (
    game: GameType,
    epochs: Array<string | number>
  ): Promise<Round[]> => {
    const web3 = web3Provider(game.chain)
    const address = PrdtBnbUsdtPredictionAddress[game.chain]
    const contract = new web3.eth.Contract(predictionAbi as AbiItem[], address)
    const rounds = epochs.map(async epoch => {
      const r = await contract.methods.rounds(epoch.toString()).call() as Object
      const t = await contract.methods.timestamps(epoch.toString()).call() as Object
      return PrdtBnbUsdt.toRound({epoch, ...r} as PrdtResponse, t as PrdtTimestampResponse)
    })
    return await Promise.all(rounds)
  },

  claim: async (props: {
    account: string,
    game: GameType,
    epochs: string[],
    library: any,
    onSent: () => void
    onConfirmed: () => void
    onError: (e: Error | undefined) => void
  }) => {
    const { game, epochs, account, library, onSent, onConfirmed, onError } = props
    const web3 = new Web3(library)
    const address = PrdtBnbUsdtPredictionAddress[game.chain]
    const contract = new web3.eth.Contract(predictionAbi as AbiItem[], address)
    return contract.methods.claim(account, epochs)
      .send({ from: account })
      .once('sending', () => {
        mixpanel.track("predict-claim", { category: game.chain, status: "sent" })
        onSent()
      })
      .once('confirmation', () => {
        mixpanel.track("predict-claim", { category: game.chain, status: "confirmed" })
        onConfirmed()
      })
      .once('error', (e: Error | undefined) => {
        mixpanel.track("predict-claim", { category: game.chain, status: "error", body: JSON.stringify(e) })
        onError(e)
      })
  },

  makeBet: async (props: {
    game: GameType,
    library: any,
    direction: BetType,
    epoch: string,
    account: string,
    eth: number,
    onSent: () => void,
    onConfirmed: () => void,
    onError: (e?: Error) => void,
  }) => {
    const { game, library, direction, epoch, account, eth, onSent, onConfirmed, onError } = props
    const address = PrdtBnbUsdtPredictionFactoryAddress[game.chain]
    const web3 = new Web3(library)
    const value = toWei(eth.toString(), "ether")
    const betMethod = direction === "bull" ? "betBull" : "betBear"
    const contract = new web3.eth.Contract(predictionAbi as AbiItem[], address)
    return contract.methods[betMethod](1, epoch, value)
      .send({ from: account, value })
      .once('sent', () => {
        mixpanel.track("predict-bet", { category: game.chain, status: "sent" })
        onSent()
      })
      .once('confirmation', () => {
        mixpanel.track("predict-bet", { category: game.chain, status: "confirmed" })
        onConfirmed()
      })
      .once('error', (e: Error | undefined) => {
        mixpanel.track("predict-bet", { category: game.chain, status: "error", body: JSON.stringify(e) })
        onError(e)
      })
  },


  fetchUserRounds: async (props: {
    game: GameType,
    account: string,
    latest: boolean,
  }) => {
    const { game, account, latest } = props

    const contractAddress = PrdtBnbUsdtPredictionAddress[game.chain]
    const web3 = web3Provider(game.chain)
    const contract = new web3.eth.Contract(predictionAbi as AbiItem[], contractAddress)
    const userRoundsLength = await contract.methods.getUserRoundsLength(account).call().then((n: string) => Number(n)) as number
    const bets: Bet[] = []
    let numItems = 1000
    let failures = 0
    const MAX_FAILURES = 1
    let numIters = Math.floor(userRoundsLength / 1000)

    while (numIters >= 0) {
      try {
        const res = await contract.methods.getUserRounds(
          web3.utils.toChecksumAddress(account),
          numIters * 1000,
          1000,
        ).call() as { 0: string[], 1: Array<[string, string, boolean]>, 2: string }
        const [rounds, results] = [res[0], res[1]]
        numItems = Math.min(rounds.length, results.length)
        createArray(0, numItems).forEach(idx => {
          const epoch = rounds[idx]
          const [direction, size, claimed] = results[idx]
          bets.push({
            value: size,
            valueNum: Number(size),
            valueEthNum: Number(fromWei(size, "ether")),
            direction: direction === "0" ? "bull" : "bear",
            claimed,
            epoch,
          })
        })
        numIters -= 1
        console.log(`success ${numItems}`)
      } catch (e) {
        console.log(e)
        failures += 1
        console.log(`failed ${failures}`)
      }
      if (latest || failures > MAX_FAILURES) { break }
    }
    return bets
  },

  toRound: (r: PrdtResponse, t: PrdtTimestampResponse): Round => {
    const bearPayout = ((Number(r.bearAmount) + Number(r.bullAmount)) * 0.97) / Number(r.bearAmount) || 0
    const bullPayout = ((Number(r.bearAmount) + Number(r.bullAmount)) * 0.97) / Number(r.bullAmount) || 0
    const bearPayoutGross = ((Number(r.bearAmount) + Number(r.bullAmount))) / Number(r.bearAmount) || 0
    const bullPayoutGross = ((Number(r.bearAmount) + Number(r.bullAmount))) / Number(r.bullAmount) || 0
    const prizePool = Number(r.bullAmount) + Number(r.bullBonusAmount) + Number(r.bearAmount) + Number(r.bearBonusAmount)
    return {
      type: "prdt",
      genesis: r.genesis.toString().toLowerCase() === "true",
      completed: r.completed.toString().toLowerCase() === "true",
      cancelled: r.cancelled.toString().toLowerCase() === "true",
      treasuryAmount: r.treasuryAmount,
      bullBonusAmount: r.bullBonusAmount,
      bearBonusAmount: r.bearBonusAmount,
      bearAmount: r.bearAmount,
      bullAmount: r.bullAmount,
      closePrice: r.closePrice,
      epoch: r.epoch,
      lockPrice: r.lockPrice,
      rewardAmount: r.rewardAmount,
      rewardBaseCalAmount: r.rewardBaseCalAmount,
      bearAmountNum: Number(r.bearAmount),
      bullAmountNum: Number(r.bullAmount),
      closePriceNum: Number(r.closePrice),
      epochNum: Number(r.epoch),
      lockTimestampNum: Number(t.lockTimestamp),
      closeTimestampNum: Number(t.closeTimestamp),
      lockPriceNum: Number(r.lockPrice),
      rewardAmountNum: Number(r.rewardAmount),
      rewardBaseCalAmountNum: Number(r.rewardBaseCalAmount),
      startTimestampNum: Number(t.startTimestamp),
      bullPayout,
      bearPayout,
      bullPayoutGross,
      bearPayoutGross,
      prizePool: prizePool.toString(),
    }
  }

}
