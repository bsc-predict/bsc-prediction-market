import { useWeb3React } from "@web3-react/core"
import { useCallback, useEffect, useContext } from "react"
import { NotificationsContext } from "../contexts/NotificationsContext"
import web3 from "../utils/web3"
import { injected } from "../utils/web3React"
const LOGGED_IN_KEY = "logged-in"

const useLogin = () => {
  const {account, activate, deactivate} = useWeb3React()

  const {setMessage} = useContext(NotificationsContext)

  const handleLoginError = (err: Error) => {
    let message = err.message
    if (err.name === "UnsupportedChainIdError") {
      message = "Make sure you're on Binance Smart Chain on MetaMask"
    }
    setMessage({type: "error", message, title: "Connection Failed", duration: 5000})
  }

  const handleDeactivate = () => {
    localStorage?.setItem(LOGGED_IN_KEY, "false")
      deactivate()
  }
  
  const handleActivate = useCallback(() => {
    localStorage?.setItem(LOGGED_IN_KEY, "true")
    activate(injected, err => handleLoginError(err))
  }, [activate])

  useEffect(() => {
    if (!account && localStorage?.getItem(LOGGED_IN_KEY) === "true") {
      handleActivate()
    }
  }, [account, handleActivate])

  return {handleActivate, handleDeactivate}    
}

export default useLogin