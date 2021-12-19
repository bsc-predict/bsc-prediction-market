import { useRouter } from "next/router"
import React from "react"
import { fetchCakeBalance } from "src/contracts/cake"
import { useAppSelector } from "src/hooks/reduxHooks"
import { shortenAddress } from "src/utils/accounts"


const Info: React.FunctionComponent = () => {
  const [secondsRemaining, setSecondsRemaining] = React.useState(0)
  const [claiming, setClaiming] = React.useState(false)
  const [balance, setBalance] = React.useState<Balance>({ price: 0, balance: "0", balanceEth: 0, balanceUsd: 0 })

  const account = useAppSelector(s => s.account.account)

  React.useEffect(() => {
    if (account) {
      fetchCakeBalance(account).then(setBalance)
    }
  }, [account])


  return (
    <div className="mb-5 mt-5 overflow-auto">
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
          <div className="stat-value">{balance.balanceEth}</div>
          <div className="stat-desc"> {balance ? `\$${(Math.round(balance.balanceUsd * 100) / 100).toLocaleString()}` : ""}</div>
        </div>
        <div className="stat" id="reactour-time-remaining">
          <div className="stat-title">Time Remaining</div>
          <div className="stat-value">{toTimeString(secondsRemaining)}</div>
          <div className="stat-desc">&nbsp;</div>
        </div>
        {showReactour && <div className="stat">
          <div className="stat-title">Help</div>
          <div className="stat-value cursor-pointer" onClick={() => showReactour(true)}>?</div>
          <div className="stat-desc">&nbsp;</div>
        </div>}
      </div>
    </div>
  )
}

export default Info