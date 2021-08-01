import { PredictionConstants } from "../contracts/prediction";
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

export const getRoundInfo = (round: Round, currentBlock: number, latestOracle?: Oracle) => {
  let winner: "bull" | "bear" | undefined = undefined
  if (round.lockPriceNum && round.closePriceNum) {
    if (round.closePriceNum > round.lockPriceNum) {
      winner = "bull"
    } else if (round.closePriceNum < round.lockPriceNum) {
      winner = "bear"
    }
  }

  const canceled = round.closePriceNum === 0 && (round.lockBlockNum + PredictionConstants.intervalBlocks + PredictionConstants.bufferBlocks) < currentBlock
  const live = !canceled && round.closePriceNum === 0 && round.lockPriceNum > 0
  const curPrice = live && latestOracle ? (latestOracle.answer - round.lockPriceNum) : (round.closePriceNum - round.lockPriceNum)
  const curPriceDisplay = canceled ? "Canceled" : (curPrice / Math.pow(10, 8)).toFixed(2)
  const prizePool = Number(web3.utils.fromWei(round.prizePool, "ether")).toFixed(2)
  const lockPrice = round.lockPriceNum / Math.pow(10, 8)
  const winnerColor = winner === "bull" ? "bg-accent" : winner == "bear" ? "bg-secondary" : ""
  let liveBorder = ""
  if (live) {
    liveBorder = curPrice > 0 ? "accent bg-opacity-30" : "secondary bg-opacity-30"
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

export const prettyNumber = (amount: string | number, percision: number) => {
  const local = amount.toLocaleString()
  const period = local.indexOf(".")
  if (period !== -1) {
    return local.slice(0, period + percision)
  } else {
    return local
  }
}

export function isEqual(x: any, y: any) {
    if ( x === y ) return true;
      // if both x and y are null or undefined and exactly the same
  
    if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
      // if they are not strictly equal, they both need to be Objects
  
    if ( x.constructor !== y.constructor ) return false;
      // they must have the exact same prototype chain, the closest we can do is
      // test there constructor.
  
    for ( var p in x ) {
      if ( ! x.hasOwnProperty( p ) ) continue;
        // other properties were tested using x.constructor === y.constructor
  
      if ( ! y.hasOwnProperty( p ) ) return false;
        // allows to compare x[ p ] and y[ p ] when set to undefined
  
      if ( x[ p ] === y[ p ] ) continue;
        // if they have the same strict value or identity then they are equal
  
      if ( typeof( x[ p ] ) !== "object" ) return false;
        // Numbers, Strings, Functions, Booleans must be strictly equal
  
      if ( ! isEqual( x[ p ],  y[ p ] ) ) return false;
        // Objects and Arrays must be tested recursively
    }
  
    for ( p in y )
      if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) )
        return false;
          // allows x[ p ] to be set to undefined
  
    return true;
  
}