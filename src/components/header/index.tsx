import { useWeb3React } from "@web3-react/core"
import React from "react"
import { UserConfigContext } from "../../contexts/UserConfigContext"
import useLogin from "../../hooks/useLogin"
import Image from "next/image"
import Link from "next/link"
import HoverDropdown from "../hoverdropdown"

const AppHeader: React.FunctionComponent = () => {

  const {account} = useWeb3React()
  const {isDark, toggleTheme} = React.useContext(UserConfigContext)

  const {handleActivate, handleDeactivate} = useLogin()

  const handleToggleTheme = () => toggleTheme()

  const themeIcon = isDark ? "/light-mode.svg" : "/dark-mode.svg"

  return(
      <header className="sticky px-2 md:px-4 top-0 bg-white dark:bg-gray-900 flex items-center pt-2 pb-2 border-b border-gray-200">
        <div className="flex w-full space-x-4 divide-x">
          <div className="flex flex-none text-xl font-bold">
            <Link href="/">
              <a className="flex">
                <Image
                  alt="prediction-icon"
                  src={isDark ? "/prediction-light.svg" : "/prediction.svg"}
                  width={32}
                  height={33}
                />
                <div className="self-center px-2">
                  BSC Predict
                </div>
              </a>
            </Link>
          </div>
          <div className="flex-grow w-max px-2 self-center">
            <HoverDropdown
              label="Games"
              items={[{label: "BNB-USDT", href: "/games/bnbusdt", key: "bnbusdt"}]}
            />
          </div>
        </div>
        <div className="flex-none w-max ml-2">
          <button className="border rounded h-12 px-3" onClick={handleToggleTheme}>
            <Image alt="toggle-theme" src={themeIcon} width={24} height={24}/>
          </button>
        </div>
        <div className="flex-none w-max ml-2">
          {account ?
            <button className="flex items-center border rounded h-12 px-3 hover:bg-red-300 dark:hover:bg-red-900" onClick={handleDeactivate}>
              <Image
                alt="logout"
                src={isDark ? "/logout-light.svg" : "/logout.svg"}
                width={24}
                height={24}
                color="white"/>
            </button> :
            <button className="flex items-center border rounded h-12 px-3 hover:bg-green-300 dark:hover:bg-green-900" onClick={handleActivate}>
              <Image
                alt="login"
                src={isDark ? "/login-light.svg" : "/login.svg"}
                width={24}
                height={24}
              />
            </button>
          }
        </div>
      </header>
  )
}

export default AppHeader
