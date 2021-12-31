import { useRouter } from "next/router"
import React, { useContext } from "react"
import { NotificationsContext } from "src/contexts/NotificationsContext"
import { claimTickets } from "src/contracts/lottery"
import { useAppDispatch, useAppSelector } from "src/hooks/reduxHooks"
import { fetchLotteryBetsThunk } from "src/thunks/lottery"
import { createArray } from "src/utils/utils"


const MAX_PAGES = 2
const LOAD_MORE_STEP = 2
const TABLE_SIZE = 5

const scoreTicket = (bet: UserInfo, lottery?: Lottery) => {
  let score = -1
  if (lottery === undefined) { return 0 }
  for (let i = lottery.finalNumber.length - 1; i > 0; i--) {
    if (bet.number[i] === lottery.finalNumber[i]) {
      score += 1
    } else {
      break
    }
  }
  return score
}

const LotteryHistory: React.FunctionComponent = () => {
  const [curBets, setCurBets] = React.useState<UserInfo[]>([])
  const [curLottery, setCurLottery] = React.useState<Lottery>()
  const [isBusy, setIsBusy] = React.useState(false)
  const [isClaiming, setIsClaiming] = React.useState(false)
  const [page, setPage] = React.useState(0)

  const { setMessage } = useContext(NotificationsContext)
  const dispatch = useAppDispatch()
  const balance = useAppSelector(s => s.account.cakeBalance)
  const account = useAppSelector(s => s.account.account)
  const library = useAppSelector(s => s.account.library)
  const lotteries = useAppSelector(s => s.lottery.history)
  const latest = useAppSelector(s => s.lottery.latest)


  const lotteriesQueried = useAppSelector(s => s.lottery.lotteriesQueried)
  const bets = useAppSelector(s => s.lottery.bets)
  const router = useRouter()

  React.useEffect(() => {
    setIsBusy(false)
  }, [bets])

  const betsMap = new Map<number, UserInfo[]>()
  bets.forEach(b => betsMap.set(b.lotteryId, (betsMap.get(b.lotteryId) || []).concat(b)))

  const lotteriesMap = new Map<number, Lottery>()
  lotteries.forEach(l => lotteriesMap.set(l.id, l))
  if (latest) {
    lotteriesMap.set(latest.id, latest)
  }

  const loadMore = () => {
    setIsBusy(true)
    const minLottery = Math.min(...lotteriesQueried)
    const ids = createArray(minLottery - LOAD_MORE_STEP - 1, minLottery - 1)
    dispatch<any>(fetchLotteryBetsThunk({ ids }))
  }

  React.useEffect(() => {
    setCurLottery(latest)
  }, [latest])

  React.useEffect(() => {
    const betsMap = new Map<number, UserInfo[]>()
    bets.forEach(b => betsMap.set(b.lotteryId, (betsMap.get(b.lotteryId) || []).concat(b)))
  
    if (curLottery) {
      setCurBets(betsMap.get(curLottery?.id)?.sort((a, b) => scoreTicket(a, curLottery) < scoreTicket(b, curLottery) ? 1 : -1) || [])
    } else {
      setCurBets([])
    }

  }, [curLottery, bets])

  const selectLottery = (id: number) => {
    const l = lotteriesMap.get(id)
    if (l) {
      setCurLottery(l)
    }
  }

  const claim = () => {
    const claimable = curBets
      .map(b => ({ ...b, bracket: scoreTicket(b, curLottery) }))
      .filter(b => b.bracket >= 0 && b.claimed === false)
    if (account && library && curLottery && claimable.length > 0) {
      setIsClaiming(true)
      claimTickets({
        account,
        library,
        lotteryId: curLottery.id,
        ticketIds: claimable.map(c => c.ticketId),
        brackets: claimable.map(c => c.bracket),
        onSent: () => {
          setMessage({ type: "info", title: "Claim sent", duration: 5000 })
        },
        onConfirmed: () => {
          dispatch<any>(fetchLotteryBetsThunk({ ids: [curLottery.id] }))
          setIsClaiming(false)
          setMessage({ type: "success", title: "Claim processed", duration: 5000 })
        },
        onError: (e?: Error) => {
          setIsClaiming(false)
          setMessage({ type: "error", title: "Claim failed", message: e?.message || "", duration: 5000 })
        }
      }
      )
    }
  }

  const numPages = Math.floor(curBets.length / TABLE_SIZE) + Math.min(curBets.length % TABLE_SIZE, 1)

  return (
    <div id={"lottery-history"} className="modal">
      <div className="flex flex-col modal-box h-120 overscroll-none">
        <div className="flex justify-between items-center pb-3">
          <p className="text-2xl font-bold">History</p>
          <a className="modal-close cursor-pointer z-50" onClick={() => router.back()}>
            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
            </svg>
          </a>
        </div>
        <div className="divider" />
        <p className="font-bold">{balance.balanceEth.toFixed(2)} CAKE</p>
        <div className="divider" />
        <div className="grow space-y-4">
          {curLottery &&
            <div className="space-y-2">
              <span className="font-bold">Winner</span>
              <table>
                <tbody>
                  <tr>
                    {curLottery.finalNumber && curLottery.finalNumber.slice(1).split("").reverse().map((n, idx) =>
                      <td className="w-8 text-center" key={idx}>{n}</td>
                    )}
                    {curLottery.finalNumber === "0" && <>
                      <td className="w-8 text-center">?</td>
                      <td className="w-8 text-center">?</td>
                      <td className="w-8 text-center">?</td>
                      <td className="w-8 text-center">?</td>
                      <td className="w-8 text-center">?</td>
                      <td className="w-8 text-center">?</td>
                    </>}
                  </tr>
                </tbody>
              </table>
            </div>}
          <div className="space-y-2">
            {curBets.length === 0 ?
              <div className="font-bold text-lg">No Tickets</div> :
              <>
                <div className="font-bold">Tickets</div>
                <div className="h-40">
                  <table>
                    <tbody>
                      {curBets.slice(page * TABLE_SIZE, (page + 1) * TABLE_SIZE).map(bet => {
                        const score = scoreTicket(bet, curLottery)
                        return (
                          <tr key={bet.ticketId}>
                            {bet.number.slice(1).split("").reverse().map((n, idx) => {
                              return (<td
                                className={score >= idx ? "w-8 bg-accent text-center" : "w-8 text-center"}
                                key={idx}
                              >
                                {n}
                              </td>)
                            })}
                          </tr>)
                      })}
                    </tbody>
                  </table>

                </div>
              </>}
          </div>
        </div>
        <div>
          <div className="btn-group float-right">
            <button
              onClick={() => setPage(prior => Math.max(0, prior - 1))}
              className={page === 0 ? "btn btn-xs btn-disabled" : "btn btn-xs"}>
              «
            </button>
            {Array.from(Array(numPages).keys())
              .slice(Math.max(0, page - MAX_PAGES), Math.min(numPages, page + MAX_PAGES + 1))
              .map(p =>
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={page === p ? "btn btn-xs bg-accent w-8" : "btn btn-xs w-8"}>
                  {p + 1}
                </button>)}
            <button
              onClick={() => setPage(prior => Math.min(numPages - 1, prior + 1))}
              className={page === numPages - 1 ? "btn btn-xs btn-disabled" : "btn btn-xs"}
            >
              »
            </button>
          </div>
        </div>
        <div className="flex items-center">
          <div className="dropdown dropdown-hover dropdown-right dropdown-end">
            <div tabIndex={0} className="m-1 btn btn-ghost">Lottery {curLottery?.id}</div>
            <ul className="shadow menu dropdown-content bg-base-100 rounded w-60 h-64 overflow-auto overscroll-none  border-solid border-white border">
              {lotteriesQueried.map(l => {
                const bets = betsMap.get(l)
                return (
                  <li
                    key={l}
                    className="btn btn-square btn-block btn-ghost"
                    onClick={() => selectLottery(l)}
                  >
                    <a>{l} {bets && `(${bets.length} tickets)`}</a>
                  </li>)
              })}
              <li className="btn btn-square btn-block btn-ghost">
                <button className={isBusy ? "btn loading" : "btn"} onClick={() => loadMore()}>Load more</button>
              </li>
            </ul>
          </div>
          <button
            className={
              isClaiming ? "btn loading" :
                curBets.some(b => scoreTicket(b, curLottery) > 0 && b.claimed === false) ?
                  "btn btn-accent" :
                  "btn btn-disabled"}
            onClick={() => claim()}
          >
            Claim
          </button>
        </div>
      </div>
    </div>
  )
}

export default LotteryHistory
