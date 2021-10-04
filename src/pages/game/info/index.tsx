import { useRouter } from "next/router"
import React from "react"
import { NotificationsContext } from "../../../contexts/NotificationsContext"
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks"
import { setGame } from "../../../stores/gameSlice"
import { claim, fetchBets } from "../../../thunks/bet"
import { shortenAddress } from "../../../utils/accounts"
import { calcBlockTimestamp, toEther, toTimeString } from "../../../utils/utils"

interface InfoProps {
  showReactour: (s: boolean) => void
}

const Info: React.FunctionComponent<InfoProps> = ({ showReactour }) => {
  const [secondsRemaining, setSecondsRemaining] = React.useState(0)
  const [claiming, setClaiming] = React.useState(false)

  const rounds = useAppSelector(s => s.game.rounds)
  const game = useAppSelector(s => s.game.game)
  const block = useAppSelector(s => calcBlockTimestamp(s.game.block))
  const paused = useAppSelector(s => s.game.paused)

  const dispatch = useAppDispatch()
  const balance = useAppSelector(s => s.game.balance)
  const account = useAppSelector(s => s.game.account)
  const claimable = useAppSelector(s => s.game.bets.filter(b => b.status === "claimable"))
  const claimableAmount = claimable.reduce((acc, c) => acc + (c.wonAmount || 0) + c.valueNum, 0)

  const router = useRouter()

  const latestEpoch = React.useRef(-1)
  const { setMessage } = React.useContext(NotificationsContext)

  const handleClaim = () => {
    if (claimable.length > 0) {
      const epochs = claimable.map(c => c.epoch)
      setClaiming(true)
      dispatch<any>(
        claim({
          epochs,
          onSent: () => setMessage({ type: "info", title: "Claim sent", message: "", duration: 5000 }),
          onConfirmed: () => {
            setTimeout(() => account && dispatch<any>(fetchBets(account)), 3000)
            setMessage({ type: "success", title: "Claim processed", message: "", duration: 5000 })
            setClaiming(false)
          },
          onError: (e?: Error) => {
            setMessage({ type: "error", title: "Claim failed", message: e?.message, duration: 7000 })
            setClaiming(false)
          }
        }
        )
      )
    }
  }

  React.useEffect(() => {
    const interval = setInterval(() => setSecondsRemaining(prior => Math.max(0, prior - 1)), 1000)
    return () => clearInterval(interval)
  }, [])

  React.useEffect(() => {
    const r = rounds.find(r => r.closePriceNum === 0 && r.lockPriceNum === 0)
    if (r && !paused) {
      const t = Math.max(0, (r.lockTimestampNum - block))
      latestEpoch.current = r.epochNum
      // rounds are updated every 5 seconds so if seconds remaining is correct +/- 10 seconds, don't update
      setSecondsRemaining(prior => Math.abs(prior - t) < 10 ? prior : t)
    } else {
      setSecondsRemaining(0)
    }
  }, [block, rounds, paused])

  const handleSetChain = (chain: Chain) => {
    if (game?.pair) {
      dispatch(setGame({ chain, pair: game.pair }))
      if (chain === "main") {
        router.push(router.pathname, { query: undefined })
      } else {
        router.push(router.pathname, { query: { c: chain } })
      }
    }
  }

  const otherChain = game?.chain === "main" ? "test" : "main"

  return (
    <div className="mb-5 mt-5">
      <div className="md:stats">
        <div className="stat">
          <div className="stat-title">Game</div>
          <div className="stat-value">
            <div tabIndex={0} className="font-bold">{game?.pair === "bnbusdt" ? "BNB-USDT" : ""}</div>
          </div>
          <div className="stat-desc">{game?.chain === "main" ? "mainnet" : game?.chain === "test" ? "testnet" : ""}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Account</div>
          <div className="stat-value">{account ? shortenAddress(account) : ""}</div>
          <div className="stat-desc">&nbsp;</div>
        </div>
        <div className="stat">
          <div className="stat-title">Balance</div>
          <div className="stat-value">
            {balance !== undefined ? Number(toEther(balance.balance, 2)) : "0.00"}
          </div>
          <div className="stat-desc"> {balance ? `\$${(Math.round(balance.balanceUsd * 100) / 100).toLocaleString()}` : ""}</div>
        </div>
        <div className="stat" id="reactour-claim">
          <div className="stat-title">Claim</div>
          <div className="stat-value">
            <div
              data-tip={claimable.length === 0 ? "" : `[${claimable.map(c => c.epoch).join(", ")}]`}
              className="tooltip  tooltip-bottom"
            >
              <button
                onClick={handleClaim}
                className={
                  claiming ? "btn loading bg-accent" :
                    claimableAmount === 0 ?
                      "btn btn-disabled" :
                      "btn bg-accent text-accent-content hover:bg-accent-focus"
                }>
                {`${toEther(claimableAmount, 2)} BNB`}
              </button>
            </div>
          </div>
          <div className="stat-desc">{claimable.length} round{claimable.length !== 1 ? "s" : ""}</div>
        </div>
        <div className="stat" id="reactour-time-remaining">
          <div className="stat-title">Time Remaining</div>
          <div className="stat-value">{toTimeString(secondsRemaining)}</div>
          <div className="stat-desc">&nbsp;</div>
        </div>
        <div className="stat">
          <div className="stat-title">Help</div>
          <div className="stat-value cursor-pointer" onClick={() => showReactour(true)}>?</div>
          <div className="stat-desc">&nbsp;</div>
        </div>
      </div>
    </div>
  )
}

export default Info