import { useWeb3React } from "@web3-react/core"
import React from "react"
import { BlockContext } from "../../../../../contexts/BlockContext"
import { NotificationsContext } from "../../../../../contexts/NotificationsContext"
import { OracleContext } from "../../../../../contexts/OracleContext"
import { usePredictionContract } from "../../../../../contracts/prediction"
import useLogin from "../../../../../hooks/useLogin"
import { getRoundInfo } from "../../../../../utils/utils"
import web3 from "../../../../../utils/web3"
import Position from "../../cells/Position"
import Result from "../../cells/Result"


interface RoundRowProps {
  round: Round
  bet?: Bet
}

const RoundRow: React.FunctionComponent<RoundRowProps> = (props) => {
  const {round, bet} = props
  
  const {block} = React.useContext(BlockContext)
  const {latestOracle} = React.useContext(OracleContext)
  
  const canBet = round.startBlockNum < block && round.lockBlockNum > block

  const {prizePool, lockPrice, winnerColor, liveBorder, curPriceDisplay, winner} = getRoundInfo(round, latestOracle)

  return(
    <tr key={round.epoch}>
      <td className="px-5 p-1 border border-grey-800 text-center">{round.epoch}</td>
      <td className="px-5 p-1 border border-grey-800 text-center">{round.bullPayoutGross.toFixed(4)}</td>
      <td className="px-5 p-1 border border-grey-800 text-center">{round.bearPayoutGross.toFixed(4)}</td>
      <td className="px-5 p-1 border border-grey-800 text-center">{prizePool}</td>
      <td className="px-5 p-1 border border-grey-800 text-center">{lockPrice.toFixed(2)}</td>
      <td className={`px-5 p-1 border border-grey-800 text-center ${winnerColor} ${liveBorder}`}>{curPriceDisplay}</td>
      <Position bet={bet} canBet={canBet}/>
      <Result round={round} bet={bet} winner={winner}/>
    </tr>
  )
}

export default RoundRow
