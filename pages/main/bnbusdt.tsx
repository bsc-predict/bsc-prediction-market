import React from 'react'
import {MakeBetBear, MakBetBull} from '../../src/components/modal/MakeBet'
import { BlockchainContext } from '../../src/contexts/BlockchainContext'
import RoundsPage from '../../src/pages/bnbusdt'
import HistoryPage from '../../src/pages/history'
import AppWrapper from '../../src/wrapper'

type TabTypes = "Play" | "History"

const BnbUsdt: React.FunctionComponent = () => {
  const {setChain} = React.useContext(BlockchainContext)

  const [active, setActive] = React.useState<TabTypes>("Play")

  const tabs: TabTypes[] = ["Play", "History"]

  React.useEffect(() => {
    setChain("main")
  }, [setChain])

  return (
    <AppWrapper title="BSC Predictions" description="Binance Smart Chain (BSC) Prediction Markets">
      <div className="divide-y-4 divide-dashed">
        <div className="tabs tabs-boxed">
          {tabs.map(tab =>
            <a
              key={tab}
              onClick={() => setActive(tab)}
              className={active === tab ? "tab tab-lg tab-active" : "tab tab-lg"}
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
    </AppWrapper>
  )
}

export default BnbUsdt
