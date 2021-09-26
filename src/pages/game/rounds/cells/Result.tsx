import React from "react"
import { toEther } from "../../../../utils/utils"

interface ResultProps {
  bet: Bet | undefined
}

const Result: React.FunctionComponent<ResultProps> = (props) => {
  const {bet} = props

  let winAmount = bet?.wonAmount !== undefined ? toEther(bet.wonAmount, 4) : ""

  const betValue = bet ? toEther(bet.value, 4) : ""

  let className = "px-5 p-1 border border-grey-800 text-center"

  if (bet && bet.status === "pending") {
    className = "px-5 p-1 border border-grey-800 text-center"
  } else if (bet && bet.won === true) {
    className = "px-5 p-1 border border-grey-800 text-center bg-accent"
  } else if (bet && bet.won === false) {
    className = "px-5 p-1 border border-grey-800 text-center bg-secondary"
  }

  return(
    <td className={className}>
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
