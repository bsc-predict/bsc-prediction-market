import React from "react"
import { BlockContext } from "../../../../../contexts/BlockContext"
import { OracleContext } from "../../../../../contexts/OracleContext"
import { getRoundInfo } from "../../../../../utils/utils"
import Position from "../../cells/Position"
import Result from "../../cells/Result"
import { rowClass } from "../style"


interface RoundRowProps {
  round: Round
  bet?: Bet
}

const RoundRow: React.FunctionComponent<RoundRowProps> = (props) => {
  const {round, bet} = props
  
  const {block} = React.useContext(BlockContext)
  const {latestOracle} = React.useContext(OracleContext)
  
  const canBet = bet === undefined && round.startBlockNum < block && round.lockBlockNum > block

  const {prizePool, lockPrice, winnerColor, liveBorder, curPriceDisplay, winner} = getRoundInfo(round, latestOracle)

  return(
    <tr>
      <td className={rowClass}>{round.epoch}</td>
      <td className={rowClass}>{round.bullPayoutGross.toFixed(4)}</td>
      <td className={rowClass}>{round.bearPayoutGross.toFixed(4)}</td>
      <td className={rowClass}>{prizePool}</td>
      <td className={rowClass}>{lockPrice.toFixed(2)}</td>
      <td className={`${ rowClass} ${winnerColor} ${liveBorder}`}>{curPriceDisplay}</td>
      <Position bet={bet} canBet={canBet}/>
      <Result round={round} bet={bet} winner={winner}/>
    </tr>
  )
}

export default RoundRow
