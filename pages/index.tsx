import React from 'react'
import HomePage from '../src/pages/home'
import AppWrapper from '../src/wrapper'

const Home: React.FunctionComponent = () => {
  return (
    <AppWrapper title="BSC Predictions" description="Binance Smart Chain (BSC) Prediction Markets">
      <HomePage />
    </AppWrapper>
  )
}

export default Home
