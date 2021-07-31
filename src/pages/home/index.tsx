import React from "react"
import Link from "next/link"
import {predictionLarge} from "../../images/prediction"

const HomePage: React.FunctionComponent = () => {

  return(
    <div className="text-center space-y-8">
      <div className="py-24 space-y-6">
        <div className="flex justify-center">
          {predictionLarge}
        </div>
        <h1 className="text-4xl">BSC Predict</h1>
        <div className="text-xl">Predict BNB-USD movements in 5 minute intervals</div>
        <Link href="/main/bnbusdt" passHref>
          <button className="btn btn-primary"><a>Play Now</a></button>
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