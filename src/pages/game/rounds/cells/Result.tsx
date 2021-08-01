import React from "react"
import { BetsContext } from "../../../../contexts/BetsContext"
import { BlockchainContext } from "../../../../contexts/BlockchainContext"
import { NotificationsContext } from "../../../../contexts/NotificationsContext"
import { usePredictionContract } from "../../../../contracts/prediction"
import web3 from "../../../../utils/web3"

interface ResultProps {
  round: Round
  bet: Bet | undefined
  winner: string | undefined
}

const Result: React.FunctionComponent<ResultProps> = (props) => {
  const {round, bet, winner} = props
  const {fetchBets} = React.useContext(BetsContext)
  const {setMessage} = React.useContext(NotificationsContext)
  const {chain} = React.useContext(BlockchainContext)

  const {claim} = usePredictionContract(chain)
  
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
    winAmount = (bet.valueEthNum * payout).toFixed(4)
  }

  const betValue = bet ? Number(web3.utils.fromWei(bet.value, "ether")).toFixed(4) : ""

  let className = "px-5 p-1 border border-grey-800 text-center"
  if (bet && bet?.direction === winner) {
    className = "px-5 p-1 border border-grey-800 text-center bg-accent"
  } else if (bet) {
    className = "px-5 p-1 border border-grey-800 text-center bg-secondary"
  }
  return(
    <td className={className}>
      {bet && bet.direction !== winner && <span>{betValue}</span>}
      {bet && bet.direction === winner && bet.status === "claimable"  &&
        <button className="btn btn-sm btn-accent" onClick={handleClaim}>→ {winAmount} ←</button>}
      {bet && bet.direction === winner && bet.status === "pending" && "Claiming..."}
      {bet && bet.direction === winner && bet.status !== "claimable" && <div>
          <span >{winAmount}</span>
          <span>&nbsp;({betValue})</span>
         
        </div>}
    </td>

  )
}

export default Result
