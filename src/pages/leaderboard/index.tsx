import { useRouter } from "next/router"
import React from "react"
import { getLeaderboard } from "src/api"
import { useAppSelector } from "src/hooks/reduxHooks"

interface LeaderboardPageProps {
  onHistory: (a: string) => void
}

const PAGINATION = 20
type LeaderboardType = "all-time" | "all-time-even-money" | "weekly-winners" | "weekly-losers"

const LeaderboardPage: React.FunctionComponent<LeaderboardPageProps> = (props) => {
  const { onHistory } = props

  const [type, setType] = React.useState<LeaderboardType>("all-time")
  const [page, setPage] = React.useState(0)
  const [leaderboard, setLeaderboard] = React.useState<Leaderboard[]>([])
  const [evenMoneyLeaderboard, setEvenMoneyLeaderboard] = React.useState<Leaderboard[]>([])
  const [weeklyLeaderboard, setWeeklyLeaderboard] = React.useState<Leaderboard[]>([])
  const [weeklyLoserLeaderboard, setWeeklyLoserLeaderboard] = React.useState<Leaderboard[]>([])
  const [results, setResults] = React.useState<Leaderboard[]>([])

  const router = useRouter()
  const { t: pathType } = router.query

  const game = useAppSelector(s => s.game.game)

  React.useEffect(() => {
    if (game) {
      getLeaderboard({ game, evenMoney: true, type: "all-time" }).then(setEvenMoneyLeaderboard)
      getLeaderboard({ game, type: "all-time" }).then(setLeaderboard)
      getLeaderboard({ game, type: "weekly" }).then(setWeeklyLeaderboard)
      getLeaderboard({ game, type: "weekly", losers: true }).then(setWeeklyLoserLeaderboard)
    }
  }, [game])

  React.useEffect(() => {
    const types = new Set(["all-time", "all-time-even-money", "weekly-winners", "weekly-losers"])
    if (typeof pathType === "string" && types.has(pathType)) {
      setType(pathType as LeaderboardType)
      router.replace(router.asPath.replace(/\?t=.+/g, ""), undefined, { shallow: true });

    }
  }, [pathType])

  React.useEffect(() => {
    if (type === "all-time") {
      setResults(leaderboard)
    } else if (type === "all-time-even-money") {
      setResults(evenMoneyLeaderboard)
    } else if (type === "weekly-winners") {
      setResults(weeklyLeaderboard)
    } else if (type === "weekly-losers") {
      setResults(weeklyLoserLeaderboard)
    }
  }, [type, leaderboard, weeklyLeaderboard, weeklyLoserLeaderboard, evenMoneyLeaderboard])

  const paginated = results.slice(page * PAGINATION, (page + 1) * PAGINATION)
  const numPages = Math.ceil(results.length / PAGINATION)

  const selectAccount = (a: string) => {
    onHistory(a)
  }

  return (
    <div >
      <div className="stat-title flex align-center">
        Type
      </div>
      <div className="stat-value">
        <select className="select w-full max-w-xs" value={type} onChange={v => setType(v.currentTarget.value as LeaderboardType)}>
          <option value="all-time">All-Time Winners</option>
          <option value="all-time-even-money">All-Time Even Money Winners</option>
          <option value="weekly-winners">Weekly Winners</option>
          <option value="weekly-losers">Weekly Losers</option>
        </select>
      </div>
      <table >
        <thead>
          <tr>
            <td className="px-5">Position</td>
            <td className="px-5">Account</td>
            <td className="px-5">Played</td>
            <td className="px-5">Winnings</td>
            <td className="px-5">Winnings Even Money</td>
            <td className="px-5">Average Bet Size</td>
          </tr>
        </thead>
        <tbody>
          {paginated.map((e, idx) =>
            <tr key={e.account}>
              <td className="p-2 text-center border border-grey-800">{(PAGINATION * page) + idx + 1}</td>
              <td className="px-5 p-2 border border-grey-800 cursor-pointer underline text-bold" onClick={() => selectAccount(e.account)}>{e.account}</td>
              <td className="px-5 p-2 border border-grey-800 text-center">{e.played.toLocaleString()}</td>
              <td className="px-5 p-2 border border-grey-800 text-center">{e.winnings.toFixed(4)}</td>
              <td className="px-5 p-2 border border-grey-800 text-center">{e.winningsEvenMoney.toFixed(4)}</td>
              <td className="px-5 p-2 border border-grey-800 text-center">{e.averageBetSize.toFixed(4)}</td>
            </tr>
          )}
          <tr>
            <td colSpan={6} className="btn-group w-full mt-4">
              {Array.from(Array(numPages).keys()).map(p =>
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={p === page ? "btn btn-sm btn-ghost btn-active float-right" : "btn btn-sm btn-ghost float-right"}>
                  {p + 1}
                </button>
              )}
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  )
}

export default LeaderboardPage
