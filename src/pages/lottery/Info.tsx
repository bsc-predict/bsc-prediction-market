import React from "react"
import LotteryHistory from "src/components/modal/LotteryHistory"
import { useAppDispatch, useAppSelector } from "src/hooks/reduxHooks"
import { fetchLatestLotteryThunk } from "src/thunks/lottery"
import { shortenAddress } from "src/utils/accounts"
import { toEther, toTimeStringHours } from "src/utils/utils"

interface LotteryInfoProps {
  latest?: Lottery
  userInfo?: UserInfo[]
  showHistorical: number
}

const LotteryInfo: React.FunctionComponent<LotteryInfoProps> = ({ latest, userInfo, showHistorical }) => {
  const [secondsRemaining, setSecondsRemaining] = React.useState(0)

  const balance = useAppSelector(s => s.account.cakeBalance)
  const account = useAppSelector(s => s.account.account)
  const dispatch = useAppDispatch()
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (latest) {
        const now = new Date().getTime()
        const diff = latest.endTime.getTime() - now
        setSecondsRemaining(() => {
          const diff = latest.endTime.getTime() - now
          return Math.max(0, diff / 1000)
        })
        if (diff < 0 && Math.abs(diff) % 60 === 0) {
          dispatch<any>(fetchLatestLotteryThunk())
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [latest, dispatch])


  React.useEffect(() => {
    if (latest) {
      const diff = latest.endTime.getTime() - new Date().getTime()
      setSecondsRemaining(Math.max(0, diff / 1000))
    } else {
      setSecondsRemaining(0)
    }
  }, [latest])


  return (
    <div className="md:sticky top-0 mb-5 mt-5 overflow-auto z-10 bg-base-100 w-full">
      <LotteryHistory />
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
          <div className="stat-value">{secondsRemaining === 0 ? "Calculating..." :toTimeStringHours(secondsRemaining)}</div>
          <div className="stat-desc">{latest && latest.endTime.toLocaleString()}</div>
        </div>
        <div className="stat" id="reactour-time-remaining">
          <div className="stat-title">Bets</div>
          <div className="stat-value">
            <a href={"#lottery-history"}>
              <button className="btn btn-large bg-accent w-full">
                {userInfo?.length || 0} Bets
              </button>
            </a>
          </div>
          <div className="stat-desc">Last {showHistorical.toLocaleString()} lotteries</div>
        </div>
      </div>
    </div>
  )
}

export default LotteryInfo