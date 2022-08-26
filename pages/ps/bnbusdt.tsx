import React from 'react'
import { useAppDispatch, useAppSelector } from '../../src/hooks/reduxHooks'
import GamePage from '../../src/pages/game'
import { setupGame } from '../../src/thunks/game'
import AppWrapper from '../../src/wrapper'


const BnbUsdt: React.FunctionComponent = () => {

  const game = useAppSelector(g => g.game.game)
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const s = urlSearchParams.get('c')
    if (typeof s === "string" && s.toLowerCase() === "test") {
      dispatch<any>(setupGame({ chain: "test", service: "ps", pair: "bnbusdt" }))
    } else {
      dispatch<any>(setupGame({ chain: "main", service: "ps", pair: "bnbusdt" }))
    }
  }, [dispatch])

  return (
    <AppWrapper title="BSC Predict - BNB-USDT" description="Binance Smart Chain (BSC) Prediction Markets">
      <GamePage />
    </AppWrapper>
  )
}

export default BnbUsdt
