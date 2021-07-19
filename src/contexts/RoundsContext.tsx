import React from "react"
import { fetchArchivedRounds } from "../api"
import { fetchLatestRounds, fetchRounds, getCurrentEpoch } from "../contracts/prediction"
import { createArray } from "../utils/utils"
import { NotificationsContext } from "./NotificationsContext"
import { RefreshContext } from "./RefreshContext"

interface IRoundsContext {
  latestRounds: Round[]
  curRounds: Round[]
  loadRounds: (page: number) => void
}
const RoundsContext = React.createContext<IRoundsContext>({
  latestRounds: [],
  curRounds: [],
  loadRounds: () => {/**/}
})

const SHOW_ROUNDS = 10

const RoundsContextProvider: React.FunctionComponent = ({ children }) => {
  const [latestRounds, setLatestRounds] = React.useState<Round[]>([])
  const [curRounds, setCurRounds] = React.useState<Round[]>([])
  const [archiveFetched, setArchiveFetched] = React.useState(false)
  
  const rounds = React.useRef<Round[]>([])
  const toPoll = React.useRef(new Set<string>())

  const {setMessage} = React.useContext(NotificationsContext)
  const {fast} = React.useContext(RefreshContext)

  React.useEffect(() => {
    fetchArchivedRounds(true)
      .then(r => rounds.current = r)
      .catch(() => setMessage({type: "error", title: "Error", message: "Failed fetching rounds", duration: 5000}))
      .finally(() => setArchiveFetched(true))
  }, [])

  const updateRounds = React.useCallback((update: Round[]) => {
    const newEpochs = new Set(update.map(u => u.epochNum))
    const updated = rounds.current
      .filter(r => !newEpochs.has(r.epochNum))
      .concat(update)
      .sort((a, b) => a.epochNum > b.epochNum ? -1 : 1)
    rounds.current = updated
    setCurRounds(p => {
      const priorEpochs = new Set(p.map(e => e.epochNum))
      return rounds.current.filter(c => priorEpochs.has(c.epochNum))
    })
    setLatestRounds(rounds.current.slice(0, SHOW_ROUNDS))
  }, [])

  const updatePoll = React.useCallback(async () => {
    const p = new Set(rounds.current.filter(r => r.closePriceNum === 0 || r.lockBlockNum === 0).map(r => r.epoch))
    if (!rounds.current.some(r => r.lockPriceNum === 0)) {
      fetchLatestRounds(SHOW_ROUNDS, rounds.current.filter(r => r.oracleCalled).map(r => r.epoch)).then(updateRounds)
    }
    toPoll.current = p
  }, [updateRounds])

  const loadRounds = React.useCallback(async (page: number) => {
    if (page === 0) {
      await fetchLatestRounds(SHOW_ROUNDS, rounds.current.filter(r => r.oracleCalled).map(r => r.epoch)).then(updateRounds)
    } else {
      const to = await getCurrentEpoch()
      const available = new Set(rounds.current.map(r => r.epochNum))
      const start = Math.max(0, Number(to) - ((page + 1) * SHOW_ROUNDS - 1))
      const end = start + SHOW_ROUNDS
      const toReturn = createArray(start, end)
      const toFetch = toReturn.filter(e => !available.has(e))
      if (fetchRounds.length > 0) {
        await fetchRounds(toFetch)
          .then(updateRounds)
          .catch(() => setMessage({type: "error", message: 'failed to retrieve fetch rounds', title: "Error", duration: 5000}))
        }
      const cur = rounds.current.filter(r => new Set(toReturn).has(r.epochNum))
      setCurRounds(cur)
    }
  }, [updateRounds])

  React.useEffect(() => {
    updatePoll()
    const updated = fetchRounds(Array.from(toPoll.current))
    updated
      .then(updateRounds)
      .catch(() => setMessage({type: "error", message: 'Failed to fetch rounds', title: "Error", duration: 5000}))
  }, [fast, updateRounds, updatePoll])
  
  return <RoundsContext.Provider value={{
    curRounds,
    latestRounds,
    loadRounds,
  }}>{children}</RoundsContext.Provider>
}
  
export { RoundsContext, RoundsContextProvider }
