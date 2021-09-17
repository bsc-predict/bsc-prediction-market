import { useWeb3React } from "@web3-react/core";
import React from "react"
import { UserConfigContext } from "../../../contexts/UserConfigContext"
import RoundsTable from "./table";
import Notification from "../../../components/notifications"
import Info from "../info";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { fetchRounds } from "../../../thunks/round"
import { fetchBets } from "../../../thunks/bet"
import { createArray } from "../../../utils/utils"

const RoundsPage: React.FunctionComponent = () => {
  const [page, setPage] = React.useState(0)
  const [displayRounds, setDisplayRounds] = React.useState<Round[]>([])

  const {account} = useWeb3React()
  const game = useAppSelector(s => s.game.game)
  const rounds = useAppSelector(s => s.game.rounds)
  const paused = useAppSelector(s => s.game.paused)
  
  const latestEpoch = useAppSelector(s => s.game.rounds.reduce((prior, r) => r.epochNum > prior ? r.epochNum : prior, -1))
  const bets = useAppSelector(s => s.game.bets)

  const dispatch = useAppDispatch()
  const {showRows} = React.useContext(UserConfigContext)

  React.useEffect(() => {
    if (rounds.length === 0) {
      setDisplayRounds([])
    } else {
      const startEpoch = latestEpoch - ((page + 1) * showRows) + 1
      const endEpoch = startEpoch + showRows
      const r = rounds.filter(r => (r.epochNum >= startEpoch) && (r.epochNum <= endEpoch))
      setDisplayRounds(r)
    }
  }, [page, showRows, rounds, latestEpoch])

  React.useEffect(() => {
    if (account && game) {
      dispatch<any>(fetchBets(account))
    }
  }, [account, dispatch, game])

	const handleSetPage = React.useCallback((p: number) => {
    const startEpoch = latestEpoch - ((p + 1) * showRows)
    const endEpoch = startEpoch + showRows
    const epochs = createArray(startEpoch, endEpoch)
    dispatch<any>(fetchRounds({epochs}))
    setPage(p)
  }, [latestEpoch, dispatch, showRows])

  return(
    <React.Fragment>
      {paused &&
      <div className="mb-6">
        <Notification
          type="info"
          title="Markets Paused"
          message="Markets have been paused. All open bets prior to pause are reclaimable"
          absolute={false}
        />
      </div>}
      <Info/>
      <RoundsTable
        numPages={displayRounds.length > 0 ? Math.floor((displayRounds[0].epochNum - 2) / showRows) : 0}
        rounds={displayRounds}
        setPage={handleSetPage}
        page={page}
        bets={bets}
      />
    </React.Fragment>
  )
}

export default RoundsPage
