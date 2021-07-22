import React from "react"
import { getLatestOracleRound } from "../contracts/oracle"
import { useRequiresPolling } from "../hooks/useRequiresPolling"
import { NotificationsContext } from "./NotificationsContext"
import { RefreshContext } from "./RefreshContext"

const OracleContext = React.createContext<{latestOracle: Oracle | undefined}>({ latestOracle: undefined})

const OracleContextProvider: React.FunctionComponent = ({ children }) => {
  const [latestOracle, setLatestOracle] = React.useState<Oracle | undefined>(undefined)

  const requiresPolling = useRequiresPolling()
  const {slow} = React.useContext(RefreshContext)
  const {setMessage} = React.useContext(NotificationsContext)
  
  React.useEffect(() => {
    if (requiresPolling) {
      getLatestOracleRound()
        .then(setLatestOracle)
        .catch(() => setMessage({type: "error", message: 'Failed to fetch oracle', title: "Error", duration: 5000}))
      }
    }, [slow, requiresPolling])

  
  return <OracleContext.Provider value={{ latestOracle }}>{children}</OracleContext.Provider>
}
  
export { OracleContext, OracleContextProvider }
