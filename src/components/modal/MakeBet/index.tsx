import { useWeb3React } from "@web3-react/core"
import React from "react"
import { AccountContext } from "../../../contexts/AccountContext"
import { usePredictionContract } from "../../../contracts/prediction"
import web3 from "../../../utils/web3"
import Footer from "../components/Footer"
import Title from "../components/Title"

interface MakeBetProps {
  direction: "bull" | "bear"
}

const MakeBet: React.FunctionComponent<MakeBetProps> = (props) => {
  const {direction} = props

  const [size, setSize] = React.useState(0)
  const [perc, setPerc] = React.useState<number | undefined>(0.1)
  const [curDirection, setCurDirection] = React.useState(direction)

  const {balance} = React.useContext(AccountContext)
  const {makeBet} = usePredictionContract()
  
  React.useEffect(() => {
    if (perc !== undefined) {
      const bal = Number(web3.utils.fromWei(balance?.balance || "0"))
      const maxSize = bal - 0.0005
      setSize(Math.round(Math.max(0, Math.min(bal * perc, maxSize)) * 10000) / 10000)  
    }
  }, [perc])


  const handleChangeSize = (s: number) => {
    setSize(s)
    setPerc(undefined)
  }
  
  const handleOnSuccess = () => {
    makeBet(curDirection, size)
  }

  const buttonGreenHighlighted = "bg-green-300 dark:bg-green-800"
  const buttonRedHighlighted = "bg-red-300 dark:bg-red-800"

  return(
    <div className="w-full grid grid-cols-1 divide-y">
      <Title title="Bet"/>
      <form className="rounded px-8 pt-6 pb-4 mb-4">
        <div className="mb-4">
          <label className="blocktext-sm font-bold mb-2">
            Bet Size
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700" 
            type="number"
            value={size}
            onChange={v => handleChangeSize(Number(v.currentTarget.value))}/>
          <p className="text-xs italic">Balance: {web3.utils.fromWei(balance?.balance || "0", "ether")} (${balance?.balanceUsd.toLocaleString()})</p>
        </div>
      </form>
        <div>
          <div className="flex my-4">
            <button onClick={() => setCurDirection("bear")} className={`w-32 text-sm rounded ${curDirection === "bear" ? buttonRedHighlighted : ""}`}>BEAR</button>
            <button onClick={() => setCurDirection("bull")} className={`w-32 text-sm rounded ${curDirection === "bull" ? buttonGreenHighlighted : ""}`}>BULL</button>
          </div>
        </div>
        <div>
          <div className="flex my-4">
            <button onClick={() => setPerc(0.1)} className={`w-32 text-sm rounded ${perc === 0.1 ? buttonGreenHighlighted : ""}`}>10%</button>
            <button onClick={() => setPerc(0.25)} className={`w-32 text-sm rounded ${perc === 0.25 ? buttonGreenHighlighted : ""}`}>25%</button>
            <button onClick={() => setPerc(0.5)} className={`w-32 text-sm rounded ${perc === 0.5 ? buttonGreenHighlighted : ""}`}>50%</button>
            <button onClick={() => setPerc(1.0)} className={`w-32 text-sm rounded ${perc === 1 ? buttonGreenHighlighted : ""}`}>100%</button>
          </div>
        </div>
      <Footer onSuccess={handleOnSuccess} successText="Bet"/>
    </div>
  )
}

export default MakeBet
