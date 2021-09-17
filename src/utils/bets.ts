import { binarySearch, calcBlockNumber } from "./utils"

export const enrichBets = (p: {
  bets: Bet[],
  rounds: Round[],
  block: {initial: number, time: Date},
  claimed?: Set<number>,
  bufferBlocks: number
  intervalBlocks: number
}) => {
  const {bets, rounds, block, claimed, bufferBlocks, intervalBlocks} = p
  const c = claimed || new Set(bets.filter(b => b.status === "claimed").map(b => Number(b.epoch)))
  const blockNum = calcBlockNumber(block)
  const enriched = bets.map(bet => {
    const r = binarySearch(rounds, r_1 => bet.blockNumberNum < r_1.startBlockNum ? 1 : bet.blockNumberNum >= r_1.lockBlockNum ? -1 : 0)
    console.log(r === undefined)
    let won = false
    let wonAmount = -bet.valueNum
    let wonPerc = -1.0
    if (r) {
      const startBlock = r.lockBlockNum
      const endBlock = startBlock + intervalBlocks + bufferBlocks
      const passed = blockNum > endBlock
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
    if (r !== undefined && c.has(r.epochNum)) {
      status = "claimed"
    } else if (won) {
      status = "claimable"
    } else {
      status = bet?.status
    }

    return {
      ...bet,
      won,
      epoch: r?.epoch,
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