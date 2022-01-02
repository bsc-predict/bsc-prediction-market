import React from "react"
import { UserConfigContext } from "../../../../contexts/UserConfigContext"
import { createArray } from "../../../../utils/utils"
import RoundRow from "./row"
import EmptyRow from "./row/empty"
import RoundHeader from "./row/header"

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
  const rowOptions = [5 ,10, 15, 20, 50]

  return(
    <div>
      <table className="w-full">
        <RoundHeader/>
        <tbody>
          {rounds.length === 0 && createArray(0, showRows).map(idx => <EmptyRow key={idx}/>)}
          {rounds.map((r, idx) => <RoundRow idx={idx} key={r.epoch} round={r} bet={betsMap.get(r.epoch)} />)}
        </tbody>
      </table>
      <div className="flex float-left mt-4 items-center">
      <div className="mx-4">Rows</div>
        <div className="btn-group">
          {rowOptions.map(n =>
            <button
              key={n}
              className={rounds.length === n ? "btn btn-sm btn-active" : "btn btn-sm btn-ghost"}
              onClick={() => updateShowRows(n)}
            >
              {n}
            </button>
          )}
        </div>

      </div>
      <div className="btn-group float-right mt-4">
        <button className={page === 0 ? "hidden" : "btn btn-sm btn-ghost"} onClick={() => onChangePage(0)}>
          ⇤
        </button>
        {pages.filter(p => p <= numPages).map(p => 
          <button
            key={p}
            onClick={() => onChangePage(p)}
            className={p === page ? "btn btn-sm btn-ghost btn-active" : "btn btn-sm btn-ghost"}>
            {p + 1}
          </button>
        )}
        {numPages > Math.max(...pages) && <button className="btn btn-sm btn-ghost">...</button>}
      </div>
    </div>
  )
}

export default RoundsTableDesktop