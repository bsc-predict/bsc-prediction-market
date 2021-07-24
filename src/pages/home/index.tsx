import React from "react"
import Image from "next/image"
import { UserConfigContext } from "../../contexts/UserConfigContext"
import Link from "next/link"
import MockRound from "./mock/round"

const HomePage: React.FunctionComponent = () => {
  const {isDark} = React.useContext(UserConfigContext)

  return(
    <div className="text-center space-y-8">
      <div className="py-24 space-y-6">
        <Image
          alt="prediction-icon"
          src={isDark ? "/prediction-light.svg" : "/prediction.svg"}
          width={128}
          height={128}
        />
        <h1 className="text-4xl">BSC Predict</h1>
        <div className="text-xl">Preidct BNB-USD movements in 5 minute intervals</div>
        <Link href="/games/bnbusdt">
          <button className="bg-green-300 dark:bg-green-900 p-4 border rounded text-xl">
            <a>
              Play Now
            </a>
          </button>
        </Link>
      </div>
      {/* <div className="grid justify-items-center">
        <h2 className="text-2xl my-8">How does it work?</h2>
        <MockRound />
      </div> */}
    </div>
  )
}

export default HomePage