import React from 'react'
import RoundsPage from '../src/pages/main'
import AppWrapper from '../src/wrapper'

const Home: React.FunctionComponent = () => {


  return (
    <AppWrapper title="BSC Predictions" description="Binance Smart Chain (BSC) Prediction Markets">
      <RoundsPage />
    </AppWrapper>
  )
}

export default Home
