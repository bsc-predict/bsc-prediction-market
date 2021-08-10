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
  timeStamp: string
  blockNumber: string
  blockNumberNum: number
  epoch?: string
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
    value: string
    blockNumber: string
    direction: BetType
    timeStamp: string
  }>
  claimed: number[]
}
