import { useRouter } from "next/router"
import React from "react"
import { getLeaderboard } from "src/api"
import { useAppSelector } from "src/hooks/reduxHooks"

interface LeaderboardPageProps {
  onHistory: (a: string) => void
}

const PAGINATION = 20

const LeaderboardPage: React.FunctionComponent<LeaderboardPageProps> = (props) => {
  const { onHistory } = props

  const [evenMoney, setEvenMoney] = React.useState(false)
  const [page, setPage] = React.useState(0)
  const [leaderboard, setLeaderboard] = React.useState<Leaderboard[]>([])
  const [evenMoneyLeaderboard, setEvenMoneyLeaderboard] = React.useState<Leaderboard[]>([])

  const game = useAppSelector(s => s.game.game)

  React.useEffect(() => {
    if (game) {
      getLeaderboard({ evenMoney: true, game }).then(setEvenMoneyLeaderboard)
      getLeaderboard({ evenMoney: false, game }).then(setLeaderboard)
    }
  }, [game])

  const filtered = evenMoney ? evenMoneyLeaderboard : leaderboard
  const paginated = filtered.slice(page * PAGINATION, (page + 1) * PAGINATION)
  const numPages = Math.ceil(filtered.length / PAGINATION)

  const selectAccount = (a: string) => {
    onHistory(a)
  }

  return (
    <div >
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
