import { useWeb3React } from "@web3-react/core"
import React from "react"
import { fetchBets } from "../api"
import { NotificationsContext } from "./NotificationsContext"
import { RefreshContext } from "./RefreshContext"
import { RoundsContext } from "./RoundsContext"

interface IBetsContext {
  bets: Bet[]
  updateBetStatus: (epoch: string, status: BetStatus) => void
}

const BetsContext = React.createContext<IBetsContext>({ bets: [], updateBetStatus: () => {/**/} })

const BetsContextProvider: React.FunctionComponent = ({ children }) => {
  const [bets, setBets] = React.useState<Bet[]>([])

  const {account} = useWeb3React()

  const {setMessage} = React.useContext(NotificationsContext)
  const {curRounds, latestRounds} = React.useContext(RoundsContext)
  const rounds = React.useRef<Round[]>([])
  
  const {slow} = React.useContext(RefreshContext)

  const enrichBets = React.useCallback((bets: Bet[], rounds: Round[], claimed?: Set<number>) => {
    const enriched = bets.map(bet => {
      const r = rounds.find(r_1 => bet.blockNumberNum > r_1.startBlockNum && bet.blockNumberNum < r_1.lockBlockNum)
      let won = false
      if (r) {
        if (
          (r.closePriceNum < r.lockPriceNum && bet.direction === "bear") ||
          (r.closePriceNum > r.lockPriceNum && bet.direction === "bull")
        ) {
          won = true
        }
      }
      let status: BetStatus | undefined
      if (r !== undefined && claimed?.has(r.epochNum)) {
        status = "claimed"
      } else if (won && claimed !== undefined) {
        status = "claimable"
      } else {
        status = bet?.status
      }

      return {
        ...bet,
        won,
        epoch: r?.epoch,
        status,
      }
    })
    return enriched
  }, [])

  const updateBetStatus = React.useCallback((epoch: string, status: BetStatus) => setBets(prior => prior.map(b => b.epoch === epoch ? {...b, status} : b)), [])

  const fetch = React.useCallback(() => {
    if(account) {
      fetchBets(account)
        .then(({bets, claimed}) => setBets(enrichBets(bets, rounds.current, claimed)))
        .catch(() => setMessage({type: "error", message: 'Failed to retrieve bets', title: "Error", duration: 5000}))
    } else {
      setBets([])
    }
  }, [account, enrichBets])

  React.useEffect(() => {
    setBets(prior => enrichBets(prior, latestRounds.concat(curRounds)))
  }, [latestRounds, curRounds, enrichBets])

  React.useEffect(() => {
    rounds.current = latestRounds.concat(curRounds)
  }, [curRounds, latestRounds])

  React.useEffect(() => {
    fetch()
  }, [fetch, slow])
  
  return <BetsContext.Provider value={{ bets, updateBetStatus }}>{children}</BetsContext.Provider>
}
  
export { BetsContext, BetsContextProvider }
