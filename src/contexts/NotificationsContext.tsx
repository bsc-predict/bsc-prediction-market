import React from "react"
import Notification, { NotificationProps } from "../components/notifications"


const NotificationsContext = React.createContext<{
  setMessage: (p: NotificationProps & {duration: number}) => void,
  notification: null | JSX.Element}
>({
  setMessage: (p: NotificationProps) => {/**/},
  notification: null
})

const NotificationsContextProvider: React.FunctionComponent = ({ children }) => {
  const [notification, setNotification] = React.useState<JSX.Element | null>(null)
  const clear = React.useRef<NodeJS.Timeout>()

  const setMessage = React.useCallback((p: NotificationProps & {duration: number}) => {
    if (clear.current !== undefined) {
      clearTimeout(clear.current)
    }
    setNotification(<Notification {...p} />)
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
