import React from "react"
import AppWrapper from "../src/wrapper"
import Link from "next/link"

const NotFound: React.FunctionComponent = () => {
  return(
    <AppWrapper>
      <div className="flex flex-col w-full justify-center items-center">
        <div className="flex divide-x-2 self-center mt-48 my-8">
          <div className="px-8 text-2xl">404</div>
          <div className="px-8 text-2xl">Not Found</div>
        </div>
        <Link href="/">
          <a className="btn btn-primary m-16 p-4 text-xl my-8 text-center rounded w-36">
            Home
          </a>
        </Link>
      </div>
    </AppWrapper>
  )
}

export default NotFound