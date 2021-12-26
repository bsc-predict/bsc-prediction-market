import { useRouter } from "next/router"
import React from "react"
import { getCakeBalance } from "src/contracts/cake"
import { useAppSelector } from "src/hooks/reduxHooks"
import { shortenAddress } from "src/utils/accounts"
import { toEther, toTimeStringHours } from "src/utils/utils"

interface LotteryInfoProps {
  latest?: Lottery
  userInfo?: UserInfo[]
  showHistorical: number
}

const LotteryInfo: React.FunctionComponent<LotteryInfoProps> = ({ latest, userInfo, showHistorical }) => {
  const [secondsRemaining, setSecondsRemaining] = React.useState(0)
  const [claiming, setClaiming] = React.useState(false)

  const balance = useAppSelector(s => s.account.cakeBalance)
  const account = useAppSelector(s => s.account.account)

  React.useEffect(() => {
    const interval = setInterval(() => setSecondsRemaining(prior => Math.max(0, prior - 1)), 1000)
    return () => clearInterval(interval)
  }, [])


  React.useEffect(() => {
    if (latest) {
      const diff = latest.endTime.getTime() - new Date().getTime()
      setSecondsRemaining(diff / 1000)
    } else {
      setSecondsRemaining(0)
    }
  }, [latest])


  return (
    <div className="sticky top-0 mb-5 mt-5 overflow-auto z-10 bg-base-100">
      <div className="md:stats">
        <div className="stat">
          <div className="stat-title">Game</div>
          <div className="stat-value">
            <div tabIndex={0} className="font-bold">CAKE Lottery</div>
          </div>
          <div className="stat-desc">mainnet</div>
        </div>

        <div className="stat">
          <div className="stat-title">Account</div>
          <div className="stat-value">{account ? shortenAddress(account) : ""}</div>
          <div className="stat-desc">&nbsp;</div>
        </div>
        <div className="stat">
          <div className="stat-title">Balance</div>
          <div className="stat-value">{Number(toEther(balance.balance, 2))}</div>
          <div className="stat-desc"> {balance ? `\$${(Math.round(balance.balanceUsd * 100) / 100).toLocaleString()}` : ""}</div>
        </div>
        <div className="stat" id="reactour-time-remaining">
          <div className="stat-title">Time Remaining</div>
          <div className="stat-value">{toTimeStringHours(secondsRemaining)}</div>
          <div className="stat-desc">{latest && latest.endTime.toLocaleString()}</div>
        </div>
        <div className="stat" id="reactour-time-remaining">
          <div className="stat-title">Bets</div>
          <div className="stat-value">{userInfo?.length || 0}</div>
          <div className="stat-desc">Last {showHistorical.toLocaleString()} lotteries</div>
        </div>
      </div>
    </div>
  )
}

export default LotteryInfo