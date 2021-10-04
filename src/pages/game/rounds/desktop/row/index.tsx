import React from "react"
import { useAppSelector } from "../../../../../hooks/reduxHooks"
import { calcCanBet } from "../../../../../utils/bets"
import { calcBlockTimestamp, getRoundInfo } from "../../../../../utils/utils"
import Position from "../../cells/Position"
import Result from "../../cells/Result"
import { rowClass } from "../style"


interface RoundRowProps {
  idx: number
  round: Round
  bet?: Bet
}

const RoundRow: React.FunctionComponent<RoundRowProps> = (props) => {
  const { round, bet, idx } = props

  const currentTimestamp = useAppSelector(s => calcBlockTimestamp(s.game.block))
  const constants = useAppSelector(s => ({ bufferSeconds: s.game.bufferSeconds, rewardRate: s.game.rewardRate, intervalSeconds: s.game.intervalSeconds }))
  const latestOracle = useAppSelector(s => s.game.oracle)

  const canBet = bet === undefined && calcCanBet(round, currentTimestamp)

  const { prizePool, lockPrice, live, curPriceDisplay, winner } = getRoundInfo(round, currentTimestamp, constants, latestOracle)

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
    bullCellClass = "px-5 p-1 border border-grey-800 text-center bg-accent opacity-50"
  } else if (Number(curPriceDisplay) < 0) {
    curPriceClass = "px-5 p-1 border border-grey-800 text-center bg-secondary opacity-50"
    bearCellClass = "px-5 p-1 border border-grey-800 text-center bg-secondary opacity-50"
  }

  const first = idx === 0
  const second = idx === 1

  return (
    <tr className={live ? "active" : undefined} id={first ? "reactour-live" : undefined}>
      <td className={rowClass}>{round.epoch}</td>
      <td id={first ? "reactour-bull-payout" : undefined} className={bullCellClass}>{round.bullPayoutGross.toFixed(4)}</td>
      <td id={first ? "reactour-bear-payout" : undefined} className={bearCellClass}>{round.bearPayoutGross.toFixed(4)}</td>
      <td id={first ? "reactour-prize-pool" : undefined} className={rowClass}>{prizePool}</td>
      <td id={second ? "reactour-lock-price" : undefined} className={rowClass}>{lockPrice.toFixed(2)}</td>
      <td id={second ? "reactour-close-price" : undefined} className={curPriceClass}>{curPriceDisplay}</td>
      <Position bet={bet} canBet={canBet} id={first ? "reactour-position" : undefined} />
      <Result bet={bet} id={second ? "reactour-result" : undefined} />
    </tr>
  )
}

export default RoundRow
