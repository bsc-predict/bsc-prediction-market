interface TransactionResponse {
  status: "1" | "0"
  message: string
  result: Transaction[]
}

interface Transaction {
  blockNumber: string
  timeStamp: string
  hash: string
  nonce: string
  blockHash: string
  transactionIndex: string
  from: string
  to: string
  value: string
  gas: string
  gasPrice: string
  isError: "0" | "1"
  txreceipt_status: "0" | "1"
  input: string
  contractAddress: string
  cumulativeGasUsed: string
  gasUsed: string
  confirmations: string    
}

interface BullBet {
  tag: "bull"
}
interface BearBet {
  tag: "bear"
}

interface Claim {
  tag: "claim",
  epoch: number
}

type InputType = BullBet | BearBet | Claim
type BetType = "bull" | "bear"
type BetStatus = "claimed" | "pending" | "claimable"

interface Bet {
  value: string
  valueNum: number
  valueEthNum: number
  direction: BetType
  claimed: boolean
  epoch: string
  won?: boolean
  status?: BetStatus
  wonAmount?: number
  wonPerc?: number
  refundable?: boolean
}

interface Balance {
  balance: string
  balanceEth: string
  balanceUsd: number
  bnbPrice: number
}

interface BetResponse {
  bets: Array<{
    createdAt: string
    value: string
    blockNumber: string
    direction: BetType
    timeStamp: string
    claimed: boolean
    epoch: number
  }>
  claimed: number[]
}

interface GraphQlBetResponse {
  bets: Array<{
    amount: string
    block: string
    claimed: boolean
    position: "Bull" | "Bear"
    round: {
      epoch: string
      failed: boolean
      closePrice: string | null
      lockPrice: string | null
    }
    // user: {
    //   averageBNB: string
    //   block: string
    //   createdAt: string
    //   id: string
    //   netBNB: string
    //   totalBNB: string
    //   totalBNBBear: string
    //   totalBNBBull: string
    //   totalBNBClaimed: string
    //   totalBets: string
    //   totalBetsBear: string
    //   totalBearBull: string
    //   totalBetsClaimed: string
    //   updatedAt: string
    //   winRate: string
    // }
  }>
}

interface GraphQlRoundResponse {
  rounds: Array<{
    bearAmount: string
    bullAmount: string
    closePrice: string | null
    epoch: string
    lockAt: string | null
    lockPrice: string | null
    startAt: string
    totalAmount: string
  }>
  
}