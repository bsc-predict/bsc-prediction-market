import React from "react"
import { AccountContext } from "../../../contexts/AccountContext"
import web3 from "../../../utils/web3"
import { BetsContext } from "../../../contexts/BetsContext"
import { NotificationsContext } from "../../../contexts/NotificationsContext"
import { ContractContext } from "../../../contexts/ContractContext"
import { useRouter } from "next/router"

interface MakeBetProps {
  direction: "bull" | "bear"
}


const MakeBet: React.FunctionComponent<MakeBetProps> = (props) => {
  const {direction} = props

  const [isLoading, setIsLoading] = React.useState(false)
  const [size, setSize] = React.useState(0)
  const [selectedPerc, setSelectedPerc] = React.useState<number | undefined>(0.1)
  const [curDirection, setCurDirection] = React.useState(direction)

  const {fetchBets} = React.useContext(BetsContext)
  const {balance} = React.useContext(AccountContext)
  const {setMessage} = React.useContext(NotificationsContext)

  const {makeBet} = React.useContext(ContractContext)
  const router = useRouter()

  React.useEffect(() => {
    if (selectedPerc !== undefined) {
      const bal = Number(web3.utils.fromWei(balance?.balance || "0"))
      const maxSize = bal - 0.005
      setSize(Math.round(Math.max(0, Math.min(bal * selectedPerc, maxSize)) * 10000) / 10000)  
    }
  }, [selectedPerc, balance?.balance])


  const handleChangeSize = (s: number) => {
    setSize(s)
    setSelectedPerc(undefined)
  }
  
  const handleOnSuccess = () => {
    setIsLoading(true)
    makeBet(
      curDirection,
      size,
      () => setMessage({type: "info", title: "Bet confirmed", duration: 5000}),
      () => setMessage({type: "success", title: "Bet processed", duration: 5000}),
      (e?: Error) => setMessage({type: "info", title: "Bet failed", message: e?.message || "", duration: 7000}),
    )
      .then(() => {
        fetchBets()
        setMessage({type: "success", title: "Success", message: "Bet placed", duration: 5000})
      })
      .then(() => router.back())
      .finally(() => setIsLoading(false))
  }

  const percChoices = [0.1, 0.25, 0.5, 1.0]

  return(
    <div id={direction === "bear" ? "make-bet-bear-modal" : "make-bet-bull-modal"} className="modal">
      <div className="modal-box">
        <div className="flex justify-between items-center pb-3">
          <p className="text-2xl font-bold">Bet</p>
          <a className="modal-close cursor-pointer z-50" onClick={() => router.back()}>
            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
            </svg>
          </a>
        </div>
        <form className="rounded px-8 pt-6 pb-4 mb-4">
          <div className="mb-4">
            <label className="blocktext-sm font-bold mb-2">
              Bet Size
            </label>
            <input
              className="shadow appearance-none bg-base-200 border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" 
              type="number"
              value={size}
              onChange={v => handleChangeSize(Number(v.currentTarget.value))}/>
            <p className="text-xs italic">
              Bet: ${Math.round(size * (balance?.bnbPrice || 0) * 100) / 100 }&nbsp;
              Balance: {web3.utils.fromWei(balance?.balance || "0", "ether").slice(0,6)} (${balance?.balanceUsd.toLocaleString()})
            </p>
          </div>
        </form>
          <div className="space-y-8">
            <div className="flex w-full space-x-4">
              <button
                onClick={() => setCurDirection("bear")}
                className={curDirection === "bear" ? "btn btn-sm w-24 grid flex-grow btn-secondary" : "btn btn-sm w-24 grid flex-grow btn-outline"}
              >
                BEAR
              </button>
              <button
                onClick={() => setCurDirection("bull")}
                className={curDirection === "bull" ? "btn btn-sm w-24 grid flex-grow btn-accent" : "btn btn-sm w-24 grid flex-grow btn-outline"}
              >
                BULL
              </button>
            </div>
            <div className="flex w-full btn-group">
              {percChoices.map(perc =>
                <button
                  key={perc}
                  onClick={() => setSelectedPerc(perc)}
                  className={perc === selectedPerc ? "btn btn-sm flex-grow btn-primary" : "btn btn-sm flex-grow btn-outline"}
                >
                  {perc}%
                </button>
                
              )}
              
            </div>
          </div>
                  <div className="modal-action">
            <a onClick={() => router.back()} className="btn btn-ghost">Close</a>
            <button className="btn btn-primary" onClick={handleOnSuccess} disabled={isLoading}>Bet</button>
          </div>

      </div>
    </div>
  )
}

export const MakeBetBear = <MakeBet direction="bear"/>
export const MakBetBull = <MakeBet direction="bull"/>
