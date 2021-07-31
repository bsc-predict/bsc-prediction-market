import { useWeb3React } from "@web3-react/core"
import { useRouter } from "next/router"
import React from "react"
import useLogin from "../../../../hooks/useLogin"

interface PositionProps {
  bet: Bet | undefined
  canBet: boolean
}

type ShowStates = "make-bet" | "direction" | "login" | "position"

const Position: React.FunctionComponent<PositionProps> = (props) => {
  const {bet, canBet} = props
  const router = useRouter()
  
  const {handleActivate} = useLogin()
  const {account} = useWeb3React()

  const position = bet === undefined ? null : bet.direction === "bear" ? "↓" : "↑"

  let showEl: ShowStates = "position"
  if (canBet && account) {
    showEl = "direction"
  } else if (account === undefined && canBet) {
    showEl = "login"
  }

  return(
    <td className={`justify-center text-center border border-grey-900
      ${bet?.direction === "bull" ? "bg-accent" : bet?.direction === "bear" ? "bg-secondary" : ""}
      ${(canBet && account) ? "bg-gradient-to-r from-secondary to-accent via-base-100" : ""}`}
    >      
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
