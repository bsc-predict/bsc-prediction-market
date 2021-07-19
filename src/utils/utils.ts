import web3 from "./web3";

export function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(arr.length * Math.random())];
}

export const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>)
  

export const camelToUnderscore = (key: string) => {
  return key.replace( /([A-Z])/g, "_$1").toLowerCase()
}

export const getRoundInfo = (round: Round, latestOracle?: Oracle) => {
  let winner: "bull" | "bear" | undefined = undefined
  if (round.lockPriceNum && round.closePriceNum) {
    if (round.closePriceNum > round.lockPriceNum) {
      winner = "bull"
    } else if (round.closePriceNum < round.lockPriceNum) {
      winner = "bear"
    }
  }

  const live = round.closePriceNum === 0 && round.lockPriceNum > 0
  const curPrice = live && latestOracle ? (latestOracle.answer - round.lockPriceNum) : (round.closePriceNum - round.lockPriceNum)
  const curPriceDisplay = (curPrice / Math.pow(10, 8)).toFixed(2)
  const prizePool = Number(web3.utils.fromWei(round.prizePool, "ether")).toFixed(2)
  const lockPrice = round.lockPriceNum / Math.pow(10, 8)
  const winnerColor = winner === "bull" ? "bg-green-300 dark:bg-green-900" : winner == "bear" ? "bg-red-300 dark:bg-red-900" : ""
  let liveBorder = ""
  if (live) {
    liveBorder = curPrice > 0 ? "bg-green-300 bg-opacity-30 dark:bg-green-700" : "bg-red-300 bg-opacity-30 dark:bg-red-700"
  }
  return {
    winner,
    curPriceDisplay,
    prizePool,
    lockPrice,
    winnerColor,
    liveBorder
  }
}

export const toTimeString = (seconds: number) =>`${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`

export const createArray = (from: number, to: number) => {
  const mult = to > from ? 1 : -1
  return Array.from(Array(Math.abs(to - from)).keys()).map(offset => from + offset * mult)
}
