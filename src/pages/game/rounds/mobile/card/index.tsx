import React from "react"
import { useAppSelector } from "../../../../../hooks/reduxHooks"
import { calcCanBet } from "../../../../../utils/bets"
import { calcBlockTimestamp, getRoundInfo } from "../../../../../utils/utils"
import Position from "../../cells/Position"
import Result from "../../cells/Result"

interface RoundCardProps {
  round: Round
  bet?: Bet
}

const RoundCardMobile: React.FunctionComponent<RoundCardProps> = (props) => {
  const {round, bet} = props
 
  const currentTimestamp = useAppSelector(s => calcBlockTimestamp(s.game.block))
  const constants = useAppSelector(s => ({bufferSeconds: s.game.bufferSeconds, rewardRate: s.game.rewardRate, intervalSeconds: s.game.intervalSeconds}))
  const latestOracle = useAppSelector(s => s.game.oracle)

  const {prizePool, lockPrice, live, curPriceDisplay, winner} = getRoundInfo(round, currentTimestamp, constants, latestOracle)

  const canBet = calcCanBet(round, currentTimestamp) 
  let curPriceClass = "w-48 px-5 p-1 border border-grey-800 text-center"
  if (winner === "bear") {
    curPriceClass = "px-5 p-1 border border-grey-800 text-center bg-secondary"
  } else if (winner === "bull") {
    curPriceClass = "px-5 p-1 border border-grey-800 text-center bg-accent"
  } else if (Number(curPriceDisplay) > 0) {
    curPriceClass = "px-5 p-1 border border-grey-800 text-center bg-accent opacity-50"
  } else if (Number(curPriceDisplay) < 0) {
    curPriceClass = "px-5 p-1 border border-grey-800 text-center bg-secondary opacity-50"
  }

  return(
    <div className="mb-4 border">
      <div className={live ? "text-xl p-2 mt-2 font-bold bg-primary text-primary-content" : "text-xl p-2 mt-2 font-bold"}>
        {round.epoch} {live ? " (Live)" : ""}
      </div>
      <table>
        <tbody>
          <tr>
            <td className="w-48 px-5 p-1 border border-grey-800 text-center">Bull Payout</td>
            <td className="w-48 px-5 p-1 border border-grey-800 text-center">{round.bullPayoutGross.toFixed(4)}</td>
          </tr>
          <tr>
            <td className="w-48 px-5 p-1 border border-grey-800 text-center">Bear Payout</td>
            <td className="w-48 px-5 p-1 border border-grey-800 text-center">{round.bearPayoutGross.toFixed(4)}</td>
          </tr>
          <tr>
            <td className="w-48 px-5 p-1 border border-grey-800 text-center">Prize Pool</td>
            <td className="w-48 px-5 p-1 border border-grey-800 text-center">{prizePool}</td>
          </tr>
          <tr>
            <td className="w-48 px-5 p-1 border border-grey-800 text-center">Lock Price</td>
            <td className="w-48 px-5 p-1 border border-grey-800 text-center">{lockPrice.toFixed(2)}</td>
          </tr>
          <tr>
            <td className="w-48 px-5 p-1 border border-grey-800 text-center">Close</td>
              <td className={curPriceClass}>{curPriceDisplay}</td>
            </tr>
            <tr>
              <td className="w-48 px-5 p-1 border border-grey-800 text-center">Position</td>
              <Position bet={bet} canBet={canBet} />
            </tr>
            <tr>
              <td className="w-48 px-5 p-1 border border-grey-800 text-center">Result</td>
              <Result bet={bet} />
            </tr>
          </tbody>
        </table>
      </div>
  )
}

export default RoundCardMobile
