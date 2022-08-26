import React from 'react'
import { useAppDispatch, useAppSelector } from '../../src/hooks/reduxHooks'
import GamePage from '../../src/pages/game'
import { setupGame } from '../../src/thunks/game'
import AppWrapper from '../../src/wrapper'


const BnbUsdt: React.FunctionComponent = () => {

  const dispatch = useAppDispatch()

  React.useEffect(() => {
      dispatch<any>(setupGame({ chain: "main", service: "prdt", pair: "bnbusdt" }))
  }, [dispatch])

  return (
    <AppWrapper title="BSC Predict - BNB-USDT" description="Binance Smart Chain (BSC) Prediction Markets">
      <GamePage />
    </AppWrapper>
  )
}

export default BnbUsdt
