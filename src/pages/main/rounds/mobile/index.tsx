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
  const buttonStyle = "border border-solid w-24 mx-2 p-1 px-4 rounded"

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
        <button
          className={buttonStyle}
          onClick={() => onChangePage(0)}
        >Current</button>
        <button
          className={buttonStyle}
          onClick={() => onChangePage(page - 1)}
        >Later</button>

      </div>}
      {rounds.map(r =>
        <RoundCardMobile
          key={r.epoch}
          round={r}
          bet={bets.find(b => b.epoch === r.epoch)}
        />
      )}
      <button className={buttonStyle} onClick={handleMore}>Earlier</button>
    </div>
  )
}

export default RoundsTableMobile
