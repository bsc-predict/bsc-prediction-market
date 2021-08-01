import React from "react"
import { BlockchainContext } from "../../../contexts/BlockchainContext"
import { getBalance } from "../../../utils/accounts"
import { calcMaxDrawdown } from "../../../utils/bets"
import { prettyNumber } from "../../../utils/utils"
import web3 from "../../../utils/web3"

interface HistoricalInfoProps {
  bets: Bet[]
  account: string
  changeAccount: (a: string) => void
}

const HistoricalInfo: React.FunctionComponent<HistoricalInfoProps> = (props) => {
  const {bets, account, changeAccount} = props

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

  const handleUpdateAccount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurAccount(e.currentTarget.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      changeAccount(curAccount)
    }
  }

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
      <div>
        <label className="label">
          <span className="label-text">Account</span>
        </label> 
        <input
          type="text"
          placeholder="Account"
          className="input bg-accent w-full"
          value={curAccount}
          onChange={handleUpdateAccount}
          onKeyDown={handleKeyDown}  
        />
      </div>
      <div className="md:stats">
        <div className="stat">
          <div className="stat-title">Balance</div> 
          <div className="stat-value">
            {balance !== undefined ? Number(web3.utils.fromWei(balance.balance, "ether")).toFixed(2) : ""}
          </div>
          <div className="stat-desc">${(Math.round(balance.balanceUsd * 100) / 100).toLocaleString()}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Games Played</div> 
          <div className="stat-value">{bets.length.toLocaleString()}</div>
          <div className="stat-desc">
            {betsWon.toLocaleString()} / {totalBets.toLocaleString()} ({((betsWon / totalBets) * 100).toFixed(2)}%)
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Won</div> 
          <div className="stat-value">{prettyNumber(totalWon, 2)}</div>
          <div className="stat-desc"> ${prettyNumber(balance.bnbPrice * totalWon, 2)}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Biggest Win</div> 
          <div className="stat-value">{prettyNumber(biggestWinAmount, 2)}</div>
          <div className="stat-desc">
            ${prettyNumber(balance.bnbPrice * biggestWinAmount, 2)}
            {biggestWin  && <span>&nbsp;({prettyNumber(biggestWin?.wonPerc || "", 2)}x)</span>}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">
            Last
            <input
              type="number"
              className="input input-bordered input-xs w-14 bg-accent mx-2"
              value={performanceLast}
              onChange={e => setPerformanceLast(Math.floor(Number(e.currentTarget.value)))}
            />
            rounds  
          </div> 
          <div className="stat-value">{prettyNumber(performance, 4)}</div>
          <div className="stat-desc">Max drawdown: {prettyNumber(maxDrawdown, 4)}</div>
        </div>
      </div>
    </div>
  )
}

export default HistoricalInfo
