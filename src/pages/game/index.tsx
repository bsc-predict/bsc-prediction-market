import React from 'react'
import { MakBetBull, MakeBetBear } from '../../components/modal/MakeBet'
import HistoryPage from '../history'
import RoundsPage from './rounds'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { fetchArchivedRounds, fetchLatestRounds } from '../../thunks/round'
import { UserConfigContext } from '../../contexts/UserConfigContext'
import { RefreshContext } from '../../contexts/RefreshContext'
import { useWeb3React } from '@web3-react/core'
import { setAccount } from '../../stores/gameSlice'
import { fetchBalance } from '../../thunks/account'
import { fetchLatestOracle } from '../../thunks/oracle'

type TabTypes = "Play" | "History"

const GamePage: React.FunctionComponent<{chain: Chain}> = ({chain}) => {

  const [active, setActive] = React.useState<TabTypes>("Play")
  const {showRows} = React.useContext(UserConfigContext)
  const {slow, fast} = React.useContext(RefreshContext)

  const { library, account: web3Account } = useWeb3React()

  const game = useAppSelector(s => s.game.game)
  const account = useAppSelector(s => s.game.account)
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    dispatch<any>(setAccount({ account: web3Account || undefined, library }))
  }, [web3Account, dispatch, library])

  React.useEffect(() => {
    dispatch<any>(fetchArchivedRounds({ latest: true }))
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

  const tabs: TabTypes[] = ["Play", "History"]

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
      {active === "History" && <HistoryPage />}
    </div>
  )
}

export default GamePage
