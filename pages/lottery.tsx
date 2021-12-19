import React from 'react'
import LotteryPage from 'src/pages/lottery'
import AppWrapper from '../src/wrapper'


const Lottery: React.FunctionComponent = () => {



  return (
    <AppWrapper title="BSC Predictions" description="Binance Smart Chain (BSC) Prediction Markets">
      <LotteryPage />
    </AppWrapper>
  )
}

export default Lottery

