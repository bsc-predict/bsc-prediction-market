import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import React from "react"
import { BetsContext } from "../../../contexts/BetsContext"
import { RoundsContext } from "../../../contexts/RoundsContext"
import { UserConfigContext } from "../../../contexts/UserConfigContext"
import { usePrevious } from "../../../hooks/usePrevious";
import RoundsTable from "./table";

const RoundsPage: React.FunctionComponent = () => {
  const [page, setPage] = React.useState(0)
  const { query } = useRouter()

  const {account} = useWeb3React()
  const {curRounds, latestRounds, loadRounds} = React.useContext(RoundsContext)
  const {bets, fetchBets, setAccount} = React.useContext(BetsContext)
  const {showRows} = React.useContext(UserConfigContext)
  const prevLatest = usePrevious(latestRounds)

  React.useEffect(() => {
    if (latestRounds && prevLatest) {
      if (Math.max(...prevLatest.map(p => p.epochNum), 0) !== Math.max(...latestRounds.map(p => p.epochNum), 0)) {
        fetchBets()
      }
    }
  }, [latestRounds, fetchBets, prevLatest])

  React.useEffect(() => {
    setAccount(account || undefined)
  }, [account, setAccount])

  React.useEffect(() => {
    loadRounds(page)
  }, [loadRounds, page])

  React.useEffect(() => {
    const page = Number(query.page)
		if (!Number.isNaN(page)) {
			setPage(page)
		}
  }, [loadRounds, query.page])

	const handleSetPage = React.useCallback((p: number) => setPage(p), [])
  
	return(
    <RoundsTable
      numPages={latestRounds.length > 0 ? Math.floor((latestRounds[0].epochNum - 2) / showRows) : 0}
      rounds={page === 0 ? latestRounds : curRounds}
      setPage={handleSetPage}
      page={page}
      bets={bets}
    />
  )
}

export default RoundsPage
