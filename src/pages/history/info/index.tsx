import React from "react"
import { BlockchainContext } from "../../../contexts/BlockchainContext"
import { getBalance } from "../../../utils/accounts"
import { calcMaxDrawdown } from "../../../utils/bets"
import { prettyNumber } from "../../../utils/utils"
import web3 from "../../../utils/web3"

interface HistoricalInfoProps {
  bets: Bet[]
  account: string
}

const HistoricalInfo: React.FunctionComponent<HistoricalInfoProps> = (props) => {
  const {bets, account} = props

  const [performanceLast, setPerformanceLast] = React.useState(20)
  const [balance, setBalance] = React.useState<Balance>({balance: "0", balanceUsd: 0, bnbPrice: 0, balanceEth: "0"})
  const [curAccount, setCurAccount] = React.useState("")
  const {web3Provider} = React.useContext(BlockchainContext)
  
  React.useEffect(() => {
    setCurAccount(account)
  }, [account])

  React.useEffect(() => {
    const web3 = web3Provider()
    if (account) {
      getBalance(web3, account).then(setBalance)
    }
  }, [account, web3Provider])

  const betsWon = bets.filter(b => b.won).length
  const totalBets = bets.length
  const totalWon = Number(
    web3.utils.fromWei(bets.reduce((acc, cur) => acc + (cur.wonAmount || 0), 0).toString(16), "ether"))
  const biggestWin = bets.reduce((a, b) => (b.wonAmount || 0) > (a.wonAmount || 0) ? b : a, bets?.[0])
  const biggestWinAmount = biggestWin ? Number(web3.utils.fromWei(biggestWin.wonAmount?.toString() || "0", "ether")) : 0
  
  const performance = web3.utils.fromWei(bets.slice(0, performanceLast).reduce((acc, b) => acc + (b?.wonAmount || 0), 0).toString(), "ether")
  const maxDrawdown = web3.utils.fromWei(calcMaxDrawdown(bets.slice(0, performanceLast)).toString(), "ether")

  return(
    <div className="mb-5 mt-5 overflow-auto">
      <table className="table-auto border-collapse">
        <tbody>
          <tr>
            <td className="px-5 p-1 border">Account</td>
            <td className="px-5 p-1 border space-x-4 bg-accent">
              <form>
                <label>
                  <input
                    className="bg-accent"
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
              {biggestWin  && <span> - {prettyNumber(biggestWin?.wonPerc || "", 2)}x</span>}
            </td>
          </tr>
          <tr>
            <td className="px-5 p-1 border">
              Performance in last
              <input
                type="number"
                className="bg-accent w-12 mx-4 apperance-none"
                value={performanceLast}
                onChange={e => setPerformanceLast(Math.floor(Number(e.currentTarget.value)))}
              />
              rounds
            </td>
            <td className="px-5 p-1 border">
                {prettyNumber(performance, 4)}
                &nbsp; Max drawdown: {prettyNumber(maxDrawdown, 4)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default HistoricalInfo
