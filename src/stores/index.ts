import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import gameSlice from './gameSlice'

const reducer = combineReducers({ game: gameSlice })

export const store = createStore(reducer, applyMiddleware(thunk))

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
