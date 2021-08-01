import { useWeb3React } from "@web3-react/core"
import React from "react"
import { AccountContext } from "../../../../../contexts/AccountContext"
import { BlockContext } from "../../../../../contexts/BlockContext"
import { OracleContext } from "../../../../../contexts/OracleContext"
import { usePredictionContract } from "../../../../../contracts/prediction"
import useLogin from "../../../../../hooks/useLogin"
import { getRoundInfo } from "../../../../../utils/utils"
import web3 from "../../../../../utils/web3"
import Position from "../../cells/Position"
import Result from "../../cells/Result"

interface RoundCardProps {
  round: Round
  bet?: Bet
}

const RoundCardMobile: React.FunctionComponent<RoundCardProps> = (props) => {
  const {round, bet} = props
 
  const {block} = React.useContext(BlockContext)
  const {latestOracle} = React.useContext(OracleContext)

  const {prizePool, lockPrice, winnerColor, liveBorder, curPriceDisplay, winner} = getRoundInfo(round, block, latestOracle)

  const canBet = round.startBlockNum < block && round.lockBlockNum > block 

  return(
    <div className="pb-4">
      <div className="text-lg p-2 mt-2 font-bold">{round.epoch}</div>
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
            <td className={`w-48 px-5 p-1 border border-grey-800 text-center ${winnerColor} ${liveBorder}`}>{curPriceDisplay}</td>
          </tr>
          <tr>
            <td className="w-48 px-5 p-1 border border-grey-800 text-center">Position</td>
            <Position bet={bet} canBet={canBet} />
          </tr>
          <tr>
            <td className="w-48 px-5 p-1 border border-grey-800 text-center">Result</td>
            <Result round={round} bet={bet} winner={winner} />
          </tr>
        </tbody>

      </table>

    </div>
  )
}

export default RoundCardMobile
