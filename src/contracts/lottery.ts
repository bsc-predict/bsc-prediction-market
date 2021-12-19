import { web3Provider } from "src/utils/web3"
import lotteryAbi from "../contracts/lottery_abi.json"
import type { AbiItem } from "web3-utils"
import { Urls } from "src/constants"
import axios from "axios"
import { csvToJson } from "src/api/utils"

export const LotteryAddress = {
  main: "0x5aF6D33DE2ccEC94efb1bDF8f92Bd58085432d2c",
  test: ""
}

const DIVISOR = 1e+18

const convertStatus = (id: "0" | "1" | "2" | "3"): LotteryStatus => {
  switch (id) {
    case "0": return "Pending"
    case "1": return "Open"
    case "2": return "Close"
    case "3": return "Claimable"
  }
}

const convertArrayToNumbers = (
  arr: [string, string, string, string, string, string],
  divisor: number
): [number, number, number, number, number, number] => {
  return [
    Number(arr[0]) / divisor,
    Number(arr[1]) / divisor,
    Number(arr[2]) / divisor,
    Number(arr[3]) / divisor,
    Number(arr[4]) / divisor,
    Number(arr[5]) / divisor,
  ]
}

export const fetchLotteryHistory = async (): Promise<Lottery[]> => {
  const url = Urls.lotteryRounds.main
  const res = await axios.get(url)
  const roundResponse = csvToJson(res.data) as LotteryCsvResponse[]
  return roundResponse.map(l => ({
    id: Number(l.id),
    status: convertStatus(l.status),
    startTime: new Date(Number(l.startTime) * 1000),
    endTime: new Date(Number(l.endTime) * 1000),
    priceTicketInCake: Number(l.priceTicketInCake) / DIVISOR,
    discountDivisor: Number(l.discountDivisor),
    rewardsBreakdown: convertArrayToNumbers([
      l.rewardsBreakdown1,
      l.rewardsBreakdown2,
      l.rewardsBreakdown3,
      l.rewardsBreakdown4,
      l.rewardsBreakdown5,
      l.rewardsBreakdown6,
    ], 1),
    treasuryFee: Number(l.treasuryFee),
    cakePerBracket: convertArrayToNumbers([
      l.cakePerBracket1,
      l.cakePerBracket2,
      l.cakePerBracket3,
      l.cakePerBracket4,
      l.cakePerBracket5,
      l.cakePerBracket6,
    ], DIVISOR),
    countWinnersPerBracket: convertArrayToNumbers([
      l.countWinnersPerBracket1,
      l.countWinnersPerBracket2,
      l.countWinnersPerBracket3,
      l.countWinnersPerBracket4,
      l.countWinnersPerBracket5,
      l.countWinnersPerBracket6,
    ], 1),
    firstTicketId: Number(l.firstTicketId),
    firstTicketIdNextLottery: Number(l.firstTicketIdNextLottery),
    amountCollectedInCake: Number(l.amountCollectedInCake) / DIVISOR,
    finalNumber: l.finalNumber
  }))
}

export const fetchLottery = async (lotteryId: number): Promise<Lottery> => {
  const web3 = web3Provider("main")
  const contract = new web3.eth.Contract(lotteryAbi as AbiItem[], LotteryAddress.main)
  const l = await contract.methods.viewLottery(lotteryId).call() as LotteryResponse
  return {
    id: lotteryId,
    status: convertStatus(l.status),
    startTime: new Date(Number(l.startTime) * 1000),
    endTime: new Date(Number(l.endTime) * 1000),
    priceTicketInCake: Number(l.priceTicketInCake) / DIVISOR,
    discountDivisor: Number(l.discountDivisor),
    rewardsBreakdown: convertArrayToNumbers(l.rewardsBreakdown, 1),
    treasuryFee: Number(l.treasuryFee),
    cakePerBracket: convertArrayToNumbers(l.cakePerBracket, DIVISOR),
    countWinnersPerBracket: convertArrayToNumbers(l.countWinnersPerBracket, 1),
    firstTicketId: Number(l.firstTicketId),
    firstTicketIdNextLottery: Number(l.firstTicketIdNextLottery),
    amountCollectedInCake: Number(l.amountCollectedInCake) / DIVISOR,
    finalNumber: l.finalNumber
  }
}

export const fetchUserInfo = async (address: string, lotteryId: number): Promise<UserInfo[]> => {
  const web3 = web3Provider("main")
  const contract = new web3.eth.Contract(lotteryAbi as AbiItem[], LotteryAddress.main)
  try {
    const out: UserInfo[] = []
    let iter = 0
    while (true) {
      const user = web3.utils.toChecksumAddress(address)
      const l = await contract.methods.viewUserInfoForLotteryId(user, lotteryId, iter * 1000, 1000).call() as UserInfoResponse
      const ct = Number(l[3])
      const len = l[0].length
      Array.from(Array(len).keys()).map(idx => {
        const o = { ticketId: Number(l[0][idx]), number: l[1][idx], claimed: l[2][idx] }
        out.push(o)
      })
      iter += 1
      if (ct !== 1000 * iter) { break }

    }
    return out
  } catch {
    return []
  }

}

