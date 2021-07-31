import React from 'react'
import HistoryPage from '../../../src/pages/history'
import AppWrapper from '../../../src/wrapper'

const History: React.FunctionComponent = () => {


  return (
    <AppWrapper title="BSC Predictions History" description="Binance Smart Chain (BSC) Prediction Markets History">
      <HistoryPage />
    </AppWrapper>
  )
}

export default History
