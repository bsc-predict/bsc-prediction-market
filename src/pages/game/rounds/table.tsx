import React from "react"
import useWindowDimensions from "../../../hooks/useWindowsDimensions"
import RoundsTableDesktop from "./desktop"
import RoundsTableMobile from "./mobile"

interface RoundsTableProps {
  bets: Bet[]
  page: number
  setPage: (n: number) => void
  rounds: Round[]
  numPages: number
}

const RoundsTable: React.FunctionComponent<RoundsTableProps> = (props) => {
  const { bets, rounds, page, setPage, numPages } = props
  const { width } = useWindowDimensions()
  const mobile = width < 768
  return (
    <div>
      {mobile ?
        <RoundsTableMobile
          bets={bets}
          rounds={rounds}
          page={page}
          onChangePage={setPage}
        /> :
        <RoundsTableDesktop
          bets={bets}
          rounds={rounds}
          page={page}
          onChangePage={setPage}
          numPages={numPages}
        />
      }
    </div >
  )
}

export default RoundsTable
