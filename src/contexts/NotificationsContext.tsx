import React from "react"
import Notification, { NotificationProps } from "../components/notifications"


const NotificationsContext = React.createContext<{
  setMessage: (p: Omit<NotificationProps, "absolute"> & {duration: number}) => void,
  notification: null | JSX.Element}
>({
  setMessage: () => {/**/},
  notification: null
})

const NotificationsContextProvider: React.FunctionComponent = ({ children }) => {
  const [notification, setNotification] = React.useState<JSX.Element | null>(null)
  const clear = React.useRef<NodeJS.Timeout>()

  const setMessage = React.useCallback((p: Omit<NotificationProps, "absolute"> & {duration: number}) => {
    if (clear.current !== undefined) {
      clearTimeout(clear.current)
    }
    setNotification(<Notification {...p} absolute={true} />)
    const c = setTimeout(() => {
      setNotification(null)
    }, p.duration)
    clear.current = c
  }, [])

  return <NotificationsContext.Provider value={{
    notification,
    setMessage,
  }}>
    {children}
  </NotificationsContext.Provider>
}
  
export { NotificationsContext, NotificationsContextProvider }
