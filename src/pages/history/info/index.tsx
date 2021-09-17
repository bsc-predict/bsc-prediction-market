import React from "react"
import { ContractContext } from "../../../contexts/ContractContext"
import { calcMaxDrawdown } from "../../../utils/bets"
import { fromWei, prettyNumber, toEther } from "../../../utils/utils"

interface HistoricalInfoProps {
  bets: Bet[]
  account: string
  changeAccount: (a: string) => void
  unclaimed?: boolean
  setUnclaimed: (b: boolean) => void
}

const HistoricalInfo: React.FunctionComponent<HistoricalInfoProps> = (props) => {
  const {bets, account, changeAccount, unclaimed, setUnclaimed} = props

  const [performanceLast, setPerformanceLast] = React.useState(20)
  const [balance, setBalance] = React.useState<Balance>({balance: "0", balanceUsd: 0, bnbPrice: 0, balanceEth: "0"})
  const [curAccount, setCurAccount] = React.useState("")
  const {fetchBalance} = React.useContext(ContractContext)
  
  React.useEffect(() => {
    setCurAccount(account)
  }, [account])

  React.useEffect(() => {
    if (account) {
      fetchBalance(account).then(setBalance)
    }
  }, [account, fetchBalance])

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
    fromWei(bets.reduce((acc, cur) => acc + (cur.wonAmount || 0), 0).toString(16), "ether"))
  const biggestWin = bets.reduce((a, b) => (b.wonAmount || 0) > (a.wonAmount || 0) ? b : a, bets?.[0])
  const biggestWinAmount = biggestWin ? Number(fromWei(biggestWin.wonAmount?.toString() || "0", "ether")) : 0
  
  const performance = fromWei(bets.slice(0, performanceLast).reduce((acc, b) => acc + (b?.wonAmount || 0), 0).toString(), "ether")
  const maxDrawdown = fromWei(calcMaxDrawdown(bets.slice(0, performanceLast)).toString(), "ether")
  return(
    <div className="mb-5 mt-5 overflow-auto">
      <div className="p-4">
        <label className="label">
          <span className="label-text font-bold text-lg">Account</span>
        </label> 
        <input
          type="text"
          placeholder="Account"
          className="input bg-base-200 w-full"
          value={curAccount}
          onChange={handleUpdateAccount}
          onKeyDown={handleKeyDown}  
        />
      </div>
      <div className="md:stats">
        <div className="stat">
          <div className="stat-title">Balance</div> 
          <div className="stat-value">
            {balance !== undefined ? toEther(balance.balance, 2): ""}
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
        {unclaimed !== undefined && <div className="stat">
          <div className="stat-title flex align-center">
            Unclaimed
          </div>
          <div className="stat-value">
            <input
              type="checkbox"
              checked={unclaimed}
              onChange={e => setUnclaimed(e.currentTarget.checked)}
              className="toggle toggle-accent"
            />
          </div>
          <div className="stat-desc">&nbsp;</div>

        </div>}
      </div>
    </div>
  )
}

export default HistoricalInfo
