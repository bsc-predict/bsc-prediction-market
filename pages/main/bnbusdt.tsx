import React from 'react'
import {MakeBetBear, MakBetBull} from '../../src/components/modal/MakeBet'
import RoundsPage from '../../src/pages/bnbusdt'
import AppWrapper from '../../src/wrapper'

const BnbUsdt: React.FunctionComponent = () => {

  return (
    <AppWrapper title="BSC Predictions" description="Binance Smart Chain (BSC) Prediction Markets">
      <RoundsPage />
      {MakBetBull}
      {MakeBetBear}
    </AppWrapper>
  )
}

export default BnbUsdt
