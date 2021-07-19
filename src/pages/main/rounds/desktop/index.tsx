import React from "react"
import { BetsContext } from "../../../../contexts/BetsContext"
import { RoundsContext } from "../../../../contexts/RoundsContext"
import { createArray } from "../../../../utils/utils"
import RoundRow from "./row"

interface RoundsTableDesktopProps {
  rounds: Round[]
  bets: Bet[]
  page: number
  onChangePage: (p: number) => void
}



const RoundsTableDesktop: React.FunctionComponent<RoundsTableDesktopProps> = (props) => {
  const {rounds, bets, page, onChangePage} = props

  const pages = page < 3 ? createArray(0, 5) : createArray(page - 2, page + 3)
  const pageStyle = "bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
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
            {rounds.map(r =>
              <RoundRow key={r.epoch} round={r} bet={bets.find(b => b.epoch === r.epoch)}/>)}
        </tbody>
      </table>
      <div className="float-right mt-4">
        <a
          href="#"
          className={pageStyle}
          onClick={() => onChangePage(0)}
        >
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