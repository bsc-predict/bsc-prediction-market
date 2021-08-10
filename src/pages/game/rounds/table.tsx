import React from "react"
import RoundsTableDesktop from "./desktop"
import RoundsTableMobile from "./mobile"

interface RoundsTableProps {
  bets: Bet[]
  page: number
  setPage: (n: number) => void
  rounds: Round[]
  numPages: number
  claimCallback: () => void
}

const RoundsTable: React.FunctionComponent<RoundsTableProps> = (props) => {
  const {bets, rounds, page, setPage, numPages, claimCallback} = props

  return(
    <div>
      <div className="hidden md:contents">
        <RoundsTableDesktop
          bets={bets}
          rounds={rounds}
          page={page}
          onChangePage={setPage}
          numPages={numPages}
          claimCallback={claimCallback}
        />
      </div>
      <div className="contents md:hidden">
        <RoundsTableMobile 
          bets={bets}
          rounds={rounds}
          page={page}
          onChangePage={setPage}
          claimCallback={claimCallback}
        />
        </div>
    </div>
  )
}

export default RoundsTable
