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

  let winAmount = ""
  if (bet && bet?.direction === winner) {
    const payout = winner === "bull" ? round.bullPayout : round.bearPayout
    winAmount = (bet.valueEthNum * (payout - 1.0)).toFixed(4)
  }
  
  return(
    <td className={`px-5 p-1 border border-grey-800 text-center ${bet?.direction === winner ? "text-green-600" : "text-red-600"}`}>
      {bet && bet.direction !== winner && Number(web3.utils.fromWei(bet.value, "ether")).toFixed(4)}
      {bet && bet.direction === winner && bet.status === "claimable"  &&
        <button className={buttonClass} onClick={() => bet && bet.epoch && claim(bet.epoch)}>→ {winAmount} ←</button>
      }
      {bet && bet.direction === winner && bet.status === "pending" && "Claiming..."}
      {bet && bet.direction === winner && bet.status === "claimed" && winAmount}
    </td>

  )
}

export default Result
