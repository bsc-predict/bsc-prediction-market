import { useWeb3React } from "@web3-react/core"
import React from "react"
import { useRequiresPolling } from "../hooks/useRequiresPolling"
import { getBalance } from "../utils/accounts"
import { BlockchainContext } from "./BlockchainContext"
import { RefreshContext } from "./RefreshContext"

const AccountContext = React.createContext<{account?: string, balance?: BalanceInfo}>({})

interface BalanceInfo {
  balance: string
  balanceUsd: number
  bnbPrice: number
}

const AccountContextProvider: React.FunctionComponent = ({ children }) => {
  const [balance, setBalance] = React.useState<BalanceInfo | undefined>(undefined)

  const requiresPolling = useRequiresPolling()
  const {account} = useWeb3React()
  const {slow} = React.useContext(RefreshContext)
  const {web3Provider} = React.useContext(BlockchainContext)
  const first = React.useRef(true)

  React.useEffect(() => {
    if (!account) {
      setBalance(undefined)
    } else if (requiresPolling || first.current) {
      const web3 = web3Provider()
      getBalance(web3, account).then(setBalance)
      first.current = false
    }
  }, [slow, account, requiresPolling])

  
  return <AccountContext.Provider value={{ account: typeof account === "string" ? account : undefined, balance }}>{children}</AccountContext.Provider>
}
  
export { AccountContext, AccountContextProvider }
