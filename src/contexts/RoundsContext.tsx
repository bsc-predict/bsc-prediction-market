import React from "react"
import { fetchLatestRounds, fetchRounds, getCurrentEpoch } from "../contracts/prediction"
import { useRequiresPolling } from "../hooks/useRequiresPolling"
import { createArray } from "../utils/utils"
import { NotificationsContext } from "./NotificationsContext"
import { RefreshContext } from "./RefreshContext"
import { UserConfigContext } from "./UserConfigContext"

interface IRoundsContext {
  latestRounds: Round[]
  curRounds: Round[]
  loadRounds: (page: number) => void
}
const RoundsContext = React.createContext<IRoundsContext>({
  latestRounds: [],
  curRounds: [],
  loadRounds: () => {/**/},
})


const RoundsContextProvider: React.FunctionComponent = ({ children }) => {
  const [latestRounds, setLatestRounds] = React.useState<Round[]>([])
  const [curRounds, setCurRounds] = React.useState<Round[]>([])

  const requiresPolling = useRequiresPolling()

  const rounds = React.useRef<Round[]>([])
  const toPoll = React.useRef(new Set<string>())
  const init = React.useRef(false)

  const {showRows} = React.useContext(UserConfigContext)
  const {setMessage} = React.useContext(NotificationsContext)
  const {fast} = React.useContext(RefreshContext)

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
    setLatestRounds(rounds.current.slice(0, showRows))
  }, [showRows])

  const updatePoll = React.useCallback(async () => {
    const p = new Set(rounds.current.filter(r => r.closePriceNum === 0 || r.lockBlockNum === 0).map(r => r.epoch))
    if (!rounds.current.some(r => r.lockPriceNum === 0)) {
      fetchLatestRounds(showRows, rounds.current.filter(r => r.oracleCalled).map(r => r.epoch)).then(updateRounds)
    }
    toPoll.current = p
  }, [updateRounds])

  const loadRounds = React.useCallback(async (page: number) => {
    if (page === 0) {
      const available = rounds.current.filter(r => r.oracleCalled).map(r => r.epoch)
      fetchLatestRounds(showRows, available)
        .then(updateRounds)
        .catch(() => setMessage({type: "error", title: "Rrror", message: "Failed to update rounds", duration: 5000}))
        .finally(() => init.current = true)
    } else {
      const to = await getCurrentEpoch()
      const available = new Set(rounds.current.map(r => r.epochNum))
      const start = Math.max(0, Number(to) - ((page + 1) * showRows - 1))
      const end = start + showRows
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
  }, [updateRounds, showRows])

  React.useEffect(() => {
    if (init.current && requiresPolling) {
      updatePoll()
      const updated = fetchRounds(Array.from(toPoll.current))
      updated
        .then(updateRounds)
        .catch(() => setMessage({type: "error", message: 'Failed to fetch rounds', title: "Error", duration: 5000}))
    }
  }, [fast, updateRounds, updatePoll, requiresPolling])
  
  return <RoundsContext.Provider value={{
    curRounds,
    latestRounds,
    loadRounds,
  }}>{children}</RoundsContext.Provider>
}
  
export { RoundsContext, RoundsContextProvider }
