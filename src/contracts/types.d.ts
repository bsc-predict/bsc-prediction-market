interface Round {
  oracleCalled: boolean
  bearAmount: string
  bullAmount: string
  closePrice: string
  epoch: string
  lockTimestamp: string
  lockPrice: string
  rewardAmount: string
  rewardBaseCalAmount: string
  startTimestamp: string
  totalAmount: string
  bearAmountNum: number
  bullAmountNum: number
  closePriceNum: number
  epochNum: number
  lockTimestampNum: number
  lockPriceNum: number
  rewardAmountNum: number
  rewardBaseCalAmountNum: number
  startTimestampNum: number
  totalAmountNum: number
  bullPayout: number
  bearPayout: number
  bullPayoutGross: number
  bearPayoutGross: number
  prizePool: string
}

interface RoundResponse {
  bearAmount: string
  bullAmount: string
  closeOracleId: string
  closePrice: string
  closeTimestamp: string
  epoch: string
  lockOracleId: string
  lockPrice: string
  lockTimestamp: string
  oracleCalled: string
  rewardAmount: string
  rewardBaseCalAmount: string
  startTimestamp: string
  totalAmount: string
}

interface OracleResponse {
  answer: string
  answeredInRound: string
  roundId: string
  startedAt: string
  updatedAt: string
}

interface Oracle {
  roundId: number
  answer: number
  startedAt: number
  updatedAt: number
  answeredInRound: number
}
