import React from "react"
import { fetchBets } from "../api"
import { useRequiresPolling } from "../hooks/useRequiresPolling"
import { enrichBets } from "../utils/bets"
import { NotificationsContext } from "./NotificationsContext"
import { RefreshContext } from "./RefreshContext"
import { RoundsContext } from "./RoundsContext"

interface IBetsContext {
  setAccount: (a: string | undefined) => void
  bets: Bet[]
  updateBetStatus: (epoch: string, status: BetStatus) => void
}

const BetsContext = React.createContext<IBetsContext>({ bets: [], updateBetStatus: () => {/**/}, setAccount: () => {/**/} })

const BetsContextProvider: React.FunctionComponent = ({ children }) => {
  const [bets, setBets] = React.useState<Bet[]>([])
  const [account, setAccount] = React.useState<string | undefined>(undefined)
  
  const requiresPolling = useRequiresPolling()
  const {setMessage} = React.useContext(NotificationsContext)
  const {curRounds, latestRounds} = React.useContext(RoundsContext)
  const rounds = React.useRef<Round[]>([])
  
  const {slow} = React.useContext(RefreshContext)

  const handleSetAccount = React.useCallback((a: string | undefined) => setAccount(a), [])

  const updateBetStatus = React.useCallback((epoch: string, status: BetStatus) => setBets(prior => prior.map(b => b.epoch === epoch ? {...b, status} : b)), [])

  const fetch = React.useCallback(() => {
    if(account) {
      fetchBets(account)
        .then(({bets, claimed}) => setBets(prior => {
          // bet might be pending, don't override with new bets!
          const pending = prior.filter(b => b.status === "pending")
          const exclude = new Set(pending.map(p => p.timeStamp))
          const updated = enrichBets(bets, rounds.current, claimed).filter(b => !exclude.has(b.timeStamp))
          return pending.concat(updated).sort((a, b) => a.timeStamp > b.timeStamp ? -1 : 1)
        }))
        .catch(() => setMessage({type: "error", message: 'Failed to retrieve bets', title: "Error", duration: 5000}))
    } else {
      setBets([])
    }
  }, [account])

  React.useEffect(() => {
    setBets(prior => enrichBets(prior, latestRounds.concat(curRounds)))
  }, [latestRounds, curRounds])

  React.useEffect(() => {
    rounds.current = latestRounds.concat(curRounds)
  }, [curRounds, latestRounds])

  React.useEffect(() => {
    if (requiresPolling) {
      fetch()
    }
  }, [fetch, slow, requiresPolling])
  
  return <BetsContext.Provider value={{ bets, updateBetStatus, setAccount: handleSetAccount }}>{children}</BetsContext.Provider>
}
  
export { BetsContext, BetsContextProvider }
