import React from 'react'
import { BlockchainContext } from '../../../src/contexts/BlockchainContext'
import HistoryPage from '../../../src/pages/history'
import AppWrapper from '../../../src/wrapper'

const History: React.FunctionComponent = () => {

  const {setChain} = React.useContext(BlockchainContext)

  React.useEffect(() => {
    setChain("main")
  }, [setChain])

  return (
    <AppWrapper title="BSC Predictions History" description="Binance Smart Chain (BSC) Prediction Markets History">
      <HistoryPage />
    </AppWrapper>
  )
}

export default History
