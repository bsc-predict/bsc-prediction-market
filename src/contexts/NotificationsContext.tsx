import React from "react"
import { NotificationProps } from "../components/notifications"


const NotificationsContext = React.createContext<{
  setMessage: (p: Omit<NotificationProps, "absolute"> & {duration: number}) => void,
  notificationProps?: Omit<NotificationProps, "absolute">}
>({
  setMessage: () => {/**/},
})

const NotificationsContextProvider: React.FunctionComponent = ({ children }) => {
  const [notificationProps, setNotificationProps] = React.useState<Omit<NotificationProps, "absolute"> | undefined>(undefined)
  const clear = React.useRef<NodeJS.Timeout>()

  const setMessage = React.useCallback((p: Omit<NotificationProps, "absolute"> & {duration: number}) => {
    if (clear.current !== undefined) {
      clearTimeout(clear.current)
    }

    setNotificationProps(p)
    const c = setTimeout(() => {
      setNotificationProps(undefined)
    }, p.duration)
    clear.current = c
  }, [])

  return <NotificationsContext.Provider value={{
    notificationProps,
    setMessage,
  }}>
    {children}
  </NotificationsContext.Provider>
}
  
export { NotificationsContext, NotificationsContextProvider }
