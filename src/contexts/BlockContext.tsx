import React from "react"
import web3 from "../utils/web3"
import { NotificationsContext } from "./NotificationsContext"
import { RefreshContext } from "./RefreshContext"

const BlockContext = React.createContext({ block: -1 })

const BlockContextProvider: React.FunctionComponent = ({ children }) => {
  const [block, setBlock] = React.useState(-1)

  const {setMessage} = React.useContext(NotificationsContext)
  const {fast2} = React.useContext(RefreshContext)
  
  React.useEffect(() => {
    web3.eth.getBlockNumber()
      .then(setBlock)
      .catch(() => setMessage({type: "error", message: 'Failed to retrieve blocks', title: "Error", duration: 5000}))

  }, [fast2])

  
  return <BlockContext.Provider value={{ block }}>{children}</BlockContext.Provider>
}
  
export { BlockContext, BlockContextProvider }
