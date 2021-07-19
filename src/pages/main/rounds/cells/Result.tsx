import React from "react"
import { usePredictionContract } from "../../../../contracts/prediction"
import web3 from "../../../../utils/web3"
import { buttonClass } from "./style"

interface ResultProps {
  round: Round
  bet: Bet | undefined
  winner: string | undefined
}

const Result: React.FunctionComponent<ResultProps> = (props) => {
  const {round, bet, winner} = props

  const {claim} = usePredictionContract()

  return(
    <td className={`px-5 p-1 border border-grey-800 text-center ${bet?.direction === winner ? "text-green-600" : "text-red-600"}`}>
      {bet && bet.direction !== winner && Number(web3.utils.fromWei(bet.value, "ether")).toFixed(4)}
      {bet && bet.direction === winner && bet.status === "claimable"  &&
        <button className={buttonClass} onClick={() => bet && bet.epoch && claim(bet.epoch)}>Claim</button>
      }
      {bet && bet.direction === winner && bet.status === "pending" && "Claiming..."}
      {bet && bet.direction === winner && bet.status === "claimed" && bet.direction === "bear" && (bet.valueEthNum * (round.bearPayout - 1.0)).toFixed(4)}
      {bet && bet.direction === winner && bet.status === "claimed" && bet.direction === "bull" && (bet.valueEthNum * (round.bullPayout - 1.0)).toFixed(4)}
    </td>

  )
}

export default Result
