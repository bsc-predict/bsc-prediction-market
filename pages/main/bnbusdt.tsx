import React from 'react'
import { BlockchainContext } from '../../src/contexts/BlockchainContext'
import GamePage from '../../src/pages/game'
import AppWrapper from '../../src/wrapper'


const BnbUsdt: React.FunctionComponent = () => {
  const {setChain} = React.useContext(BlockchainContext)

  React.useEffect(() => {
    setChain("main")
  }, [setChain])

  return (
    <AppWrapper title="BSC Predictions" description="Binance Smart Chain (BSC) Prediction Markets">
      <GamePage />
    </AppWrapper>
  )
}

export default BnbUsdt
