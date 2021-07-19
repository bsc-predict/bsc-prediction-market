import Head from "next/head"
import React from "react"
import AppHeader from "../components/header"
import Modal from "../components/modal"
import AppFooter from "../components/footer"
import { NotificationsContext } from "../contexts/NotificationsContext"

interface AppWrapperProps {
  title?: string
  description?: string
}

const AppWrapper: React.FunctionComponent<AppWrapperProps> = (props) => {
  const {title, description, children} = props

  const {notification} = React.useContext(NotificationsContext)

  return(
    <div>
      <Head>
        <title>{title || "BSC Predictions"}</title>
        <meta name="description" content={description || "Binance Smart Chain (BSC) Prediction Markets"} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col min-h-screen text-black text-opacity-90 bg-white dark:bg-gray-900 dark:text-white dark:text-opacity-70">
        <AppHeader/>
        <div className="my-8 mx-4 mb-auto">
          {children}
          {notification}
        </div>
        <Modal/>
        <AppFooter />
      </main>
    </div>
  )
}

export default AppWrapper
