type LotteryStatus = "Pending" | "Open" | "Close" | "Claimable"

interface Lottery {
  id: number
  status: LotteryStatus
  startTime: Date
  endTime: Date
  priceTicketInCake: number
  discountDivisor: number
  rewardsBreakdown: [number, number, number, number, number, number]
  treasuryFee: number
  cakePerBracket: [number, number, number, number, number, number]
  countWinnersPerBracket: [number, number, number, number, number, number]
  firstTicketId: number
  firstTicketIdNextLottery: number
  amountCollectedInCake: number
  finalNumber: string
}

interface LotteryResponse {
  status: "0" | "1" | "2" | "3" 
  startTime: string
  endTime: string 
  priceTicketInCake: string
  discountDivisor: string
  rewardsBreakdown: [ string, string, string, string, string, string ] 
  treasuryFee: string
  cakePerBracket: [ string, string, string, string, string, string ]
  countWinnersPerBracket: [ string, string, string, string, string, string ]
  firstTicketId: string
  firstTicketIdNextLottery: string 
  amountCollectedInCake: string 
  finalNumber: string
}

interface LotteryCsvResponse {
  id: string
  status: "0" | "1" | "2" | "3"
  startTime: string
  endTime: string
  priceTicketInCake: string
  discountDivisor: string
  rewardsBreakdown1: string
  rewardsBreakdown2: string
  rewardsBreakdown3: string
  rewardsBreakdown4: string
  rewardsBreakdown5: string
  rewardsBreakdown6: string
  treasuryFee: string
  cakePerBracket1: string
  cakePerBracket2: string
  cakePerBracket3: string
  cakePerBracket4: string
  cakePerBracket5: string
  cakePerBracket6: string
  countWinnersPerBracket1: string
  countWinnersPerBracket2: string
  countWinnersPerBracket3: string
  countWinnersPerBracket4: string
  countWinnersPerBracket5: string
  countWinnersPerBracket6: string
  firstTicketId: string
  firstTicketIdNextLottery: string
  amountCollectedInCake: string
  finalNumber: string
}

interface UserInfoResponse {
  0: string[]     // ticket ids
  1: string[]     // numbers
  2: boolean[]    // claimed
  3: string       //size
}

interface UserInfo {
  ticketId: number
  number: string
  claimed: boolean
}