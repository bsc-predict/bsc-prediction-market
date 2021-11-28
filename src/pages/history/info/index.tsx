import React from "react"
import { getBalance } from "../../../api"
import { useAppSelector } from "../../../hooks/reduxHooks"
import { calcMaxDrawdown } from "../../../utils/bets"
import { fromWei, prettyNumber, toEther } from "../../../utils/utils"

interface HistoricalInfoProps {
  bets: Bet[]
  account: string
  changeAccount: (a: string) => void
  evenMoney: boolean
  setEvenMoney: (b: boolean) => void
}

const HistoricalInfo: React.FunctionComponent<HistoricalInfoProps> = (props) => {
  const {bets, account, changeAccount, evenMoney, setEvenMoney} = props
  const [balance, setBalance] = React.useState<Balance>({balance: "0", balanceEth: "0", balanceUsd: 0, bnbPrice: 0})

  const sortedBets = bets.slice().sort((a, b) => Number(a.epoch) > Number(b.epoch) ? -1 : 1)

  const [performanceLast, setPerformanceLast] = React.useState(20)
  const [curAccount, setCurAccount] = React.useState("")

  const game = useAppSelector(s => s.game.game)
  
  React.useEffect(() => {
    setCurAccount(account)
  }, [account])

  React.useEffect(() => {
    if (account && game) {
      getBalance(game, account).then(b => setBalance(b))
    }
  }, [account, game])

  const handleUpdateAccount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurAccount(e.currentTarget.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      changeAccount(curAccount)
    }
  }

  const betsWon = sortedBets.filter(b => b.won).length
  const totalBets = sortedBets.length
  const totalWon = Number(
    fromWei(sortedBets.reduce((acc, cur) => acc + (cur.wonAmount || 0), 0).toString(16), "ether"))
  const biggestWin = sortedBets.reduce((a, b) => (b.wonAmount || 0) > (a.wonAmount || 0) ? b : a, {wonAmount: 0, wonPerc: 0} as Pick<Bet, "wonAmount" | "wonPerc">)
  const biggestWinAmount = biggestWin ? Number(fromWei(biggestWin.wonAmount?.toString() || "0", "ether")) : 0
  
  const performance = fromWei(sortedBets.slice(0, performanceLast).reduce((acc, b) => acc + (b?.wonAmount || 0), 0).toString(), "ether")
  const maxDrawdown = fromWei(calcMaxDrawdown(sortedBets.slice(0, performanceLast)).toString(), "ether")
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
          <div className="stat-value">{sortedBets.length.toLocaleString()}</div>
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
        {<div className="stat">
          <div className="stat-title flex align-center">
            Even Money
          </div>
          <div className="stat-value">
            <input
              type="checkbox"
              checked={evenMoney}
              onChange={e => setEvenMoney(e.currentTarget.checked)}
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
