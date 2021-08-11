import React from "react"
import { useRequiresPolling } from "../hooks/useRequiresPolling"
import { ContractContext } from "./ContractContext"
import { NotificationsContext } from "./NotificationsContext"
import { RefreshContext } from "./RefreshContext"

interface IBlockContext {
  block: number
  blockRef: {current: number}
}

const BlockContext = React.createContext<IBlockContext>({ block: -1, blockRef: {current: -1}})

const BlockContextProvider: React.FunctionComponent = ({ children }) => {
  const [block, setBlock] = React.useState(-1)
  const blockRef = React.useRef(-1)

  blockRef.current

  const requiresPolling = useRequiresPolling()
  const {setMessage} = React.useContext(NotificationsContext)
  const {fetchBlockNumber} = React.useContext(ContractContext)
  const {fast2} = React.useContext(RefreshContext)
  
  React.useEffect(() => {
    if (requiresPolling) {
      fetchBlockNumber()
      .then(b => {
        setBlock(b)
        blockRef.current = b
      })
      .catch(() => setMessage({type: "error", message: 'Failed to retrieve blocks', title: "Error", duration: 5000}))
    }
  }, [fast2, requiresPolling])

  
  return <BlockContext.Provider value={{ block, blockRef }}>{children}</BlockContext.Provider>
}
  
export { BlockContext, BlockContextProvider }
