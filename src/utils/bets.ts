import { PredictionConstants } from "../contracts/prediction"

export const enrichBets = (bets: Bet[], rounds: Round[], blockNum: number, claimed?: Set<number>) => {
  console.log(blockNum)
  const enriched = bets.map(bet => {
    const r = rounds.find(r_1 => bet.blockNumberNum > r_1.startBlockNum && bet.blockNumberNum < r_1.lockBlockNum)
    let won = false
    let wonAmount = -bet.valueNum
    let wonPerc = -1.0
    if (r) {
      if (r.closePriceNum < r.lockPriceNum && bet.direction === "bear") {
        won = true
        wonAmount = (r.bearPayout - 1.0) * bet.valueNum
        wonPerc = (r.bearPayout - 1.0)
      } else if (r.closePriceNum > r.lockPriceNum && bet.direction === "bull"){
        won = true
        wonAmount = (r.bullPayout - 1.0) * bet.valueNum
        wonPerc = (r.bullPayout - 1.0)
      } else if (r.oracleCalled === false && (blockNum > (r.lockBlockNum + PredictionConstants.bufferBlocks))) {
        won = true
        wonAmount = bet.valueNum
        wonPerc = 0.0
      } else {
        wonPerc = -1.0
        wonAmount = -bet.valueNum 
      }
    } else {
      wonAmount = 0
      wonPerc = 0
    }

    let status: BetStatus | undefined
    if (r !== undefined && claimed?.has(r.epochNum)) {
      status = "claimed"
    } else if (won && claimed !== undefined) {
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