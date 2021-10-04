import { useWeb3React } from "@web3-react/core"
import { useRouter } from "next/router"
import React from "react"
import useLogin from "../../../../hooks/useLogin"

interface PositionProps {
  id?: string
  bet: Bet | undefined
  canBet: boolean
}

type ShowStates = "make-bet" | "direction" | "login" | "position"

const Position: React.FunctionComponent<PositionProps> = (props) => {
  const { bet, canBet, id } = props
  const router = useRouter()

  const { handleActivate } = useLogin()
  const { account } = useWeb3React()

  const position = bet === undefined ? null : bet.direction === "bear" ? "↓" : "↑"

  let showEl: ShowStates = "position"
  if (canBet && account) {
    showEl = "direction"
  } else if (account === undefined && canBet) {
    showEl = "login"
  }

  let className = "justify-center text-center border border-grey-900"
  if (canBet && account) {
    className = "justify-center text-center border border-grey-900 bg-gradient-to-r from-secondary to-accent via-base-100"
  } else if (bet?.direction === "bull") {
    className = "justify-center text-center border border-grey-900 bg-accent"
  } else if (bet?.direction === "bear") {
    className = "justify-center text-center border border-grey-900 bg-secondary"
  }

  return (
    <td className={className} id={id}>
      {showEl === "direction" &&
        <div className="flex content-center divide-x">
          <a className="px-4 w-1/2" href={`${router.pathname}#make-bet-bear-modal`}>↓</a>
          <a className="px-4 w-1/2" href={`${router.pathname}#make-bet-bull-modal`}>↑</a>
        </div>
      }
      {showEl === "position" && <div className={"px-4 mx-1"}>{position}</div>}
      {showEl === "login" && <button className="btn btn-primary btn-sm" onClick={handleActivate}>Login</button>}
    </td>
  )
}

export default Position
