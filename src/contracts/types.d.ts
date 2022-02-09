type Round = PsRound | PrdtRound

interface PrdtRound {
  type: "prdt"
  epoch: string
  epochNum: number
  genesis: boolean
  completed: boolean
  cancelled: boolean
  bullAmount: number
  bearAmount: number
  rewardBaseCalAmount: number
  rewardAmount: number
  treasuryAmount: number
  bullBonusAmount: number
  bearBonusAmount: number
  lockPrice: number
  closePrice: number
  bullPayoutGross: number
  bearPayoutGross: number
  lockPriceNum: number
  closePriceNum: number
  prizePool: number
  bullPayout: number
  bearPayout: number
}

interface PrdtResponse {
  epoch: string
  genesis: boolean
  completed: boolean
  cancelled: boolean
  bullAmount: number
  bearAmount: number
  rewardBaseCalAmount: number
  rewardAmount: number
  treasuryAmount: number
  bullBonusAmount: number
  bearBonusAmount: number
  lockPrice: number
  closePrice: number
}

interface PsRound {
  type: "ps"
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

interface PsRoundResponse {
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


interface LeaderboardResponse {
  account: string
  played: string
  winnings: string
  winningsevenmoney: string
  averagebetsize: string
}

interface Leaderboard {
  account: string
  played: number
  winnings: number
  winningsEvenMoney: number
  averageBetSize: number
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
