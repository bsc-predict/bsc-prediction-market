import React, { useState } from 'react'

const ThemeContext = React.createContext({ isDark: false, toggleTheme: () => {/**/} })

const ThemeContextProvider: React.FunctionComponent = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const isDarkUserSetting = localStorage.getItem('color-theme')
      return isDarkUserSetting === "dark" ? true : false
    }
    return false
  })

  const toggleTheme = () => {
    setIsDark((prevState) => {
      if (typeof window !== 'undefined') {
        const colorTheme = prevState ? "light" : "dark"
        localStorage?.setItem("color-theme", JSON.stringify(colorTheme))
      }
      return !prevState
    })
  }

  React.useEffect(() => {
    const root = window.document.documentElement
    
    const theme = isDark ? 'dark' : 'light'
    root.classList.remove(isDark ? 'light' : 'dark')
    root.classList.add(theme)
    if (typeof window !== 'undefined') {
      localStorage?.setItem('color-theme', theme)
    }

  }, [isDark])

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeContext, ThemeContextProvider }
