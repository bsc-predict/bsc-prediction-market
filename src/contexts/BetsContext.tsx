import React from "react"
import { usePrevious } from "../hooks/usePrevious"
import { enrichBets } from "../utils/bets"
import { ContractContext } from "./ContractContext"
import { NotificationsContext } from "./NotificationsContext"
import { RoundsContext } from "./RoundsContext"

interface IBetsContext {
  setAccount: (a: string | undefined) => void
  bets: Bet[]
  updateBetStatus: (epoch: string, status: BetStatus) => void
  fetchBets: () => void
}

const BetsContext = React.createContext<IBetsContext>({
  bets: [],
  updateBetStatus: () => {/**/},
  setAccount: () => {/**/},
  fetchBets: () => {/**/},
})

const BetsContextProvider: React.FunctionComponent = ({ children }) => {
  const [bets, setBets] = React.useState<Bet[]>([])
  const [account, setAccount] = React.useState<string | undefined>(undefined)
  
  const {setMessage} = React.useContext(NotificationsContext)
  const {rounds} = React.useContext(RoundsContext)
  const {fetchBets} = React.useContext(ContractContext)

  const archivedRounds = React.useRef<Round[]>([])

  const prevAccount = usePrevious(account)

  React.useEffect(() => {
    if (prevAccount !== account) {
      fetch()
    }
  }, [account, prevAccount])
  
  const handleSetAccount = React.useCallback((a: string | undefined) => {
    setAccount(a)
  }, [])

  const updateBetStatus = React.useCallback((epoch: string, status: BetStatus) => setBets(prior => prior.map(b => b.epoch === epoch ? {...b, status} : b)), [])

  const fetch = React.useCallback(() => {
    if(account) {
      fetchBets(account)
        .then(({bets, claimed}) => setBets(prior => {
          // bet might be pending, don't override with new bets!
          const pending = prior.filter(b => b.status === "pending")
          const exclude = new Set(pending.map(p => p.timeStamp))
          const updated = enrichBets(bets, archivedRounds.current, claimed).filter(b => !exclude.has(b.timeStamp))
          return pending.concat(updated).sort((a, b) => a.timeStamp > b.timeStamp ? -1 : 1)
        }))
        .catch(() => setMessage({type: "error", message: 'Failed to retrieve bets', title: "Error", duration: 5000}))
    } else {
      setBets([])
    }
  }, [account])

  React.useEffect(() => {
    setBets(prior => enrichBets(prior, rounds.latest.concat(rounds.cur)))
  }, [rounds])

  React.useEffect(() => {
    archivedRounds.current = rounds.latest.concat(rounds.cur)
  }, [rounds])
  
  return <BetsContext.Provider value={{ bets, updateBetStatus, setAccount: handleSetAccount, fetchBets: fetch }}>{children}</BetsContext.Provider>
}
  
export { BetsContext, BetsContextProvider }
