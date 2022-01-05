import React from "react"
import Link from "next/link"
import { linkClass } from "./style"
import { github } from "../../images/github"
import { twitter } from "../../images/twitter"
import { Links } from "src/constants"

const Footer: React.FunctionComponent = () => {

  return(
    <footer className="mt-8">
      <hr className="border-gray-600"/>
      <div className="block md:hidden text-center text-xl my-8">
        BSC Prediction Markets
      </div>
      <div className="hidden md:flex mt-12 mb-12 flex-row justify-center space-x-20">
        <div className="w-52">
          <div className="block font-bold text-xl mb-8">Games</div>
          <div>
            <Link href="/bnbusdt">
              <a className={linkClass}>
                BNB Predict
              </a>
            </Link>
          </div>
        </div>
        <div className="w-52">
          <div className="block font-bold text-xl mb-8">Links</div>
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
            <Link href={Links.tradingBot}>
              <a className={linkClass}>Trading Bot</a>
            </Link>
          </div>
        </div>
        <div className="w-52">
          <div className="mb-4 block font-bold text-xl mb-8">Help</div>
          <Link href={Links.about}>
            <a className={linkClass}>About</a>
            </Link>
          <Link href={Links.email}>
            <a className={linkClass}>Contact</a>
          </Link>
        </div>
        <div className="flex h-10 space-x-8">
          <Link href={Links.github}>
            <a className="flex">
              {github}
            </a>
          </Link>
          <Link href={Links.twitter}>
            <a>
              {twitter}
            </a>
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
