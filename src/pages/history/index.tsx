import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import React from "react"
import { fetchArchivedRounds, fetchBets } from "../../api";
import Notification from "../../components/notifications";
import { UserConfigContext } from "../../contexts/UserConfigContext";
import { enrichBets } from "../../utils/bets";
import RoundsTable from "../main/rounds/table";
import HistoricalInfo from "./info";


const HistoryPage: React.FunctionComponent = () => {
  const [page, setPage] = React.useState(0)
  const [rounds, setRounds] = React.useState<Round[]>([])
  const [showRounds, setShowRounds] = React.useState<Round[]>([])
  const [enrichedBets, setEnrichedBets] = React.useState<Bet[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const router = useRouter()

  const {account: userAccount} = useWeb3React()
  const {account: pathAccount} = router.query
  const account = typeof pathAccount === "string" ? pathAccount : userAccount

  const {showRows} = React.useContext(UserConfigContext)


  React.useEffect(() => {
    if (account) {
      fetchBets(account)
        .then(({bets}) => {
          const enriched = enrichBets(bets, rounds, new Set(rounds.map(r => r.epochNum))).filter(b => b.epoch)
          setEnrichedBets(enriched)
        })
        .finally(() => setIsLoading(false))
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
  if (!isLoading && !account) {
    return (
      <Notification
        type="error"
        title="Error"
        absolute={false}
        message="No account provided. Login or provide account through path (e.g. /history/&lt;account&gt;)"
      />
    )    
  } else if (!isLoading && rounds.length === 0) {
      return (
        <Notification
          type="info"
          title="No bets made"
          absolute={false}
          message={`Account ${account} has not made any bets`}
      />
      )
    }

	return(
    <div>
      <HistoricalInfo bets={enrichedBets} account={account || ""}/>
      <RoundsTable
        rounds={showRounds}
        setPage={handleSetPage}
        page={page}
        bets={enrichedBets}
        numPages={Math.floor((enrichedBets.length - 1) / showRows)}
      />
    </div>
  )
}

export default HistoryPage
