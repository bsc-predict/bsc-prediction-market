import { useWeb3React } from "@web3-react/core"
import { useCallback, useEffect, useContext } from "react"
import { NotificationsContext } from "../contexts/NotificationsContext"
import { injected } from "../utils/web3React"
const LOGGED_IN_KEY = "logged-in"

const useLogin = () => {
  const {account, activate, deactivate} = useWeb3React()

  const {setMessage} = useContext(NotificationsContext)

  const handleDeactivate = () => {
    localStorage?.setItem(LOGGED_IN_KEY, "false")
      deactivate()
  }
  
  const handleActivate = useCallback(() => {
    localStorage?.setItem(LOGGED_IN_KEY, "true")
    activate(injected, err => setMessage({type: "error", message: 'Login failed', title: "Error", duration: 5000})
    )
  }, [activate])

  useEffect(() => {
    if (!account && localStorage?.getItem(LOGGED_IN_KEY) === "true") {
      handleActivate()
    }
  }, [account, handleActivate])

  return {handleActivate, handleDeactivate}    
}

export default useLogin