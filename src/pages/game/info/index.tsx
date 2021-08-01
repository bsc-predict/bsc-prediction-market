import React from "react"
import { AccountContext } from "../../../contexts/AccountContext"
import { BetsContext } from "../../../contexts/BetsContext"
import { BlockContext } from "../../../contexts/BlockContext"
import { RoundsContext } from "../../../contexts/RoundsContext"
import { useInterval } from "../../../hooks/useInterval"
import { toTimeString } from "../../../utils/utils"
import web3 from "../../../utils/web3"

const Info: React.FunctionComponent = () => {
  const [secondsRemaining, setSecondsRemaining] = React.useState(0)

  const {account, balance} = React.useContext(AccountContext)
  const {bets} = React.useContext(BetsContext)
  const {block} = React.useContext(BlockContext)
  const {rounds} = React.useContext(RoundsContext)
  
  useInterval(() => setSecondsRemaining(prior => Math.max(0, prior - 1)), 1000)

  React.useEffect(() => {
    const r = rounds.latest.find(r => r.closePriceNum === 0 && r.lockPriceNum === 0)
    if (r) {
      const t = Math.max(0, (r.lockBlockNum - block) * 3)
      // if its close enough, don't jump
      setSecondsRemaining(prior => Math.abs(prior - t) < 5 ? prior : t)
    }
  }, [block, rounds.latest])

  return(
    <div className="mb-5 mt-5">
      <table className="table-auto border-collapse">
        <tbody>
          <tr>
            <td className="px-5 p-1 border">Account</td>
            <td className="px-5 p-1 border w-48">
              {account ? account.slice(0,4).concat("...").concat(account.slice(account.length-4)) : ""}
            </td>
          </tr>
          <tr>
            <td className="px-5 p-1 border">Balance</td>
            <td className="px-5 p-1 border w-48">
              {balance !== undefined ?
                `${Number(web3.utils.fromWei(balance.balance, "ether")).toFixed(2)} 
                (\$${(Math.round(balance.balanceUsd * 100) / 100).toLocaleString()})` :
                ""}
            </td>
          </tr>
          <tr>
            <td className="px-5 p-1 border">Games played</td>
            <td className="px-5 p-1 border w-48">{bets.length.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="px-5 p-1 border">Time remaining</td>
            <td className="px-5 p-1 border w-48">~ {toTimeString(secondsRemaining)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Info