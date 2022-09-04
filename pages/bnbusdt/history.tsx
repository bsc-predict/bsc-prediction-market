import React from 'react'
import GameWrapper from 'src/wrapper/GameWrapper'
import GamePage from '../../src/pages/game'
import AppWrapper from '../../src/wrapper/AppWrapper'


const BnbUsdt: React.FunctionComponent = () => {

  return (
    <AppWrapper title="BSC Predict - BNB-USDT" description="Binance Smart Chain (BSC) Prediction Markets">
      <GameWrapper>
        <GamePage section="History" />
      </GameWrapper>
    </AppWrapper>
  )
}

export default BnbUsdt
