import React, { useState } from 'react'

const COLOR_THEME_KEY = "color-theme"
const SHOW_ROWS_KEY = "show-rows"
const DEFAULT_SHOW_ROWS = 10

interface IUserConfigContext {
  isDark: boolean
  toggleTheme: () => void
  showRows: number
  updateShowRows: (n: number) => void
}

const UserConfigContext = React.createContext<IUserConfigContext>({
  isDark: false,
  toggleTheme: () => {/**/},
  showRows: 10,
  updateShowRows: () => {/**/},
})

const UserConfigContextProvider: React.FunctionComponent = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const isDarkUserSetting = localStorage.getItem(COLOR_THEME_KEY)
      return isDarkUserSetting === "dark" ? true : false
    }
    return false
  })

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

  const toggleTheme = React.useCallback(() => {
    setIsDark((prevState) => {
      if (typeof window !== 'undefined') {
        const colorTheme = prevState ? "light" : "dark"
        localStorage?.setItem(COLOR_THEME_KEY, JSON.stringify(colorTheme))
      }
      return !prevState
    })
  }, [])

  React.useEffect(() => {
    const root = window.document.documentElement
    
    const theme = isDark ? 'dark' : 'light'
    root.classList.remove(isDark ? 'light' : 'dark')
    root.classList.add(theme)
    if (typeof window !== 'undefined') {
      localStorage?.setItem(COLOR_THEME_KEY, theme)
    }
  }, [isDark])

  return (
    <UserConfigContext.Provider value={{ isDark, toggleTheme, showRows,  updateShowRows}}>
      {children}
    </UserConfigContext.Provider>
  )
}

export { UserConfigContext, UserConfigContextProvider }
