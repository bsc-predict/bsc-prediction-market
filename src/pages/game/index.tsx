import React from 'react'
import { MakBetBull, MakeBetBear } from '../../components/modal/MakeBet'
import HistoryPage from '../history'
import RoundsPage from './rounds'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { fetchArchivedRounds, fetchLatestRounds } from '../../thunks/round'
import { UserConfigContext } from '../../contexts/UserConfigContext'
import { RefreshContext } from '../../contexts/RefreshContext'
import { useWeb3React } from '@web3-react/core'
import { setAccount } from '../../stores/accountSlice'
import { fetchBalance } from '../../thunks/account'
import { fetchLatestOracle } from '../../thunks/oracle'
import LeaderboardPage from '../leaderboard'
import { useRouter } from 'next/router'

type TabTypes = "Play" | "History" | "Leaderboard"

const GamePage: React.FunctionComponent = () => {

  const [historyAccount, setHistoryAccount] = React.useState<string | undefined>(undefined)

  const [active, setActive] = React.useState<TabTypes>("Play")
  const { showRows } = React.useContext(UserConfigContext)
  const { slow, fast } = React.useContext(RefreshContext)

  const { library, account: web3Account } = useWeb3React()
  const router = useRouter()

  const game = useAppSelector(s => s.game.game)
  const account = useAppSelector(s => s.account.account)
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    dispatch<any>(setAccount({ account: web3Account || undefined, library }))
  }, [web3Account, dispatch, library])

  React.useEffect(() => {
    dispatch<any>(fetchArchivedRounds({ latest: false }))
  }, [dispatch, game])

  React.useEffect(() => {
    if (account) {
      dispatch<any>(fetchBalance(account))
    }
  }, [slow, account, dispatch])

  React.useEffect(() => {
    if (active === "Play") {
      dispatch<any>(fetchLatestRounds(showRows))
      dispatch<any>(fetchLatestOracle())
    }
  }, [dispatch, showRows, fast, active, game])

  const handleOnHistory = React.useCallback((a: string) => {
    setHistoryAccount(a)
    setActive("History")
  }, [])

  const tabs: TabTypes[] = ["Play", "History", "Leaderboard"]

  return (
    <div className="space-y-4">
      <div className="tabs">
        {tabs.map(tab =>
          <a
            key={tab}
            onClick={() => setActive(tab)}
            className={active === tab ?
              "tab tab-lg tab-active tab-bordered" :
              "tab tab-lg tab-bordered"
            }
            id={tab === "History" ? "reactour-history" : undefined}
          >
            {tab}
          </a>
        )}
      </div>
      {active === "Play" && <div >
        <RoundsPage />
        {MakBetBull}
        {MakeBetBear}
      </div>}
      {active === "History" && <HistoryPage account={historyAccount} />}
      {active === "Leaderboard" && <LeaderboardPage onHistory={handleOnHistory} />}
    </div>
  )
}

export default GamePage
