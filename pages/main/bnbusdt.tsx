import React from 'react'
import GamePage from '../../src/pages/game'
import AppWrapper from '../../src/wrapper'


const BnbUsdt: React.FunctionComponent = () => {

  return (
    <AppWrapper title="BSC Predictions" description="Binance Smart Chain (BSC) Prediction Markets">
      <GamePage chain="main"/>
    </AppWrapper>
  )
}

export default BnbUsdt
