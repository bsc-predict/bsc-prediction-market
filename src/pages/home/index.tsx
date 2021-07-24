import React from "react"
import Image from "next/image"
import { UserConfigContext } from "../../contexts/UserConfigContext"
import Link from "next/link"

const HomePage: React.FunctionComponent = () => {
  const {isDark} = React.useContext(UserConfigContext)

  return(
    <div className="flex flex-col align-center text-center space-y-8">
      <div className="py-24 space-y-6">
        <Image
          alt="prediction-icon"
          src={isDark ? "/prediction-light.svg" : "/prediction.svg"}
          width={128}
          height={128}
        />
        <h1 className="text-4xl">BSC Predict</h1>
        <div className="text-xl">Preidct BNB-USD movements in 5 minute intervals</div>
        <button className="bg-green-300 dark:bg-green-900 p-4 border rounded text-xl">
          <Link href="/games/bnbusdt">
            <a>
              Play Now
            </a>
          </Link>
        </button>
      </div>
      <div >
        {/* <h2 className="text-2xl my-8">How does it work?</h2>
        <table>
          <thead>
            <tr>
              <RoundHeader/>
            </tr>
          </thead>
          <tbody>

          </tbody>
        </table> */}
      </div>
    </div>
  )
}

export default HomePage