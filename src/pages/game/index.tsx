import React from 'react'
import { MakBetBull, MakeBetBear } from '../../components/modal/MakeBet'
import { AccountContextProvider } from '../../contexts/AccountContext'
import { ContractContextProvider, Chain } from '../../contexts/ContractContext'
import { OracleContextProvider } from '../../contexts/OracleContext'
import HistoryPage from '../history'
import RoundsPage from './rounds'
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks'
import { fetchArchivedRounds, fetchLatestRounds } from '../../thunks/round'
import { UserConfigContext } from '../../contexts/UserConfigContext'
import { RefreshContext } from '../../contexts/RefreshContext'
import { useWeb3React } from '@web3-react/core'
import { setAccount } from '../../stores/gameSlice'

type TabTypes = "Play" | "History"

const GamePage: React.FunctionComponent<{chain: Chain}> = ({chain}) => {

  const [active, setActive] = React.useState<TabTypes>("Play")
  const {showRows} = React.useContext(UserConfigContext)
  const {fast} = React.useContext(RefreshContext)

  const { library, account } = useWeb3React()

  const game = useAppSelector(s => s.game.game)
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    dispatch<any>(setAccount({ account: account || undefined, library }))
  }, [account, dispatch, library])

  React.useEffect(() => {
    dispatch<any>(fetchArchivedRounds({ latest: true }))
  }, [dispatch, game])
  
  React.useEffect(() => {
    if (active === "Play") {
      dispatch<any>(fetchLatestRounds(showRows))
    }
  }, [dispatch, showRows, fast, active, game])

  const tabs: TabTypes[] = ["Play", "History"]

  return (
    <ContractContextProvider chain={chain}>
      <AccountContextProvider>
        <OracleContextProvider>
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
        </OracleContextProvider>
      </AccountContextProvider>
    </ContractContextProvider>
  )
}

export default GamePage
