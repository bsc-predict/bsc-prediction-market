import { useWeb3React } from "@web3-react/core"
import React from "react"
import BetLottery from "src/components/modal/BetLottery"
import { fetchLatestLottery, fetchLotteryHistory, fetchUserInfo } from "src/contracts/lottery"
import { useAppDispatch } from "src/hooks/reduxHooks"
import { setAccount } from "src/stores/accountSlice"
import { fetchCakeBalance } from "src/thunks/account"
import LotteryInfo from "./Info"
import LotteryNode from "./Lottery"

const STEP_SIZE = 3

const LotteryPage: React.FunctionComponent = () => {
  const [latest, setLatest] = React.useState<Lottery>()
  const [history, setHistory] = React.useState<Lottery[]>()
  const [userBets, setUserBets] = React.useState<UserInfo[]>([])
  const [showHistorical, setShowHistorical] = React.useState(6)

  const dispatch = useAppDispatch()
  const { library } = useWeb3React()
  const web3Account = "0x2a17C85E7e952e647E3ef3591c8bf44d9B8A9B65"
  const loaded = React.useRef(new Set<number>())


  React.useEffect(() => {
    if (web3Account) {
      dispatch<any>(fetchCakeBalance(web3Account))
    }
  }, [web3Account, dispatch])

  React.useEffect(() => {
    if (latest && history && web3Account) {
      const combined = [latest].concat(history).slice(0, showHistorical)
      const bets = combined.map(l => !loaded.current.has(l.id) ? fetchUserInfo(web3Account, l.id) : [])
      Promise.all(bets).then(b => {
        const updated = new Set(combined.map(l => l.id))
        loaded.current = updated
        setUserBets(prior => prior.concat(b.flat()))
      })
    }
  }, [latest, showHistorical, history, web3Account])

  React.useEffect(() => { console.log(userBets) }, [userBets])

  React.useEffect(() => {
    dispatch<any>(setAccount({ account: web3Account || undefined, library }))
  }, [web3Account, dispatch, library])

  React.useEffect(() => {
    fetchLotteryHistory().then(l => setHistory(l.sort((a, b) => a.id < b.id ? 1 : -1)))
    fetchLatestLottery().then(l => setLatest(l))
  }, [])

  return (
    <div>
      {latest && <BetLottery lottery={latest}/>}
      <LotteryInfo latest={latest} userInfo={userBets} showHistorical={showHistorical} />
      <div className="">
        {latest && <LotteryNode lottery={latest} />}
      </div>
      <div className="divider" />

      <div className="flex items-center flex-wrap">
        {history?.slice(0, showHistorical).map(l => <LotteryNode key={l.id} lottery={l} />)}
      </div>
      <button className="button" onClick={() => setShowHistorical(prior => prior + STEP_SIZE)}>Show more</button>
    </div>
  )
}

export default LotteryPage
