import { useWeb3React } from "@web3-react/core"
import React from "react"
import useLogin from "../../../../hooks/useLogin"
import { buttonClass } from "./style"
import { ModalContext } from "../../../../contexts/ModalContext"

interface PositionProps {
  bet: Bet | undefined
  canBet: boolean
}

type ShowStates = "make-bet" | "direction" | "login" | "position"

const Position: React.FunctionComponent<PositionProps> = (props) => {
  const {bet, canBet} = props

  const {showModal} = React.useContext(ModalContext)

  const {handleActivate} = useLogin()
  const {account} = useWeb3React()

  const position = bet === undefined ? null : bet.direction === "bear" ? "↓" : "↑"

  let showEl: ShowStates = "position"
  if (canBet && account) {
    showEl = "direction"
  } else if (account === undefined && canBet) {
    showEl = "login"
  }

  const handleSetDirection = React.useCallback((direction: "bull" | "bear") => {
    showModal({tag: "make-bet", direction})
  }, [showModal])

  return(
    <td className={`justify-center text-center border border-grey-900
      ${bet?.direction === "bull" ? "bg-green-300 dark:bg-green-900" : bet?.direction === "bear" ? "bg-red-300 dark:bg-red-900" : ""}
      ${(canBet && account) ? "bg-gradient-to-r from-red-300 to-green-300 via-white dark:from-red-500 dark:to-green-900 dark:via-gray-900" : ""}`}
    >      
      {showEl === "direction" &&
          <div className="flex content-center divide-x">
            <button className="px-4 w-1/2" onClick={() => handleSetDirection("bear")}>↓</button>
            <button className="px-4 w-1/2" onClick={() => handleSetDirection("bull")}>↑</button>
          </div>
      }
      {showEl === "position" && <div className={"px-4 mx-1"}>{position}</div>}
      {showEl === "login" && <button className={buttonClass} onClick={handleActivate}>Login</button>}
    </td>
  )
}

export default Position
