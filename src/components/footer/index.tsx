import React from "react"
import Link from "next/link"
import { UserConfigContext } from "../../contexts/UserConfigContext"
import Image from "next/image"
import { linkClass } from "./style"

const Links = {
  pancakeSwap: "https://pancakeswap.finance",
  pancakeSwapPredictions: "https://pancakeswap.finance/prediction",
  documentation: "https://docs.pancakeswap.finance/products/prediction",
  about: "/about",
  email: "mailto:contact@bscpredict.com",
  twitter: "https://twitter.com/bscpredict",
  github: "https://github.com/bsc-predict/bsc-prediction-market",
}

const Footer: React.FunctionComponent = () => {
  const {isDark} = React.useContext(UserConfigContext)

  return(
    <footer className="mt-8">
      <hr className="border-gray-600"/>
      <div className="block md:hidden text-center text-xl my-8">
        BSC Prediction Markets
      </div>
      <div className="hidden md:flex mt-12 mb-12 flex-row justify-center space-x-20">
        <div className="w-48">
          <div className="mb-4 block font-bold text-xl mb-8">Games</div>
          <div>
            <Link href="/games/bnbusdt">
              <a className={linkClass}>
                BNB Predict
              </a>
            </Link>
          </div>
        </div>
        <div className="w-48">
          <div className="mb-4 block font-bold text-xl mb-8">Links</div>
          <div>
          <Link href={Links.pancakeSwap}>
              <a className={linkClass}>Pancake Swap</a>
            </Link>
            <Link href={Links.pancakeSwapPredictions}>
              <a className={linkClass}>Pancake Swap Predictions</a>
            </Link>
            <Link href={Links.documentation}>
              <a className={linkClass}>Documentation</a>
            </Link>
          </div>
        </div>
        <div className="w-48">
          <div className="mb-4 block font-bold text-xl mb-8">Help</div>
          <Link href={Links.about}>
            <a className={linkClass}>About</a>
            </Link>
          <Link href={Links.email}>
            <a className={linkClass}>Contact</a>
          </Link>
        </div>
        <div className="space-x-8">
          <div className="mb-4 block font-bold text-xl mb-8 sp space-x-4">&nbsp;</div>
          <Link href={Links.twitter}>
            <a>
              <Image alt="twitter" src={isDark ? "/twitter-dark.svg" : "/twitter-light.svg"} width={24} height={24}/>
            </a>
          </Link>
          <Link href={Links.github}>
            <a>
              <Image alt="twitter" src={isDark ? "/github-dark.svg" : "/github-light.svg"} width={24} height={24}/>
            </a>
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
