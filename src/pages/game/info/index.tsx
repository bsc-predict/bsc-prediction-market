import { useRouter } from "next/router"
import React from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks"
import { setGame } from "../../../stores/gameSlice"
import { setupGame } from "../../../thunks/game"
import { shortenAddress } from "../../../utils/accounts"
import { calcBlockNumber, toEther } from "../../../utils/utils"

const Info: React.FunctionComponent = () => {
  const [secondsRemaining, setSecondsRemaining] = React.useState(0)

  const rounds = useAppSelector(s => s.game.rounds)
  const game = useAppSelector(s => s.game.game)
  const block = useAppSelector(s => calcBlockNumber(s.game.block))
  const paused = useAppSelector(s => s.game.paused)

  const dispatch = useAppDispatch()
  const balance = useAppSelector(s => s.game.balance)
  const account = useAppSelector(s => s.game.account)
  
  const router = useRouter()

  const latestEpoch = React.useRef(-1)

  React.useEffect(() => {
    const interval = setInterval(() => setSecondsRemaining(prior => Math.max(0, prior - 1)), 1000)
    return () => clearInterval(interval)
  }, [])

  React.useEffect(() => {
    const r = rounds.find(r => r.closePriceNum === 0 && r.lockPriceNum === 0)
    if (r && !paused) {
      const t = Math.max(0, (r.lockBlockNum - block) * 3)
      latestEpoch.current = r.epochNum
      // rounds are updated every 5 seconds so if seconds remaining is correct +/- 10 seconds, don't update
      setSecondsRemaining(prior => Math.abs(prior - t) < 10 ? prior : t)
    } else {
      setSecondsRemaining(0)
    }
  }, [block, rounds, paused])

  const handleSetChain = (chain: Chain) => {
    if (game?.pair) {
      dispatch(setGame({chain, pair: game.pair}))
      if (chain === "main") {
        router.push(router.pathname, { query: undefined})
      } else {
        router.push(router.pathname, { query: { c: chain }})
      }
    }
  }

  const otherChain = game?.chain === "main" ? "test" : "main"

  return(
    <div className="mb-5 mt-5">
      <div className="md:stats">
        <div className="stat">
          <div className="stat-title">Account</div> 
          <div className="stat-value">{account ? shortenAddress(account): ""}</div>
          <div className="stat-desc">&nbsp;</div>
        </div>
        <div className="stat">
          <div className="stat-title">Balance</div> 
          <div className="stat-value">
            {balance !== undefined ? Number(toEther(balance.balance, 2)) : "0.00"}
          </div>
          <div className="stat-desc"> {balance ? `\$${(Math.round(balance.balanceUsd * 100) / 100).toLocaleString()}` : ""}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Time Remaining</div>
          {/* @ts-ignore */}
          <div className="stat-value countdown">
            {/* @ts-ignore */}
            <span style={{"--value": Math.floor(secondsRemaining / 60)}}/>:
            {/* @ts-ignore */}
            <span style={{"--value": secondsRemaining % 60}}/>
          </div>
          <div className="stat-desc">&nbsp;</div>
        </div>
        <div className="stat">
          <div className="stat-title">Chain</div>
          <div className={`stat-value ${game?.chain === "main" ? "text-success" : "text-warning"}`}>
            <div className="dropdown dropdown-hover static cursor-default">
              <button tabIndex={0} className="font-bold">{game?.chain}</button>
              <ul tabIndex={0} className="p-2 shadow menu dropdown-content text-base-content bg-base-100 rounded-box w-52">
                <li className="cursor-pointer" onClick={() => handleSetChain(otherChain)}>
                  {otherChain}
                 </li>
              </ul>
            </div>

            </div>
          <div className="stat-desc">&nbsp;</div>
        </div>
      </div>
    </div>
  )
}

export default Info