import { useWeb3React } from "@web3-react/core"
import React from "react"
import useLogin from "../../hooks/useLogin"
import Link from "next/link"
import {themeChange} from "theme-change"
import {predictionSmall} from "../../images/prediction"
import { login, logout } from "../../images/account"

const AppHeader: React.FunctionComponent = () => {

  const {account} = useWeb3React()
  

  const {handleActivate, handleDeactivate} = useLogin()

  React.useEffect(() => {
    themeChange(false)
  }, [])

  return(
      <div className="navbar mb-2 shadow bg-base-200">
        <div className="flex-none px-2 mx-2">
          <span className="text-xl font-bold">
            <Link href="/">
              <a className="flex">
                {predictionSmall}
                <div className="hidden md:block self-center px-2">
                  BSC Predict
                </div>
              </a>
            </Link>
          </span>
        </div>
        <div className="flex-1 px-2 mx-2">
          <div className="items-stretch ">
            <div className="dropdown dropdown-hover">
              <div tabIndex={0} className="m-1 btn btn-ghost">Games</div>
              <ul className="shadow menu dropdown-content bg-base-100 rounded-box w-60">
                <li className="btn btn-square btn-block btn-ghost">
                  <Link href="/bnbusdt" passHref>
                    <a>BNB-USDT</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex-none space-x-2">
          <div className="dropdown dropdown-hover" >
            <div tabIndex={0} className="m-1 btn btn-ghost">Theme</div> 
            <ul className="shadow menu dropdown-content bg-base-100 rounded-box w-32">
              <button className="btn btn-square btn-block btn-ghost" data-set-theme="light" data-act-class="bg-accent">
                <a>Light</a>
              </button>
              <button className="btn btn-square btn-block btn-ghost" data-set-theme="dark" data-act-class="bg-accent">
                <a>Dark</a>
              </button>
            </ul>
          </div>
          {account ?
            <button className="btn btn-ghost" onClick={handleDeactivate}>
              {logout}
            </button> :
            <button className="btn btn-ghost" onClick={handleActivate}>
              {login}
            </button>
          }
        </div>
      </div>
  )
}

export default AppHeader
