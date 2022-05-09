type Round = PsRound | PrdtRound

interface PrdtRound {
  type: "prdt"
  epoch: string
  epochNum: number
  genesis: boolean
  completed: boolean
  cancelled: boolean
  bullAmount: string
  bearAmount: string
  rewardBaseCalAmount: string
  rewardAmount: string
  treasuryAmount: string
  bullBonusAmount: string
  bearBonusAmount: string
  lockPrice: string
  closePrice: string
  bullPayoutGross: number
  bearPayoutGross: number
  lockPriceNum: number
  closePriceNum: number
  bullPayout: number
  bearPayout: number
  rewardAmountNum: number
  rewardBaseCalAmountNum: number
  bearAmountNum: number
  bullAmountNum: number
  closePriceNum: number
  lockTimestampNum: number
  closeTimestampNum: number
  startTimestampNum: number
  prizePool: string
}

interface PrdtResponse {
  epoch: string
  genesis: "True" | "False"
  completed: "True" | "False"
  cancelled: "True" | "False"
  bullAmount: string
  bearAmount: string
  rewardBaseCalAmount: string
  rewardAmount: string
  treasuryAmount: string
  bullBonusAmount: string
  bearBonusAmount: string
  lockPrice: string
  closePrice: string
}

interface PrdtTimestampResponse {
  startTimestamp: string
  lockTimestamp: string
  closeTimestamp: string
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
  // roundId: number
  answer: number
  // startedAt: number
  // updatedAt: number
  // answeredInRound: number
}
