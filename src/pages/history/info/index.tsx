import React, { KeyboardEventHandler } from "react"
import { getBalance } from "../../../utils/accounts"
import { prettyNumber } from "../../../utils/utils"
import web3 from "../../../utils/web3"

interface HistoricalInfoProps {
  bets: Bet[]
  account: string
}

const HistoricalInfo: React.FunctionComponent<HistoricalInfoProps> = (props) => {
  const [balance, setBalance] = React.useState<Balance>({balance: "0", balanceUsd: 0, bnbPrice: 0, balanceEth: "0"})
  const {bets, account} = props

  React.useEffect(() => {
    if (account) {
      getBalance(account).then(setBalance)
    }
  }, [account])

  const handleEditAccount: KeyboardEventHandler<HTMLSpanElement> = e => {
    if (e.key === "Enter") {
      return false
      // TODO: Set account and update url!
    }
  }

  const betsWon = bets.filter(b => b.won).length
  const totalBets = bets.length
  const totalWon = Number(
    web3.utils.fromWei(bets.reduce((acc, cur) => acc + (cur.wonAmount || 0), 0).toString(16), "ether"))

  return(
    <div className="mb-5 mt-5">
      <table className="table-auto border-collapse">
        <tbody>
          <tr>
            <td className="px-5 p-1 border">Account</td>
            <td className="px-5 p-1 border w-86">
              <span contentEditable onKeyDown={handleEditAccount} suppressContentEditableWarning={true}>{account}</span>
              &nbsp;<span className="cursor:pointer">✎</span>
            </td>
          </tr>
          <tr>
            <td className="px-5 p-1 border">Balance</td>
            <td className="px-5 p-1 border w-86">
              {balance !== undefined ?
                `${Number(balance.balanceEth).toFixed(2)} 
                (\$${(Math.round(balance.balanceUsd * 100) / 100).toLocaleString()})` :
                ""}
            </td>
          </tr>
          <tr>
            <td className="px-5 p-1 border">Games played</td>
            <td className="px-5 p-1 border w-86">{bets.length.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="px-5 p-1 border">Games won</td>
            <td className="px-5 p-1 border w-86">
              {betsWon.toLocaleString()} / {totalBets.toLocaleString()}&nbsp;
              ({((betsWon / totalBets) * 100).toFixed(2)}%)</td>
          </tr>
          <tr>
            <td className="px-5 p-1 border">Total won</td>
            <td className="px-5 p-1 border w-86">
              {prettyNumber(totalWon, 2)} BNB (${prettyNumber(balance.bnbPrice * totalWon, 2)})
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default HistoricalInfo
