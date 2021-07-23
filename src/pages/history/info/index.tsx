import React from "react"
import { getBalance } from "../../../utils/accounts"
import { prettyNumber } from "../../../utils/utils"
import web3 from "../../../utils/web3"

interface HistoricalInfoProps {
  bets: Bet[]
  account: string
}

const HistoricalInfo: React.FunctionComponent<HistoricalInfoProps> = (props) => {
  const {bets, account} = props

  const [balance, setBalance] = React.useState<Balance>({balance: "0", balanceUsd: 0, bnbPrice: 0, balanceEth: "0"})
  const [curAccount, setCurAccount] = React.useState("")

  React.useEffect(() => {
    setCurAccount(account)
  }, [account])

  React.useEffect(() => {
    if (account) {
      getBalance(account).then(setBalance)
    }
  }, [account])

  const betsWon = bets.filter(b => b.won).length
  const totalBets = bets.length
  const totalWon = Number(
    web3.utils.fromWei(bets.reduce((acc, cur) => acc + (cur.wonAmount || 0), 0).toString(16), "ether"))
  const biggestWin = bets.reduce((a, b) => (b.wonAmount || 0) > (a.wonAmount || 0) ? b : a, bets?.[0])
  const biggestWinAmount = biggestWin ? Number(web3.utils.fromWei(biggestWin.wonAmount?.toString() || "0", "ether")) : 0
  
  const performanceRounds = [10, 20, 50, 100]
  const performance = performanceRounds.map(n => ({
    rounds: n,
    won: web3.utils.fromWei(bets.slice(0, n).reduce((acc, b) => acc + (b?.wonAmount || 0), 0).toString(), "ether")}))

  return(
    <div className="mb-5 mt-5 overflow-auto">
      <table className="table-auto border-collapse">
        <tbody>
          <tr>
            <td className="px-5 p-1 border">Account</td>
            <td className="px-5 p-1 border space-x-4 bg-green-300 dark:bg-green-900">
              <form>
                <label>
                  <input
                    className="bg-green-300 dark:bg-green-900"
                    type="text"
                    name="a"
                    value={curAccount} onChange={e => setCurAccount(e.currentTarget.value)}
                  />
                </label>
            </form>
            </td>
          </tr>
          <tr>
            <td className="px-5 p-1 border">Balance</td>
            <td className="px-5 p-1 border">
              {balance !== undefined ?
                `${Number(balance.balanceEth).toFixed(2)} 
                (\$${(Math.round(balance.balanceUsd * 100) / 100).toLocaleString()})` :
                ""}
            </td>
          </tr>
          <tr>
            <td className="px-5 p-1 border">Games played</td>
            <td className="px-5 p-1 border">{bets.length.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="px-5 p-1 border">Games won</td>
            <td className="px-5 p-1 border">
              {betsWon.toLocaleString()} / {totalBets.toLocaleString()}&nbsp;
              ({((betsWon / totalBets) * 100).toFixed(2)}%)</td>
          </tr>
          <tr>
            <td className="px-5 p-1 border">Total won</td>
            <td className="px-5 p-1 border">
              {prettyNumber(totalWon, 2)} BNB (${prettyNumber(balance.bnbPrice * totalWon, 2)})
            </td>
          </tr>
          <tr>
            <td className="px-5 p-1 border">Biggest win</td>
            <td className="px-5 p-1 border">
              {prettyNumber(biggestWinAmount, 2)} BNB
              (${prettyNumber(balance.bnbPrice * biggestWinAmount, 2)})
              -- {prettyNumber(biggestWin?.wonPerc || "", 2)}x
            </td>
          </tr>
          <tr>
            <td className="px-5 p-1 border">Performance</td>
            <td className="px-5 p-1 border">
                {performance.map(({rounds, won}) => `[${rounds}: ${prettyNumber(won, 4)}]`).join(", ")}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default HistoricalInfo
