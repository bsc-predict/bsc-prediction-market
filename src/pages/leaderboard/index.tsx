import { useRouter } from "next/router"
import React from "react"
import { getLeaderboard } from "src/api"
import { useAppSelector } from "src/hooks/reduxHooks"

interface LeaderboardPageProps {
  onHistory: (a: string) => void
}

const LeaderboardPage: React.FunctionComponent<LeaderboardPageProps> = (props) => {
  const { onHistory } = props

  const [evenMoney, setEvenMoney] = React.useState(false)
  const [leaderboard, setLeaderboard] = React.useState<Leaderboard[]>([])
  const [evenMoneyLeaderboard, setEvenMoneyLeaderboard] = React.useState<Leaderboard[]>([])

  const game = useAppSelector(s => s.game.game)

  React.useEffect(() => {
    if (game) {
      getLeaderboard({ evenMoney: true, game }).then(setEvenMoneyLeaderboard)
      getLeaderboard({ evenMoney: false, game }).then(setLeaderboard)
    }
  }, [game])

  const effective = evenMoney ? evenMoneyLeaderboard : leaderboard

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
            <td className="px-5">Account</td>
            <td className="px-5">Played</td>
            <td className="px-5">Winnings</td>
            <td className="px-5">Winnings Even Money</td>
            <td className="px-5">Average Bet Size</td>
          </tr>
        </thead>
        <tbody>
          {effective.map(e =>
            <tr key={e.account}>
              <td className="px-5 p-1 border border-grey-800 cursor-pointer underline text-bold" onClick={() => selectAccount(e.account)}>{e.account}</td>
              <td className="px-5 p-1 border border-grey-800 text-center">{e.played.toLocaleString()}</td>
              <td className="px-5 p-1 border border-grey-800 text-center">{e.winnings.toFixed(4)}</td>
              <td className="px-5 p-1 border border-grey-800 text-center">{e.winningsEvenMoney.toFixed(4)}</td>
              <td className="px-5 p-1 border border-grey-800 text-center">{e.averageBetSize.toFixed(4)}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default LeaderboardPage
