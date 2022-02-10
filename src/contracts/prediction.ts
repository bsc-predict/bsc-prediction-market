import { web3Provider } from "../utils/web3"
import predictionAbi from "../contracts/prediction_abi.json"
import type { AbiItem } from "web3-utils"
import mixpanel from "mixpanel-browser"
import Web3 from "web3"
import { createArray, fromWei, toWei } from "src/utils/utils"

export const BnbUsdtPredictionAddress = {
  main: "0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA",
  test: "0x5E5D4d6337Ac83Ef71fEb143669D95073D0e9462"
}

export const BnbUsdt = {
  fetchRounds: async (
    game: GameType,
    epochs: Array<string | number>
  ): Promise<Round[]> => {
    const web3 = web3Provider(game.chain)
    const address = BnbUsdtPredictionAddress[game.chain]
    const contract = new web3.eth.Contract(predictionAbi as AbiItem[], address)

    const rounds = epochs.map(async epoch => {
      const r = await contract.methods.rounds(epoch.toString()).call() as Object
      return BnbUsdt.toRound(r as PsRoundResponse)
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
    const address = BnbUsdtPredictionAddress[game.chain]
    const contract = new web3.eth.Contract(predictionAbi as AbiItem[], address)
    return contract.methods.claim(epochs)
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
    const address = BnbUsdtPredictionAddress[game.chain]
    const web3 = new Web3(library)
    const value = toWei(eth.toString(), "ether")
    const betMethod = direction === "bull" ? "betBull" : "betBear"
    const contract = new web3.eth.Contract(predictionAbi as AbiItem[], address)
    return contract.methods[betMethod](epoch)
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

    const contractAddress = BnbUsdtPredictionAddress[game.chain]
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
        console.log({numIters})
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

  toRound: (r: PsRoundResponse): Round => {
    const bearPayout = ((Number(r.bearAmount) + Number(r.bullAmount)) * 0.97) / Number(r.bearAmount)
    const bullPayout = ((Number(r.bearAmount) + Number(r.bullAmount)) * 0.97) / Number(r.bullAmount)
    const bearPayoutGross = ((Number(r.bearAmount) + Number(r.bullAmount))) / Number(r.bearAmount)
    const bullPayoutGross = ((Number(r.bearAmount) + Number(r.bullAmount))) / Number(r.bullAmount)
    const prizePool = (Number(r.bearAmount) + Number(r.bullAmount)).toString()
    return {
      type: "ps",
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

}
