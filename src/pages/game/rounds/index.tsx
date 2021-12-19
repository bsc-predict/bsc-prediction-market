import dynamic from "next/dynamic"
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
import { usePrevious } from "../../../hooks/usePrevious";
import { gameSteps } from "./reactour/steps";

const AppTour = dynamic(
  () => import("reactour"),
  { ssr: false },
)

const RoundsPage: React.FunctionComponent = () => {
  const [page, setPage] = React.useState(0)
  const [showReactour, setShowReactour] = React.useState(false)
  const [displayRounds, setDisplayRounds] = React.useState<Round[]>([])

  const { account } = useWeb3React()
  const rounds = useAppSelector(s => s.game.rounds)
  const paused = useAppSelector(s => s.game.paused)

  const latestEpoch = useAppSelector(s => s.game.rounds.reduce((prior, r) => r.epochNum > prior ? r.epochNum : prior, -1))
  const previousLatestEpoch = usePrevious(latestEpoch)
  const previousAccount = usePrevious(account)
  const library = useAppSelector(s => s.account.library)

  const bets = useAppSelector(s => s.game.bets)


  const dispatch = useAppDispatch()
  const { showRows } = React.useContext(UserConfigContext)

  const handleShowReactour = React.useCallback((s: boolean) => setShowReactour(s), [])

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
    if (!account || previousLatestEpoch === undefined || latestEpoch === undefined) {
      return
    }
    if ((latestEpoch !== previousLatestEpoch) || (account !== previousAccount)) {
      dispatch<any>(fetchBets({account}))
    }
  }, [account, dispatch, latestEpoch, previousAccount, previousLatestEpoch])

  const handleSetPage = React.useCallback((p: number) => {
    const startEpoch = latestEpoch - ((p + 1) * showRows)
    const endEpoch = startEpoch + showRows
    const epochs = createArray(startEpoch, endEpoch)
    dispatch<any>(fetchRounds({ epochs }))
    setPage(p)
  }, [latestEpoch, dispatch, showRows])

  return (
    <React.Fragment>
      <AppTour
        steps={gameSteps}
        isOpen={showReactour}
        onRequestClose={() => setShowReactour(false)}
        lastStepNextButton={<button className="btn btn-success text-white text-sm">Start</button>}
      />
      {paused &&
        <div className="mb-6">
          <Notification
            type="info"
            title="Markets Paused"
            message="Markets have been paused. All open bets prior to pause are reclaimable"
            absolute={false}
          />
        </div>}
      <Info showReactour={handleShowReactour} />
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
