import React from "react"
import Link from "next/link"
import { ThemeContext } from "../../contexts/ThemeContext"

const Links = {
  pancakeSwap: "https://pancakeswap.finance",
  documentation: "https://docs.pancakeswap.finance/products/prediction",
  about: "/about",
  email: "mailto:contact@bscpredict.com"
}

const Footer: React.FunctionComponent = () => {
  const {isDark} = React.useContext(ThemeContext)

  return(
    <footer className="h-full h-16 mt-8 bg-white dark:bg-gray-900">
      <hr className="border-gray-600"/>
      <div className="block md:hidden text-center text-xl my-8">
        BSC Prediction Markets
      </div>
      <div className="hidden md:flex mt-12 mb-12 flex-row justify-center space-x-20">
        <div>
          <div className="mb-4 block font-bold text-xl mb-8">Games</div>
          <div>
            <Link href="/">
              <a className="mb-4 block cursor-pointer text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-500 my-8">
                BNB Predictions
              </a>
            </Link>
          </div>
        </div>
        <div>
          <div className="mb-4 block font-bold text-xl mb-8">Links</div>
          <div>
            <a
              href={Links.pancakeSwap}
              className="mb-4 block cursor-pointer text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-500 my-8"
            >
              Pancake Swap
            </a>
            <Link href={Links.documentation}>
              <a className="mb-4 block cursor-pointer text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-500 my-8">
                Documentation
              </a>
            </Link>
          </div>
        </div>
        <div>
          <div className="mb-4 block font-bold text-xl mb-8">Help</div>
          <div>
            <a
              href={Links.about}
              className="mb-4 block cursor-pointer text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-500 my-8"
            >
              About
            </a>
            <a
              href={Links.email}
              className="mb-4 block cursor-pointer text-gray-600 dark:text-gray-400 dark:hover:text-white hover:text-gray-500 my-8"
            >
              Contact
            </a>
          </div>
        </div>
        <div>
          <div className="mb-4 block font-bold text-xl mb-8">&nbsp;</div>
          <div className="cursor-pointer">
            <img alt="toggle-theme" src={isDark ? "/twitter-dark.svg" : "/twitter-light.svg"} width={24} height={24}/>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
