import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import React from "react"
import Notification from "../../components/notifications";
import { BlockContext } from "../../contexts/BlockContext";
import { ContractContext } from "../../contexts/ContractContext";
import { UserConfigContext } from "../../contexts/UserConfigContext";
import useOnScreen from "../../hooks/useOnScreen";
import { enrichBets } from "../../utils/bets";
import web3 from "../../utils/web3";
import RoundsTable from "../game/rounds/table";
import HistoricalInfo from "./info";


const HistoryPage: React.FunctionComponent = () => {
  const [page, setPage] = React.useState(0)
  const [rounds, setRounds] = React.useState<Round[]>([])
  const [showRounds, setShowRounds] = React.useState<Round[]>([])
  const [enrichedBets, setEnrichedBets] = React.useState<Bet[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [account, setAccount] = React.useState<string | undefined>()
  const [unclaimed, setUnclaimed] = React.useState(false)

  const router = useRouter()
  const {account: userAccount} = useWeb3React()
  const {a: pathAccount} = router.query
    
  const {showRows} = React.useContext(UserConfigContext)
  const { fetchArchivedRounds, fetchBets } = React.useContext(ContractContext)
  const {blockRef} = React.useContext(BlockContext)

  const ref = React.useRef<HTMLDivElement>(null)
  const isVisble = useOnScreen(ref)

  React.useEffect(() => {
    const a = typeof pathAccount === "string" ? pathAccount : userAccount
    setAccount(a || undefined)
  }, [pathAccount, userAccount])

  const refreshBets = React.useCallback(() => {
    if (isVisble && account && rounds.length > 0) {
      setIsLoading(true)
      setEnrichedBets([])
      fetchBets(account)
        .then(({bets, claimed}) => {
          const c = userAccount === account ? claimed : new Set(rounds.map(r => r.epochNum))
          const enriched =
            enrichBets(bets, rounds, blockRef.current, c)
              .filter(b => b.epoch)
              .sort((a, b) => a.blockNumberNum > b.blockNumberNum ? -1 : 1)
            setEnrichedBets(enriched)            
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [isVisble, fetchBets, blockRef, rounds, account, userAccount])
  
  console.log(enrichedBets.find(b => b.epoch === "597"))
  React.useEffect(() => {
    refreshBets()
  }, [refreshBets])
  
  React.useEffect(() => {
    if (!account) {
      setEnrichedBets([])
      setShowRounds([])
    }
  }, [account])

  React.useEffect(() => {
    fetchArchivedRounds(false)
      .then(r => setRounds(r))
  }, [fetchArchivedRounds])

  const handleSetAccount = React.useCallback((a: string) => setAccount(a), [])
  const handleSetUnclaimed = React.useCallback((b: boolean) => setUnclaimed(b), [])

  React.useEffect(() => {
    const epochs = new Set(enrichedBets.map(b => b.epoch))
    const unclaimedRounds = new Set(enrichedBets.filter(b => b.status === "claimable").map(b => b.epoch))
    const start = page * showRows

    const show = rounds
      .filter(r => epochs.has(r.epoch))
      .filter(r => unclaimed === false || unclaimedRounds.has(r.epoch))
      .sort((r1, r2) => r2.epochNum < r1.epochNum ? -1 : 1)
      .slice(start, start + showRows)
    setShowRounds(show)
  }, [enrichedBets, rounds, page, showRows, unclaimed])

	const handleSetPage = React.useCallback((p: number) => setPage(p), [])
  
  let message: JSX.Element | null = null

  if (!isLoading && !account) {
    message =
      <Notification
        type="error"
        title="Error"
        absolute={false}
        message="No account provided. Login or provide account in the account text field above"
      /> 
  } else if (!isLoading && showRounds.length === 0) {
      message =
        <Notification
          type="info"
          title={unclaimed ? "No unclaimed bets" : "No bets made"}
          absolute={false}
          message={`Account ${account} has ${unclaimed ? "no unclaimed bets" : "not made any bets"}`}
      />
    } else if (account && !web3.utils.isAddress(account)) {
      message = 
        <Notification
          type="error"
          title="Error"
          absolute={false}
          message="Invalid account"
        />
    }

	return(
    <div ref={ref}>
      <HistoricalInfo
        bets={enrichedBets}
        account={account || ""}
        changeAccount={handleSetAccount}
        unclaimed={userAccount === account ? unclaimed : undefined}
        setUnclaimed={handleSetUnclaimed}
      />
      {message}
      {(isLoading || showRounds.length > 0) &&
      <RoundsTable
        rounds={showRounds}
        setPage={handleSetPage}
        page={page}
        bets={enrichedBets}
        numPages={Math.floor((showRounds.length - 1) / showRows)}
        claimCallback={refreshBets}
      />}
    </div>
  )
}

export default HistoryPage
