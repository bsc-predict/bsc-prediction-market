import React from "react"
import { BetsContext } from "../../../../contexts/BetsContext"
import { NotificationsContext } from "../../../../contexts/NotificationsContext"
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
  const {fetchBets} = React.useContext(BetsContext)
  const {setMessage} = React.useContext(NotificationsContext)
  
  const handleClaim = () => {
    if (bet && bet.epoch) {
      claim(bet.epoch)
        .then(() => {
          fetchBets()
          setMessage({type: "success", title: "Winnings claimed", message: "", duration: 5000})
        })
    }
  }

  let winAmount = ""
  if (bet && bet?.direction === winner) {
    const payout = winner === "bull" ? round.bullPayout : round.bearPayout
    winAmount = (bet.valueEthNum * (payout - 1.0)).toFixed(4)
  }

  const betValue = bet ? Number(web3.utils.fromWei(bet.value, "ether")).toFixed(4) : ""
  return(
    <td className="px-5 p-1 border border-grey-800 text-center">
      {bet && bet.direction !== winner && <span className="text-red-600">{betValue}</span>}
      {bet && bet.direction === winner && bet.status === "claimable"  &&
        <button className={`text-green-600 ${buttonClass}`} onClick={handleClaim}>→ {winAmount} ←</button>}
      {bet && bet.direction === winner && bet.status === "pending" && "Claiming..."}
      {bet && bet.direction === winner && bet.status === "claimed" && <div>
          <span className="text-green-600">{winAmount}</span>
          <span>&nbsp;({betValue})</span>
         
        </div>}
    </td>

  )
}

export default Result
