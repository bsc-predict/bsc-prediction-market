import React from "react"
import { useAppSelector } from "../../../../hooks/reduxHooks"
import { toEther } from "../../../../utils/utils"

interface ResultProps {
  id?: string
  bet: Bet | undefined
  round: Round
}

const Result: React.FunctionComponent<ResultProps> = (props) => {
  const { bet, id, round } = props

  let winAmount = bet?.wonAmount !== undefined ? toEther(bet.wonAmount, 4) : ""

  const oracle = useAppSelector(s => s.game.oracle.answer)

  const betValue = bet ? toEther(bet.value, 4) : ""

  let className = "p-1 border border-grey-800 text-center"

  const leading = oracle > round.lockPriceNum ? "bull" : oracle < round.lockPriceNum ? "bear" : "tie" 
  const pendingWin = bet?.direction === leading
  if (bet?.status === "pending" && pendingWin) {
    className = "p-1 border border-grey-800 text-center bg-accent opacity-50"
  } else if (bet?.status === "pending" && !pendingWin) {
    className = "p-1 border border-grey-800 text-center bg-secondary opacity-50"
  } else if (bet?.status === "pending" && oracle > round.lockPriceNum) {
    className = "p-1 border border-grey-800 text-center"
  } else if (bet?.won === true) {
    className = "p-1 border border-grey-800 text-center bg-accent"
  } else if (bet?.won === false) {
    className = "p-1 border border-grey-800 text-center bg-secondary"
  }

  return (
    <td className={className} id={id}>
      {bet && !bet.won && <span>{betValue}</span>}
      {bet && bet.won &&
        <div>
          <span >{winAmount}</span>
          <span>&nbsp;({betValue})</span>
        </div>}
    </td>

  )
}

export default Result
