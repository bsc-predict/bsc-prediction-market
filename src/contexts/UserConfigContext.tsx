import React, { useState } from 'react'

const SHOW_ROWS_KEY = "show-rows"
const DEFAULT_SHOW_ROWS = 10

interface IUserConfigContext {
  showRows: number
  updateShowRows: (n: number) => void
}

const UserConfigContext = React.createContext<IUserConfigContext>({
  showRows: 10,
  updateShowRows: () => {/**/},
})

const UserConfigContextProvider: React.FunctionComponent = ({ children }) => {
  const [showRows, setShowRows] = useState<number>(() => {
    try {
      const item = window.localStorage.getItem(SHOW_ROWS_KEY);
      if (item){
        return Number(item)
      }
      return DEFAULT_SHOW_ROWS
    } catch (error) {
      return DEFAULT_SHOW_ROWS
    }
  })

  const updateShowRows = React.useCallback((n: number) => {
    setShowRows(n)
    if (typeof window !== 'undefined') {
      localStorage?.setItem(SHOW_ROWS_KEY, JSON.stringify(n))
    }    
  }, [])


  return (
    <UserConfigContext.Provider value={{ showRows,  updateShowRows}}>
      {children}
    </UserConfigContext.Provider>
  )
}

export { UserConfigContext, UserConfigContextProvider }
