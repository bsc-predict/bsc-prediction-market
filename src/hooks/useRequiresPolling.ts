import { useRouter } from "next/router"
import React from "react"


export const useRequiresPolling = () => {
  const {pathname} = useRouter()

  const requiresPolling = React.useRef(false)
  
  React.useEffect(() => {
    if (pathname.toLowerCase().startsWith("/main/")) {
      requiresPolling.current = true
    } else {
      requiresPolling.current = false
    }
  }, [pathname])

  return requiresPolling.current
}
  