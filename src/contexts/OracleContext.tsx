import React from "react"
import { getLatestOracleRound } from "../contracts/oracle"
import web3 from "../utils/web3"
import { NotificationsContext } from "./NotificationsContext"
import { RefreshContext } from "./RefreshContext"

const OracleContext = React.createContext<{latestOracle: Oracle | undefined}>({ latestOracle: undefined})

const OracleContextProvider: React.FunctionComponent = ({ children }) => {
  const [latestOracle, setLatestOracle] = React.useState<Oracle | undefined>(undefined)

  const {slow} = React.useContext(RefreshContext)
  const {setMessage} = React.useContext(NotificationsContext)
  
  React.useEffect(() => {
    getLatestOracleRound()
      .then(setLatestOracle)
      .catch(() => setMessage({type: "error", message: 'Failed to fetch oracle', title: "Error", duration: 5000}))
    }, [slow])

  
  return <OracleContext.Provider value={{ latestOracle }}>{children}</OracleContext.Provider>
}
  
export { OracleContext, OracleContextProvider }
