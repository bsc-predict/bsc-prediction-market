import React from "react"
import { fetchLotteryHistory } from "src/contracts/lottery"
import LotteryNode from "./Lottery"

const LotteryPage: React.FunctionComponent = () => {
  const [lottery, setLottery] = React.useState<Lottery[]>()

  React.useEffect(() => {
    fetchLotteryHistory().then(l => setLottery(l.sort((a, b) => a.id < b.id ? 1 : -1)))
  }, [])

  return (
    <div className="flex items-center flex-wrap">

      {lottery?.slice(0, 9).map(l => <LotteryNode key={l.id} lottery={l}/>)}

    </div>
  )
}

export default LotteryPage
