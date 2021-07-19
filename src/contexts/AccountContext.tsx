import { useWeb3React } from "@web3-react/core"
import React from "react"
import { fetchBnbPrice } from "../api"
import web3 from "../utils/web3"
import { RefreshContext } from "./RefreshContext"

const AccountContext = React.createContext<{account?: string, balance?: BalanceInfo}>({})

interface BalanceInfo {
  balance: string
  balanceUsd: number
}

const AccountContextProvider: React.FunctionComponent = ({ children }) => {
  const [balance, setBalance] = React.useState<BalanceInfo | undefined>(undefined)

  const {account} = useWeb3React()
  const {slow} = React.useContext(RefreshContext)
  
  React.useEffect(() => {
    if (account) {
      const bnbPrice = fetchBnbPrice()
      const balance = web3.eth.getBalance(account)

      Promise.all([bnbPrice, balance])
        .then(([price, bal]) => {
          const balanceUsd = Number(web3.utils.fromWei(bal, "ether")) * price
          setBalance({balance: bal, balanceUsd})
        })
    } else {
      setBalance(undefined)
    }
  }, [slow, account])

  
  return <AccountContext.Provider value={{ account: typeof account === "string" ? account : undefined, balance }}>{children}</AccountContext.Provider>
}
  
export { AccountContext, AccountContextProvider }
