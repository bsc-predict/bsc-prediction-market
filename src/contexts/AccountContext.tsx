import { useWeb3React } from "@web3-react/core"
import React from "react"
import { fetchBnbPrice } from "../api"
import { useRequiresPolling } from "../hooks/useRequiresPolling"
import { getBalance } from "../utils/accounts"
import web3 from "../utils/web3"
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
  
  React.useEffect(() => {
    if (account && requiresPolling) {
      getBalance(account).then(setBalance)
    } else {
      setBalance(undefined)
    }
  }, [slow, account, requiresPolling])

  
  return <AccountContext.Provider value={{ account: typeof account === "string" ? account : undefined, balance }}>{children}</AccountContext.Provider>
}
  
export { AccountContext, AccountContextProvider }
