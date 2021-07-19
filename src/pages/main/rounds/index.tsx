import { useRouter } from "next/router";
import React from "react"
import { BetsContext } from "../../../contexts/BetsContext"
import { RoundsContext } from "../../../contexts/RoundsContext"
import RoundsTableDesktop from "./desktop"
import RoundsTableMobile from "./mobile"

const RoundsTable: React.FunctionComponent = () => {
	const [page, setPage] = React.useState(0)
	const { query } = useRouter()

	const {curRounds, latestRounds, loadRounds} = React.useContext(RoundsContext)
	const {bets} = React.useContext(BetsContext)

	React.useEffect(() => {
		loadRounds(page)
	}, [loadRounds, page])

  React.useEffect(() => {
    const page = Number(query.page)
		if (!Number.isNaN(page)) {
			setPage(page)
		} else {
			loadRounds(0)
		}
  }, [loadRounds, query.page])

	React.useEffect(() => {
		loadRounds(page)
	}, [loadRounds, page])

	const handleSetPage = React.useCallback((p: number) => setPage(p), [])
  
	return(
		<div>
			<div className="hidden md:contents">
				<RoundsTableDesktop
					bets={bets}
					rounds={page === 0 ? latestRounds : curRounds}
					page={page} onChangePage={handleSetPage}/>
			</div>
			<div className="contents md:hidden">
				<RoundsTableMobile 
					bets={bets}
					rounds={page === 0 ? latestRounds : curRounds}
					page={page}
					onChangePage={handleSetPage}
				/>
				</div>
		</div>
	)
}

export default RoundsTable
