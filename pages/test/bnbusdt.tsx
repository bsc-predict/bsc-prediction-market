import React from 'react'
import { BlockchainContext } from '../../src/contexts/BlockchainContext'
import GamePage from '../../src/pages/game'
import AppWrapper from '../../src/wrapper'

const BnbUsdt: React.FunctionComponent = () => {
  return (
    <AppWrapper title="BSC Predictions" description="Binance Smart Chain (BSC) Prediction Markets">
      <GamePage chain="test"/>
    </AppWrapper>
  )
}

export default BnbUsdt
