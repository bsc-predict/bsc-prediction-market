import React from "react"
import { UserConfigContext } from "../../../../contexts/UserConfigContext"
import { createArray } from "../../../../utils/utils"
import RoundRow from "./row"
import EmptyRow from "./row/empty"
import { pageStyle } from "./style"

interface RoundsTableDesktopProps {
  rounds: Round[]
  bets: Bet[]
  page: number
  onChangePage: (p: number) => void
}


const RoundsTableDesktop: React.FunctionComponent<RoundsTableDesktopProps> = (props) => {
  const {rounds, bets, page, onChangePage} = props

  const {showRows, updateShowRows} = React.useContext(UserConfigContext)

  const pages = page < 3 ? createArray(0, 5) : createArray(page - 2, page + 3)
  const rowOptions = [5 ,10, 15, 20]

  return(
    <div className="overflow-y-auto">
      <table className="w-full border-collapse border border-grey-800">
        <thead>
          <tr>
            <th className="px-5 p-1">Epoch</th>
            <th className="px-5 p-1">Bull Payout</th>
            <th className="px-5 p-1">Bear Payout</th>
            <th className="px-5 p-1">Prize Pool</th>
            <th className="px-5 p-1">Lock</th>
            <th className="px-5 p-1">Close</th>
            <th className="px-5 p-1">Position</th>
            <th className="px-5 p-1">Result</th>
          </tr>
        </thead>
        <tbody>
          {rounds.length === 0 && createArray(0, showRows).map(idx => <EmptyRow key={idx}/>)}
          {rounds.map(r => <RoundRow key={r.epoch} round={r} bet={bets.find(b => b.epoch === r.epoch)}/>)}
        </tbody>
      </table>
      <div className="flex float-left mt-4">
        <div className="mx-4">Rows</div>
        {rowOptions.map(n =>
          <button
            key={n}
            className={`px-2 mx-1 w-12 text-sm border rounded ${showRows === n ? "bg-green-300 dark:bg-green-900" : ""}`}
            onClick={() => updateShowRows(n)}
          >
            {n}
          </button>
        )}

      </div>
      <div className="float-right mt-4">
        <a href="/" className={pageStyle} onClick={() => onChangePage(0)}>
          ⇤
        </a>
        {pages.map(p => 
          <a
            key={p}
            href="#"
            onClick={() => onChangePage(p)}
            className={`${pageStyle} ${p === page ? "bg-gray-200 dark:bg-gray-700" : ""}`}>
            {p + 1}
          </a>
        )}
        <a className={pageStyle}>...</a>
      </div>
    </div>
  )
}

export default RoundsTableDesktop