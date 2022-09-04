import React from "react"
import { useAppSelector, useAppDispatch } from "src/hooks/reduxHooks"
import { setGame } from "src/stores/gameSlice"
import { setupGame } from "src/thunks/game"

const GameWrapper: React.FunctionComponent = (props) => {
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


  if (!props.children) {
    return null
  }
  return <React.Fragment>{props.children}</React.Fragment>
}

export default GameWrapper
