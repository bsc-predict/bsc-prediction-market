import React from "react"
import { NotificationsContext } from "../../../../contexts/NotificationsContext"
import { useAppDispatch } from "../../../../hooks/reduxHooks"
import { claim, fetchBets } from "../../../../thunks/bet"
import { toEther } from "../../../../utils/utils"

interface ResultProps {
  round: Round
  bet: Bet | undefined
  winner: string | undefined
  claimCallback?: () => void
}
const account = "" // TODO: Hook up address

const Result: React.FunctionComponent<ResultProps> = (props) => {
  const {bet, claimCallback} = props
  const [claiming, setClaiming] = React.useState(false)

  const {setMessage} = React.useContext(NotificationsContext)
  const dispatch = useAppDispatch()
  
  const handleClaim = () => {
    setClaiming(true)
    if (bet && bet.epoch) {
      dispatch<any>(
        claim({
          epoch: bet.epoch,
          onSent: () => setMessage({type: "info", title: "Claim confirmed", message: "", duration: 5000}),
          onConfirmed: () => {
            claimCallback?.()
            setTimeout(() => account && dispatch<any>(fetchBets(account)), 3000)
            setMessage({type: "success", title: "Claim processed", message: "", duration: 5000})
            setClaiming(false)
          },
          onError: (e?: Error) => {
            setMessage({type: "error", title: "Claim failed", message: e?.message, duration: 7000})
            setClaiming(false)
          }}
        )
      )
    }
  }

  let winAmount = bet?.wonAmount !== undefined ? toEther(bet.wonAmount, 4) : ""

  const betValue = bet ? toEther(bet.value, 4) : ""

  let className = "px-5 p-1 border border-grey-800 text-center"
  if (bet && bet?.won) {
    className = "px-5 p-1 border border-grey-800 text-center bg-accent"
  } else if (bet) {
    className = "px-5 p-1 border border-grey-800 text-center bg-secondary"
  }

  return(
    <td className={className}>
      {bet && !bet.won && <span>{betValue}</span>}
      {bet && bet.won && bet.status === "claimable" && !claiming &&
        <button className="btn btn-xs btn-accent" onClick={handleClaim}>→ {winAmount} ←</button>}
      {bet && bet.won && (bet.status === "pending" || claiming) && "Claiming..."}
      {bet && bet.won && bet.status !== "claimable" &&
        <div>
          <span >{winAmount}</span>
          <span>&nbsp;({betValue})</span>
        </div>}
    </td>

  )
}

export default Result
