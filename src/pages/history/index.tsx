import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import React from "react"
import { fetchArchivedRounds, fetchBets } from "../../api";
import Notification from "../../components/notifications";
import { UserConfigContext } from "../../contexts/UserConfigContext";
import { enrichBets } from "../../utils/bets";
import web3 from "../../utils/web3";
import RoundsTable from "../bnbusdt/rounds/table";
import HistoricalInfo from "./info";


const HistoryPage: React.FunctionComponent = () => {
  const [page, setPage] = React.useState(0)
  const [rounds, setRounds] = React.useState<Round[]>([])
  const [showRounds, setShowRounds] = React.useState<Round[]>([])
  const [enrichedBets, setEnrichedBets] = React.useState<Bet[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const router = useRouter()

  const {account: userAccount} = useWeb3React()
  const {a: pathAccount} = router.query
  const account = typeof pathAccount === "string" ? pathAccount : userAccount

  const {showRows} = React.useContext(UserConfigContext)


  React.useEffect(() => {
    if (account && rounds.length > 0) {
      setIsLoading(true)
      fetchBets(account)
        .then(({bets}) => {
          const enriched =
            enrichBets(bets, rounds, new Set(rounds.map(r => r.epochNum)))
              .filter(b => b.epoch)
              .sort((a, b) => a.blockNumberNum > b.blockNumberNum ? -1 : 1)
            setEnrichedBets(enriched)            
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [rounds, account])

  React.useEffect(() => {
    fetchArchivedRounds(false)
      .then(r => setRounds(r))
  }, [])

  React.useEffect(() => {
    const epochs = new Set(enrichedBets.map(b => b.epoch))
    const start = page * showRows

    const show = rounds
      .filter(r => epochs.has(r.epoch))
      .sort((r1, r2) => r2.epochNum < r1.epochNum ? -1 : 1)
      .slice(start, start + showRows)
    setShowRounds(show)
  }, [enrichedBets, rounds, page, showRows])

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
  } else if (!isLoading && rounds.length === 0) {
      message =
        <Notification
          type="info"
          title="No bets made"
          absolute={false}
          message={`Account ${account} has not made any bets`}
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
    <div>
      <HistoricalInfo bets={enrichedBets} account={account || ""}/>
      {message}
      {(isLoading || showRounds.length > 0) &&
      <RoundsTable
        rounds={showRounds}
        setPage={handleSetPage}
        page={page}
        bets={enrichedBets}
        numPages={Math.floor((enrichedBets.length - 1) / showRows)}
      />}
    </div>
  )
}

export default HistoryPage
