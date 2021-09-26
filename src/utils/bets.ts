import { calcBlockTimestamp } from "./utils"

export const enrichBets = (p: {
  bets: Bet[],
  rounds: Round[],
  block: {initial: { timestamp: number }, time: Date},
  bufferSeconds: number
  intervalSeconds: number
}) => {
  const {bets, rounds, block, intervalSeconds, bufferSeconds} = p
  const timestamp = calcBlockTimestamp(block)
  const roundsMap = new Map<string, Round>()
  rounds.forEach(r => roundsMap.set(r.epoch, r))
  const enriched = bets.map(bet => {
    const r = roundsMap.get(bet.epoch)

    let won = false
    let wonAmount = -bet.valueNum
    let wonPerc = -1.0
    if (r) {
      const endTimestamp = r.lockTimestampNum + intervalSeconds + bufferSeconds
      const passed = timestamp > endTimestamp
      const canceled = r.oracleCalled === false && passed
      if (canceled) {
        won = true
        wonAmount = bet.valueNum
        wonPerc = 0.0
      } else if (!r.oracleCalled) {
        won = false
        wonAmount = -bet.valueNum
      } else  if (r.closePriceNum < r.lockPriceNum && bet.direction === "bear") {
        won = true
        wonAmount = (r.bearPayout - 1.0) * bet.valueNum
        wonPerc = (r.bearPayout - 1.0)
      } else if (r.closePriceNum > r.lockPriceNum && bet.direction === "bull"){
        won = true
        wonAmount = (r.bullPayout - 1.0) * bet.valueNum
        wonPerc = (r.bullPayout - 1.0)
      } else {
        wonPerc = -1.0
        wonAmount = -bet.valueNum 
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
    } else {
      status = bet?.status
    }

    return {
      ...bet,
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