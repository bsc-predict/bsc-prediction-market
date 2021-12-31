import mixpanel from 'mixpanel-browser'
import React from 'react'
import LotteryPage from 'src/pages/lottery'
import AppWrapper from '../../src/wrapper'


const Lottery: React.FunctionComponent = () => {
  return (
    <AppWrapper title="BSC Predict - CAKE Lottery" description="Binance Smart Chain (BSC) Prediction Markets">
      <LotteryPage />
    </AppWrapper>
  )
}

export default Lottery

