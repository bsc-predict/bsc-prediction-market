import { useRouter } from "next/router"
import React from "react"

const pollingMatch = /^\/(main|test)\/.+/g

export const useRequiresPolling = () => {
  const {pathname} = useRouter()

  const requiresPolling = React.useRef(false)
  
  React.useEffect(() => {
    if (pathname.match(pollingMatch)) {
      requiresPolling.current = true
    } else {
      requiresPolling.current = false
    }
  }, [pathname])

  return requiresPolling.current
}
  