import React from "react"
import { useAppSelector } from "../../../../../hooks/reduxHooks"
import { calcCanBet } from "../../../../../utils/bets"
import { calcBlockTimestamp, getRoundInfo } from "../../../../../utils/utils"
import Position from "../../cells/Position"
import Result from "../../cells/Result"

interface RoundCardProps {
  idx: number
  round: Round
  bet?: Bet
}

const RoundCardMobile: React.FunctionComponent<RoundCardProps> = (props) => {
  const { round, bet, idx } = props

  const currentTimestamp = useAppSelector(s => calcBlockTimestamp(s.game.block))
  const constants = useAppSelector(s => ({ bufferSeconds: s.game.bufferSeconds, rewardRate: s.game.rewardRate, intervalSeconds: s.game.intervalSeconds }))
  const latestOracle = useAppSelector(s => s.game.oracle)

  const { prizePool, lockPrice, live, curPriceDisplay, winner } = getRoundInfo(round, currentTimestamp, constants, latestOracle)

  const canBet = calcCanBet(round, currentTimestamp)

  const rowClass = "w-48 px-5 p-1 border border-grey-800 text-center"

  let curPriceClass = rowClass
  let bearCellClass = rowClass
  let bullCellClass = rowClass

  const first = idx === 0
  const second = idx === 1

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

  return (
    <div className="mb-4 border">
      <div className={live ? "text-xl p-2 mt-2 font-bold bg-primary text-primary-content" : "text-xl p-2 mt-2 font-bold"}>
        {round.epoch} {live ? " (Live)" : ""}
      </div>
      <table id="reactour-live">
        <tbody>
          <tr id={first ? "reactour-bull-payout" : undefined}>
            <td className={rowClass}>Bull Payout</td>
            <td className={bullCellClass}>{round.bullPayoutGross.toFixed(4)}</td>
          </tr>
          <tr id={first ? "reactour-bear-payout" : undefined}>
            <td className={rowClass}>Bear Payout</td>
            <td className={bearCellClass}>{round.bearPayoutGross.toFixed(4)}</td>
          </tr>
          <tr id={first ? "reactour-prize-pool" : undefined}>
            <td className={rowClass}>Prize Pool</td>
            <td className={rowClass}>{prizePool}</td>
          </tr>
          <tr id={second ? "reactour-lock-price" : undefined}>
            <td className={rowClass}>Lock Price</td>
            <td className={rowClass}>{lockPrice.toFixed(2)}</td>
          </tr>
          <tr id={second ? "reactour-close-price" : undefined}>
            <td className={rowClass}>Close</td>
            <td className={curPriceClass}>{curPriceDisplay}</td>
          </tr>
          <tr id={first ? "reactour-position" : undefined}>
            <td className={rowClass}>Position</td>
            <Position bet={bet} canBet={canBet} />
          </tr>
          <tr id={second ? "reactour-result" : undefined}>
            <td className={rowClass}>Result</td>
            <Result bet={bet} />
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default RoundCardMobile
