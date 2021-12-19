import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import accountSlice from './accountSlice'
import gameSlice from './gameSlice'
import lotterySlice from './lotterySlice'

const reducer = combineReducers({ game: gameSlice, lottery: lotterySlice, account: accountSlice })

export const store = createStore(reducer, applyMiddleware(thunk))

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
