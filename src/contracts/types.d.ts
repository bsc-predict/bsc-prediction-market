interface Round {
  id: string
  oracleCalled: boolean
  bearAmount: string
  bullAmount: string
  closePrice: string
  epoch: string
  lockBlock: string
  lockPrice: string
  rewardAmount: string
  rewardBaseCalAmount: string
  startBlock: string
  totalAmount: string
  bearAmountNum: number
  bullAmountNum: number
  closePriceNum: number
  epochNum: number
  lockBlockNum: number
  lockPriceNum: number
  rewardAmountNum: number
  rewardBaseCalAmountNum: number
  startBlockNum: number
  totalAmountNum: number
  bullPayout: number
  bearPayout: number
  bullPayoutGross: number
  bearPayoutGross: number
  prizePool: string
}

interface RoundResponse {
  id: string
  bearAmount: string
  bullAmount: string
  closePrice: string
  epoch: string
  lockBlock: string
  lockPrice: string
  oracleCalled: string
  rewardAmount: string
  rewardBaseCalAmount: string
  startBlock: string
  totalAmount: string
}

interface Oracle {
  roundId: number
  answer: number
  startedAt: number
  updatedAt: number
  answeredInRound: number
}
