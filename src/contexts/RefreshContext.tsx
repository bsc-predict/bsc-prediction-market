import React, { useState, useEffect, useRef } from 'react'

const FAST_INTERVAL = 5000
const SLOW_INTERVAL = 10000

const RefreshContext = React.createContext({ slow: 0, fast: 0, fast2: 0 })

// Check if the tab is active in the user browser
const useIsBrowserTabActive = () => {
  const isBrowserTabActiveRef = useRef(true)

  useEffect(() => {
    const onVisibilityChange = () => {
      isBrowserTabActiveRef.current = !document.hidden
    }

    window.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return isBrowserTabActiveRef
}

// This context maintain 2 counters that can be used as a dependencies on other hooks to force a periodic refresh
const RefreshContextProvider: React.FunctionComponent = ({ children }) => {
  const [slow, setSlow] = useState(0)
  const [fast, setFast] = useState(0)
  const [fast2, setFast2] = useState(0)
  const isBrowserTabActiveRef = useIsBrowserTabActive()

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isBrowserTabActiveRef.current) {
        setFast((prev) => prev + 1)
      }
    }, FAST_INTERVAL)
    return () => clearInterval(interval)
  }, [isBrowserTabActiveRef])


  useEffect(() => {
    const interval = setTimeout(() => setInterval(async () => {
      if (isBrowserTabActiveRef.current) {
        setFast2((prev) => prev + 1)
      }
    }, FAST_INTERVAL), FAST_INTERVAL / 2.0)
    return () => clearInterval(interval)
  }, [isBrowserTabActiveRef])

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isBrowserTabActiveRef.current) {
        setSlow((prev) => prev + 1)
      }
    }, SLOW_INTERVAL)
    return () => clearInterval(interval)
  }, [isBrowserTabActiveRef])

  return <RefreshContext.Provider value={{ slow, fast, fast2 }}>{children}</RefreshContext.Provider>
}

export { RefreshContext, RefreshContextProvider }
