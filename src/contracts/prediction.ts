export const PredictionAddress = {
  main: "0x516ffd7D1e0Ca40b1879935B2De87cb20Fc1124b",
  test: "0x257D3e7A74947bf7a8E2ac012b680cbb98642CE5"
}


const bearBet = "0x0088160f"
const bullBet = "0x821daba1"
const claimPrefix = /(?<=0x379607f5).+/g

// TODO: Get this from the actual contract
export const PredictionConstants = {
  bufferBlocks: 20,
  rewardRate: 0.97,
  intervalBlocks: 100,
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