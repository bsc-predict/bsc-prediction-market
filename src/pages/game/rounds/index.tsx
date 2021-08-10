import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";
import React from "react"
import { BetsContext } from "../../../contexts/BetsContext"
import { RoundsContext } from "../../../contexts/RoundsContext"
import { UserConfigContext } from "../../../contexts/UserConfigContext"
import RoundsTable from "./table";
import Notification from "../../../components/notifications"
import Info from "../info";

const RoundsPage: React.FunctionComponent = () => {
  const [page, setPage] = React.useState(0)
  const { query } = useRouter()

  const {account} = useWeb3React()
  const {paused, rounds, loadRounds} = React.useContext(RoundsContext)
  const {bets, setAccount, fetchBets} = React.useContext(BetsContext)
  const {showRows} = React.useContext(UserConfigContext)


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
    <React.Fragment>
      {paused &&
      <div className="mb-6">
        <Notification
          type="info"
          title="Markets Paused"
          message="Markets have been paused. All open bets prior to pause are reclaimable"
          absolute={false}
        />
      </div>}
      <Info/>
      <RoundsTable
        numPages={rounds.latest.length > 0 ? Math.floor((rounds.latest[0].epochNum - 2) / showRows) : 0}
        rounds={page === 0 ? rounds.latest : rounds.cur}
        setPage={handleSetPage}
        page={page}
        bets={bets}
        claimCallback={fetchBets}
      />
    </React.Fragment>
  )
}

export default RoundsPage
