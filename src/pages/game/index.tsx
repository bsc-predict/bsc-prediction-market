import React from 'react'
import { MakBetBull, MakeBetBear } from '../../components/modal/MakeBet'
import { AccountContextProvider } from '../../contexts/AccountContext'
import { BetsContextProvider } from '../../contexts/BetsContext'
import { BlockchainContext, BlockchainContextProvider, Chain } from '../../contexts/BlockchainContext'
import { BlockContextProvider } from '../../contexts/BlockContext'
import { OracleContextProvider } from '../../contexts/OracleContext'
import { RoundsContextProvider } from '../../contexts/RoundsContext'
import HistoryPage from '../history'
import RoundsPage from './rounds'

type TabTypes = "Play" | "History"

const GamePage: React.FunctionComponent<{chain: Chain}> = ({chain}) => {

  const [active, setActive] = React.useState<TabTypes>("Play")


  const tabs: TabTypes[] = ["Play", "History"]

  return (
    <BlockchainContextProvider chain={chain}>
      <AccountContextProvider>
        <BlockContextProvider>
          <RoundsContextProvider>
            <OracleContextProvider>
              <BetsContextProvider>
                <div className="space-y-4">
                  <div className="tabs">
                    {tabs.map(tab =>
                      <a
                        key={tab}
                        onClick={() => setActive(tab)}
                        className={active === tab ? "tab tab-lg tab-active tab-bordered" : "tab tab-lg tab-bordered"}
                      >
                        {tab}
                      </a>
                    )}
                  </div>
                  <div className={active !== "Play" ? "hidden" : undefined}>
                    <RoundsPage />
                    {MakBetBull}
                    {MakeBetBear}
                  </div>
                  <div className={active !== "History" ? "hidden" : undefined}>
                    <HistoryPage />
                  </div>
                </div>
              </BetsContextProvider>
            </OracleContextProvider>
          </RoundsContextProvider>
        </BlockContextProvider>
      </AccountContextProvider>
    </BlockchainContextProvider>
  )
}

export default GamePage
