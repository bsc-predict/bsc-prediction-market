import React from "react"
import { useAppSelector } from "../../../../../hooks/reduxHooks"
import { calcCanBet } from "../../../../../utils/bets"
import { calcBlockTimestamp, getRoundInfo } from "../../../../../utils/utils"
import Position from "../../cells/Position"
import Result from "../../cells/Result"
import { rowClass } from "../style"


interface RoundRowProps {
  round: Round
  bet?: Bet
}

const RoundRow: React.FunctionComponent<RoundRowProps> = (props) => {
  const {round, bet} = props
  
  const currentTimestamp = useAppSelector(s => calcBlockTimestamp(s.game.block))
  const constants = useAppSelector(s => ({bufferSeconds: s.game.bufferSeconds, rewardRate: s.game.rewardRate, intervalSeconds: s.game.intervalSeconds}))
  const latestOracle = useAppSelector(s => s.game.oracle)

  const canBet = bet === undefined && calcCanBet(round, currentTimestamp)

  const {prizePool, lockPrice, live, curPriceDisplay, winner} = getRoundInfo(round, currentTimestamp, constants, latestOracle)

  let curPriceClass = rowClass
  let bearCellClass = rowClass
  let bullCellClass = rowClass
  if (winner === "bear") {
    curPriceClass = "px-5 p-1 border border-grey-800 text-center bg-secondary"
    bearCellClass = "px-5 p-1 border border-grey-800 text-center bg-secondary"
  } else if (winner === "bull") {
    curPriceClass = "px-5 p-1 border border-grey-800 text-center bg-accent"
    bullCellClass = "px-5 p-1 border border-grey-800 text-center bg-accent"
  } else if (Number(curPriceDisplay) > 0) {
    curPriceClass = "px-5 p-1 border border-grey-800 text-center bg-accent opacity-50"
  } else if (Number(curPriceDisplay) < 0) {
    curPriceClass = "px-5 p-1 border border-grey-800 text-center bg-secondary opacity-50"
  }

  return(
    <tr className={live ? "active" : undefined}>
      <td className={rowClass}>{round.epoch}</td>
      <td className={bullCellClass}>{round.bullPayoutGross.toFixed(4)}</td>
      <td className={bearCellClass}>{round.bearPayoutGross.toFixed(4)}</td>
      <td className={rowClass}>{prizePool}</td>
      <td className={rowClass}>{lockPrice.toFixed(2)}</td>
      <td className={curPriceClass}>{curPriceDisplay}</td>
      <Position bet={bet} canBet={canBet}/>
      <Result bet={bet} />
    </tr>
  )
}

export default RoundRow
