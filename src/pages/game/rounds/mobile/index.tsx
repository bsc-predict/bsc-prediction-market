import React from "react"
import RoundCardMobile from "./card"

interface RoundsTableMobileProps {
  rounds: Round[]
  bets: Bet[]
  page: number
  onChangePage: (p: number) => void
}

const RoundsTableMobile: React.FunctionComponent<RoundsTableMobileProps> = (props) => {  
  const {rounds, bets, page, onChangePage} = props

  const scrollToTop = () => {
    window.scroll({
      top: 0,
      behavior: "smooth"
    })
  }

  const handleMore = () => {
    scrollToTop()
    onChangePage(page + 1)
  }

  return(
    <div className="grid m-4 justify-items-center">
      {page > 0 && <div>
        <button className="btn" onClick={() => onChangePage(0)}>Current</button>
        <button className="btn" onClick={() => onChangePage(page - 1)}>Later</button>
      </div>}
      {rounds.map((r, idx) =>
        <RoundCardMobile
          idx={idx}
          key={r.epoch}
          round={r}
          bet={bets.find(b => b.epoch === r.epoch)}
        />
      )}
      <button className="btn" onClick={handleMore}>Earlier</button>
    </div>
  )
}

export default RoundsTableMobile
