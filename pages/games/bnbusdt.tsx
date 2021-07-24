import React from 'react'
import RoundsPage from '../../src/pages/bnbusdt'
import AppWrapper from '../../src/wrapper'

const BnbUsdt: React.FunctionComponent = () => {
  return (
    <AppWrapper title="BSC Predictions" description="Binance Smart Chain (BSC) Prediction Markets">
      <RoundsPage />
    </AppWrapper>
  )
}

export default BnbUsdt
