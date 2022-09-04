import Head from "next/head"
import React from "react"
import AppHeader from "../components/header"
import AppFooter from "../components/footer"
import { NotificationsContext } from "../contexts/NotificationsContext"
import Notification from "../components/notifications"
import mixpanel from "mixpanel-browser"

interface AppWrapperProps {
  title: string
  description?: string
}

const AppWrapper: React.FunctionComponent<AppWrapperProps> = (props) => {
  const { title, description, children } = props

  const { notificationProps } = React.useContext(NotificationsContext)

  React.useEffect(() => {
    mixpanel.track("Page View", { page: props.title })
  }, [])

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description || "Binance Smart Chain (BSC) Prediction Markets"} />
      </Head>
      <main className="flex flex-col min-h-screen ">
        <AppHeader />
        <div className="mx-4 mb-auto">
          {children}
          <Notification
            type={notificationProps?.type || "hidden"}
            title={notificationProps?.title || ""}
            message={notificationProps?.message || ""}
            absolute={true}
          />
        </div>
        <AppFooter />
      </main>
    </div>
  )
}

export default AppWrapper
