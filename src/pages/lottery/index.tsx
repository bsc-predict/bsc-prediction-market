import { useWeb3React } from "@web3-react/core"
import React from "react"
import BetLottery from "src/components/modal/BetLottery"
import { useAppDispatch, useAppSelector } from "src/hooks/reduxHooks"
import { setAccount } from "src/stores/accountSlice"
import { fetchCakeBalance } from "src/thunks/account"
import { fetchLatestLotteryThunk, fetchLotteryBetsThunk, fetchLotteryHistoryThunk } from "src/thunks/lottery"
import { createArray } from "src/utils/utils"
import LotteryInfo from "./Info"
import LotteryNode from "./LotteryNode"

const STEP_SIZE = 3

const LotteryPage: React.FunctionComponent = () => {
  const [showHistorical, setShowHistorical] = React.useState(6)

  const dispatch = useAppDispatch()
  const lotteriesQueried = useAppSelector(s => new Set(s.lottery.lotteriesQueried))
  const latest = useAppSelector(s => s.lottery.latest)
  const history = useAppSelector(s => s.lottery.history)
  const userBets = useAppSelector(s => s.lottery.bets)

  const { library, account } = useWeb3React()
  const web3Account = account
  // const web3Account = ""

  React.useEffect(() => {
    if (web3Account) {
      dispatch<any>(fetchCakeBalance(web3Account))
    } else {
      dispatch<any>(fetchCakeBalance(undefined))
    }
    dispatch<any>(fetchLotteryHistoryThunk())
    dispatch<any>(fetchLatestLotteryThunk())
  }, [web3Account, dispatch])

  React.useEffect(() => {
    if (latest) {
      const ids = createArray(Math.max(0,latest.id - showHistorical), latest.id + 1).filter(id => !lotteriesQueried.has(id))
      dispatch<any>(fetchLotteryBetsThunk({ ids }))
    }
  }, [latest, showHistorical, history, web3Account])


  React.useEffect(() => {
    dispatch<any>(setAccount({ account: web3Account || undefined, library }))
  }, [web3Account, dispatch, library])

  return (
    <div className="w-full overflow-auto">
      {latest && <BetLottery lottery={latest} />}
      <LotteryInfo latest={latest} userInfo={userBets} showHistorical={showHistorical} />
      <div className="">
        {latest && <LotteryNode lottery={latest} />}
      </div>
      <div className="divider" />

      <div className="md:flex md:items-center md:flex-wrap">
        {history?.slice(0, showHistorical).map(l => <LotteryNode key={l.id} lottery={l} />)}
      </div>
      <div className="divider"/>
      <button className="btn btn-accent" onClick={() => setShowHistorical(prior => prior + STEP_SIZE)}>Show more</button>
    </div>
  )
}

export default LotteryPage
