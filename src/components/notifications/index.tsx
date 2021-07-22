import React from "react"

export interface NotificationProps {
  type: "info" | "success" | "error"
  title: string
  message: string
  absolute: boolean
}

const Notification: React.FunctionComponent<NotificationProps> = (props) => {
  const {type, title, message, absolute} = props
  let containerColor = ""
  if (type === "info") {
    containerColor = "bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-white"
  } else if (type === "error") {
    containerColor = "bg-red-100 border-red-500 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-white"
  } else if (type === "success") {
    containerColor = "bg-green-100 border-green-500 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-white"
  }

  return(
    <div className={`${containerColor} ${absolute ? "absolute bottom-0 right-0 w-96" : ""} border-l-8 p-4 z-10`} role="alert">
      <p className="font-bold">{title}</p>
      <p>{message}</p>
    </div>
  )
}

export default Notification