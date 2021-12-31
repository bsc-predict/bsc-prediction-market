import React from 'react'
import { useAppDispatch, useAppSelector } from '../src/hooks/reduxHooks'
import GamePage from '../src/pages/game'
import { setGame } from '../src/stores/gameSlice'
import { setupGame } from '../src/thunks/game'
import AppWrapper from '../src/wrapper'


const BnbUsdt: React.FunctionComponent = () => {

  const game = useAppSelector(g => g.game.game)
  const dispatch = useAppDispatch()
  React.useEffect(() => {
    dispatch<any>(setGame({chain: "main", pair: "bnbusdt"}))
  }, [dispatch])

  React.useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const s = urlSearchParams.get('c')
    if (typeof s === "string" && s.toLowerCase() === "test") {
      dispatch(setGame({chain: "test", pair: "bnbusdt"}))
    } else {
      dispatch(setGame({chain: "main", pair: "bnbusdt"}))
    }
  }, [dispatch])

  React.useEffect(() => {
    if (game !== undefined) {
      dispatch<any>(setupGame())
    }
  }, [game, dispatch])

  return (
    <AppWrapper title="BSC Predict - BNB-USDT" description="Binance Smart Chain (BSC) Prediction Markets">
      <GamePage />
    </AppWrapper>
  )
}

export default BnbUsdt
