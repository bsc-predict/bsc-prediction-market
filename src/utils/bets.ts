import Web3 from "web3"
import { roundComplete } from "./utils"

const web3 = new Web3()

export const enrichBets = (p: {
  bets: Bet[]
  rounds: Round[]
  block: { initial: { timestamp: number }, time: Date }
  bufferSeconds: number
  intervalSeconds: number
  evenMoney: boolean
}): Bet[] => {
  const { bets, rounds, block, intervalSeconds, bufferSeconds, evenMoney } = p
  const roundsMap = new Map<string, Round>()
  rounds.forEach(r => roundsMap.set(r.epoch, r))

  const enriched = bets.map(bet => {
    const r = roundsMap.get(bet.epoch)

    const value = evenMoney ? web3.utils.toWei("1", "ether") : bet.value
    const valueNum = Number(value)
    const valueEthNum = Number(web3.utils.fromWei(value, "ether"))

    let won = false
    let wonAmount = -valueNum
    let wonPerc = -1.0
    if (r) {
      const oracleCalled = r.type === "ps" ? r.oracleCalled : r.completed
      const passed = roundComplete(r, block, intervalSeconds, bufferSeconds)
      const canceled = oracleCalled === false && passed
      if (canceled) {
        won = true
        wonAmount = valueNum
        wonPerc = 0.0
      } else if (!oracleCalled) {
        won = false
        wonAmount = -valueNum
      } else if (r.closePriceNum < r.lockPriceNum && bet.direction === "bear") {
        won = true
        wonAmount = (r.bearPayout - 1.0) * valueNum
        wonPerc = (r.bearPayout - 1.0)
      } else if (r.closePriceNum > r.lockPriceNum && bet.direction === "bull") {
        won = true
        wonAmount = (r.bullPayout - 1.0) * valueNum
        wonPerc = (r.bullPayout - 1.0)
      } else {
        wonPerc = -1.0
        wonAmount = -valueNum
      }
    } else {
      wonAmount = 0
      wonPerc = 0
    }

    let status: BetStatus | undefined
    if (bet.claimed) {
      status = "claimed"
    } else if (won) {
      status = "claimable"
    } else if (r?.type === "ps" && r?.oracleCalled === false) {
      status = "pending"
    } else {
      status = bet?.status
    }

    return {
      ...bet,
      value,
      valueNum,
      valueEthNum,
      won,
      status,
      wonAmount,
      wonPerc,
    }
  })
  return enriched
}

export const calcMaxDrawdown = (bets: Bet[]) => {
  let cur = 0
  let worst = 0
  bets.forEach(b => {
    cur = Math.min(cur + (b.wonAmount || 0), 0)
    worst = Math.min(cur, worst)
  })
  return worst
}

export const calcCanBet = (round: Round, currentTimestamp: number) => {
  return round.startTimestampNum < currentTimestamp && round.lockTimestampNum > currentTimestamp
}