import React from "react"
import { toTimeString } from "../../../utils/utils"

const initRound = {
  bullAmount: 1.6713,
  bearAmount: 2.4897,
  prizePool: 42.11,
  lockPrice: 0,
  close: 0,
}

const MockRound: React.FunctionComponent = () => {
  const [round, setRound] = React.useState(initRound)
  const [timeRemaining, setTimeRemaining] = React.useState(93)

  React.useEffect(() => {
    setInterval(() => setTimeRemaining(prior => prior <= -10 ? 300 : prior - 1), 1000)
  }, [])

  return(
    <div>
      <div>
        Time remaining: ~ {toTimeString(Math.max(0, timeRemaining))}
      </div>
      <div>
        
      </div>
      <div>

      </div>
    </div>
  )
}

export default MockRound