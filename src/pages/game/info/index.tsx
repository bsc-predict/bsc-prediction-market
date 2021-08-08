import React from "react"
import { AccountContext } from "../../../contexts/AccountContext"
import { BlockContext } from "../../../contexts/BlockContext"
import { RoundsContext } from "../../../contexts/RoundsContext"
import { useInterval } from "../../../hooks/useInterval"
import { shortenAddress } from "../../../utils/accounts"
import { toTimeString } from "../../../utils/utils"
import web3 from "../../../utils/web3"

const Info: React.FunctionComponent = () => {
  const [secondsRemaining, setSecondsRemaining] = React.useState(0)

  const {account, balance} = React.useContext(AccountContext)
  const {block} = React.useContext(BlockContext)
  const {rounds, paused} = React.useContext(RoundsContext)

  const latestEpoch = React.useRef(-1)

  React.useEffect(() => {
    const interval = setInterval(() => setSecondsRemaining(prior => Math.max(0, prior - 1)), 1000)
    return () => clearInterval(interval)
  }, [])

  React.useEffect(() => {
    if (!paused) {
      const r = rounds.latest.find(r => r.closePriceNum === 0 && r.lockPriceNum === 0)
      if (r) {
        const t = Math.max(0, (r.lockBlockNum - block) * 3)
        latestEpoch.current = r.epochNum
        setSecondsRemaining(prior => Math.abs(prior - t) < 10 ? prior : t)
      }  
    } else {
      setSecondsRemaining(0)
    }
  }, [paused, block, rounds.latest])

  return(
    <div className="mb-5 mt-5">
      <div className="md:stats">
        <div className="stat">
          <div className="stat-title">Account</div> 
          <div className="stat-value">{account ? shortenAddress(account): ""}</div>
          <div className="stat-desc">&nbsp;</div>
        </div>
        <div className="stat">
          <div className="stat-title">Balance</div> 
          <div className="stat-value">
            {balance !== undefined ? Number(web3.utils.fromWei(balance.balance, "ether")).toFixed(2) : ""}
          </div>
          <div className="stat-desc"> {balance ? `\$${(Math.round(balance.balanceUsd * 100) / 100).toLocaleString()}` : ""}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Time Remaining</div>
          <div className="stat-value">
            ~{toTimeString(secondsRemaining)}
          </div>
          <div className="stat-desc">&nbsp;</div>
        </div>
      </div>
    </div>
  )
}

export default Info