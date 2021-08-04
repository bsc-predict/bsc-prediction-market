import React from "react"
import { useRequiresPolling } from "../hooks/useRequiresPolling"
import { createArray } from "../utils/utils"
import { BlockchainContext } from "./BlockchainContext"
import { NotificationsContext } from "./NotificationsContext"
import { RefreshContext } from "./RefreshContext"
import { UserConfigContext } from "./UserConfigContext"

interface IRoundsContext {
  rounds: {cur: Round[], latest: Round[]}
  paused: boolean
  loadRounds: (page: number) => void
}
const RoundsContext = React.createContext<IRoundsContext>({
  rounds: {cur: [], latest: []},
  paused: false,
  loadRounds: () => {/**/},
})


const RoundsContextProvider: React.FunctionComponent = ({ children }) => {
  const [rounds, setRounds] = React.useState<{cur: Round[], latest: Round[]}>({cur: [], latest: []})
  const [paused, setPaused] = React.useState(false)

  const { fetchLatestRounds, fetchRounds, fetchCurrentEpoch, fetchGamePaused } = React.useContext(BlockchainContext)

  const requiresPolling = useRequiresPolling()

  const archivedRounds = React.useRef<Round[]>([])
  const toPoll = React.useRef(new Set<string>())
  const init = React.useRef(false)

  const {showRows} = React.useContext(UserConfigContext)
  const {setMessage} = React.useContext(NotificationsContext)
  const {fast} = React.useContext(RefreshContext)

  const updateRounds = React.useCallback((update: Round[]) => {
    const newEpochs = new Set(update.map(u => u.epochNum))
    const updated = archivedRounds.current
      .filter(r => !newEpochs.has(r.epochNum))
      .concat(update)
      .sort((a, b) => a.epochNum > b.epochNum ? -1 : 1)
    archivedRounds.current = updated
    setRounds(p => {
      const priorEpochs = new Set(p.cur.map(e => e.epochNum))
      const cur = archivedRounds.current.filter(c => priorEpochs.has(c.epochNum))
      const latest = archivedRounds.current.slice(0, showRows)
      return {cur, latest}
    })
  }, [showRows])

  const updatePaused = React.useCallback((update: Round[]) => {
    if (update.every(u => u.closePrice === "0")) {
      fetchGamePaused().then(p => setPaused(p))
    } else {
      setPaused(false)
    }
  }, [])

  const updatePoll = React.useCallback(async () => {
    const p = new Set(archivedRounds.current
      .filter(r => r.closePriceNum === 0 || r.lockBlockNum === 0)
      .sort((a, b) => a.epochNum < b.epochNum ? 1 : -1)
      .slice(0, 2) // poll no more than 2 (live and upcoming)
      .map(r => r.epoch))
    if (!archivedRounds.current.some(r => r.lockPriceNum === 0)) {
      fetchLatestRounds(showRows, archivedRounds.current.filter(r => r.oracleCalled).map(r => r.epoch)).then(updateRounds)
    }
    toPoll.current = p
  }, [updateRounds])

  const loadRounds = React.useCallback(async (page: number) => {
    if (page === 0) {
      const available = archivedRounds.current.filter(r => r.oracleCalled).map(r => r.epoch)
      fetchLatestRounds(showRows, available)
        .then(updateRounds)
        .catch(() => setMessage({type: "error", title: "Error", message: "Failed to update rounds", duration: 5000}))
        .finally(() => init.current = true)
    } else {
      const to = await fetchCurrentEpoch()
      const available = new Set(archivedRounds.current.map(r => r.epochNum))
      const start = Math.max(0, Number(to) - ((page + 1) * showRows - 1))
      const end = start + showRows
      const toReturn = createArray(start, end)
      const toFetch = toReturn.filter(e => !available.has(e))
      if (fetchRounds.length > 0) {
        await fetchRounds(toFetch)
          .then(updateRounds)
          .catch(() => setMessage({type: "error", message: 'failed to retrieve fetch rounds', title: "Error", duration: 5000}))
        }
      const cur = archivedRounds.current.filter(r => new Set(toReturn).has(r.epochNum))
      setRounds(prior => ({...prior, cur}))
    }
  }, [updateRounds, showRows])

  React.useEffect(() => {
    if (init.current && requiresPolling) {
      updatePoll()
      const updated = fetchRounds(Array.from(toPoll.current))
      updated
        .then(r => {
          updateRounds(r)
          updatePaused(r)
        })
        .catch((e: Error | undefined) => setMessage({type: "error", message: e?.message, title: "Error", duration: 5000}))
    }
  }, [fast, updateRounds, updatePoll, requiresPolling])
  
  return <RoundsContext.Provider value={{
    paused,
    rounds,
    loadRounds,
  }}>{children}</RoundsContext.Provider>
}
  
export { RoundsContext, RoundsContextProvider }
