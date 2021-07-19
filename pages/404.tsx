import React from "react"
import AppWrapper from "../src/wrapper"
import Link from "next/link"

const NotFound: React.FunctionComponent = () => {
  return(
    <AppWrapper>
      <div className="grid place-items-center ">
        <div className="flex divide-x-2 self-center mt-48">
          <div className="px-8 text-2xl">404</div>
          <div className="px-8 text-2xl">Not Found</div>
        </div>
        <Link href="/">
          <button className="m-16 p-4 bg-green-300 dark:bg-green-900 text-xl rounded">
            Home
          </button>
        </Link>
      </div>
    </AppWrapper>
  )
}

export default NotFound