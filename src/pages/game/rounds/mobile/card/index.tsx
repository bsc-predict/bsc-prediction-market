import React from "react"
import { useAppSelector } from "../../../../../hooks/reduxHooks"
import { calcBlockNumber, getRoundInfo } from "../../../../../utils/utils"
import Position from "../../cells/Position"
import Result from "../../cells/Result"

interface RoundCardProps {
  round: Round
  bet?: Bet
  claimCallback?: () => void
}

const RoundCardMobile: React.FunctionComponent<RoundCardProps> = (props) => {
  const {round, bet, claimCallback} = props
 
  const block = useAppSelector(s => calcBlockNumber(s.game.block))
  const constants = useAppSelector(s => ({bufferBlocks: s.game.bufferBlocks, rewardRate: s.game.rewardRate, intervalBlocks: s.game.intervalBlocks}))
  const latestOracle = undefined // TODO: Hook up oracle

  const {prizePool, lockPrice, live, curPriceDisplay, winner} = getRoundInfo(round, block, constants, latestOracle)

  const canBet = round.startBlockNum < block && round.lockBlockNum > block 
  let curPriceClass = "w-48 px-5 p-1 border border-grey-800 text-center"
  if (winner === "bear") {
    curPriceClass = "w-48 px-5 p-1 border border-grey-800 text-center bg-secondary"
  } else if (winner === "bull") {
    curPriceClass = "w-48 px-5 p-1 border border-grey-800 text-center bg-accent"
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
              <Result round={round} bet={bet} winner={winner} claimCallback={claimCallback} />
            </tr>
          </tbody>
        </table>
      </div>
  )
}

export default RoundCardMobile
