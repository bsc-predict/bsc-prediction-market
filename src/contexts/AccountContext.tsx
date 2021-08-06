import { useWeb3React } from "@web3-react/core"
import React from "react"
import { useRequiresPolling } from "../hooks/useRequiresPolling"
import { ContractContext } from "./ContractContext"
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
  const {fetchBalance} = React.useContext(ContractContext)
  const first = React.useRef(true)

  React.useEffect(() => {
    if (!account) {
      setBalance(undefined)
    } else if (requiresPolling || first.current) {
      fetchBalance(account).then(setBalance)
      first.current = false
    }
  }, [slow, account, requiresPolling, fetchBalance])

  
  return <AccountContext.Provider value={{ account: typeof account === "string" ? account : undefined, balance }}>{children}</AccountContext.Provider>
}
  
export { AccountContext, AccountContextProvider }
