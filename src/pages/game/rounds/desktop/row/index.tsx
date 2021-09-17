import React from "react"
import { OracleContext } from "../../../../../contexts/OracleContext"
import { useAppSelector } from "../../../../../hooks/reduxHooks"
import { calcBlockNumber, getRoundInfo } from "../../../../../utils/utils"
import Position from "../../cells/Position"
import Result from "../../cells/Result"
import { rowClass } from "../style"


interface RoundRowProps {
  round: Round
  bet?: Bet
  claimCallback?: () => void
}

const RoundRow: React.FunctionComponent<RoundRowProps> = (props) => {
  const {round, bet, claimCallback} = props
  
  const block = useAppSelector(s => calcBlockNumber(s.game.block))
  const constants = useAppSelector(s => ({bufferBlocks: s.game.bufferBlocks, rewardRate: s.game.rewardRate, intervalBlocks: s.game.intervalBlocks}))
  const {latestOracle} = React.useContext(OracleContext)
  
  const canBet = bet === undefined && round.startBlockNum < block && round.lockBlockNum > block

  const {prizePool, lockPrice, live, curPriceDisplay, winner} = getRoundInfo(round, block, constants, latestOracle)

  let curPriceClass = rowClass
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
    <tr className={live ? "active" : undefined}>
      <td className={rowClass}>{round.epoch}</td>
      <td className={rowClass}>{round.bullPayoutGross.toFixed(4)}</td>
      <td className={rowClass}>{round.bearPayoutGross.toFixed(4)}</td>
      <td className={rowClass}>{prizePool}</td>
      <td className={rowClass}>{lockPrice.toFixed(2)}</td>
      <td className={curPriceClass}>{curPriceDisplay}</td>
      <Position bet={bet} canBet={canBet}/>
      <Result round={round} bet={bet} winner={winner} claimCallback={claimCallback}/>
    </tr>
  )
}

export default RoundRow
