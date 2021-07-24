import React from "react"
import { UserConfigContext } from "../../../../contexts/UserConfigContext"
import { createArray } from "../../../../utils/utils"
import RoundRow from "./row"
import EmptyRow from "./row/empty"
import RoundHeader from "./row/header"
import { pageStyle } from "./style"

interface RoundsTableDesktopProps {
  rounds: Round[]
  bets: Bet[]
  page: number
  onChangePage: (p: number) => void
  numPages: number
}


const RoundsTableDesktop: React.FunctionComponent<RoundsTableDesktopProps> = (props) => {
  const {rounds, bets, page, onChangePage, numPages} = props

  const {showRows, updateShowRows} = React.useContext(UserConfigContext)
  const betsMap = new Map<string, Bet>()
  bets.forEach(b => {
    if (b.epoch) {
      betsMap.set(b.epoch, b)
    }
  })

  const pages = page < 3 ? createArray(0, 5) : createArray(page - 2, page + 3)
  const rowOptions = [5 ,10, 15, 20]

  return(
    <div className="overflow-y-auto">
      <table className="w-full border-collapse border border-grey-800">
        <thead>
          <RoundHeader/>
        </thead>
        <tbody>
          {rounds.length === 0 && createArray(0, showRows).map(idx => <EmptyRow key={idx}/>)}
          {rounds.map(r => <RoundRow key={r.epoch} round={r} bet={betsMap.get(r.epoch)}/>)}
        </tbody>
      </table>
      <div className="flex float-left mt-4">
        <div className="mx-4">Rows</div>
        {rowOptions.map(n =>
          <button
            key={n}
            className="px-2 mx-1 w-12 text-sm border rounded"
            onClick={() => updateShowRows(n)}
          >
            {n}
          </button>
        )}

      </div>
      <div className="float-right mt-4">
        <div className={`${page === 0 ? "hidden" : ""} ${pageStyle}`} onClick={() => onChangePage(0)}>
          ⇤
        </div>
        {pages.filter(p => p <= numPages).map(p => 
          <div
            key={p}
            onClick={() => onChangePage(p)}
            className={`${pageStyle} ${p === page ? "bg-gray-200 dark:bg-gray-700" : ""}`}>
            {p + 1}
          </div>
        )}
        {numPages > Math.max(...pages) && <a className={pageStyle}>...</a>}
      </div>
    </div>
  )
}

export default RoundsTableDesktop