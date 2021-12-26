import React from "react"

interface LotteryNodeProps {
  lottery: Lottery
}

const LotteryNode: React.FunctionComponent<LotteryNodeProps> = (props) => {
  const { lottery } = props
  const live = lottery.finalNumber === "0"

  const treasuryFee = lottery.treasuryFee / 100_000 * lottery.amountCollectedInCake
  const cakeLessTreasury = lottery.amountCollectedInCake - treasuryFee


  return (
    <div className="space-y-2 border p-2 rounded w-max m-4">
      <div className="flex">
        <div className="text-2xl font-bold flex-grow">
          Lottery {lottery.id}
        </div>
        {live && <a href={"#bet-lottery-modal"}>
          <button className="btn btn-accent">Buy Tickets</button>
        </a>}
      </div>

      <div className="text-xl font-bold text-green-500">
        <div>Winner {lottery.finalNumber.slice(1) || "??????"}</div>
      </div>
      <div className="flex space-x-8 mx-2">
        <div >
          <div className="text-gray-500 text-xs">Price of Ticket (CAKE)</div>
          <div className="font-bold">{lottery.priceTicketInCake.toLocaleString()}</div>
        </div>
        <div >
          <div className="text-gray-500 text-xs">Collected</div>
          <div className="font-bold">{Math.round(lottery.amountCollectedInCake).toLocaleString()}</div>
        </div>
      </div>
      <div className="flex space-x-8 mx-2">
        <div >
          <div className="text-gray-500 text-xs">Start Time</div>
          <div className="font-bold">{lottery.startTime.toLocaleDateString()}</div>
          <div className="font-bold text-xs">{lottery.startTime.toLocaleTimeString()}</div>
        </div>
        <div >
          <div className="text-gray-500 text-xs">End Time</div>
          <div className="font-bold">{lottery.endTime.toLocaleDateString()}</div>
          <div className="font-bold text-xs">{lottery.endTime.toLocaleTimeString()}</div>
        </div>
      </div>
      <table className="table">
        <tbody>
          <tr>
            <td>Bracket</td>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
            <td>6</td>
          </tr>
          <tr>
            <td>
              <div>{live ? "Cake Collected" : "Cake Reward"}</div>
              {!live && <div>&nbsp;</div>}
            </td>
            <td>
              <div>{live ? Math.round((cakeLessTreasury * lottery.rewardsBreakdown[0] / 10_000)) : lottery.cakePerBracket[0].toFixed(2)}</div>
              <div className="text-gray-500 text-xs">{live ? "" : `${(lottery.cakePerBracket[0] / lottery.priceTicketInCake).toFixed(2)}x`}</div>
            </td>
            <td>
              <div>{live ? Math.round((cakeLessTreasury * lottery.rewardsBreakdown[1] / 10_000)) : lottery.cakePerBracket[1].toFixed(2)}</div>
              <div className="text-gray-500 text-xs">{live ? "" : `${(lottery.cakePerBracket[1] / lottery.priceTicketInCake).toFixed(2)}x`}</div>
            </td>
            <td>
              <div>{live ? Math.round((cakeLessTreasury * lottery.rewardsBreakdown[2] / 10_000)) : lottery.cakePerBracket[2].toFixed(2)}</div>
              <div className="text-gray-500 text-xs">{live ? "" : `${(lottery.cakePerBracket[2] / lottery.priceTicketInCake).toFixed(2)}x`}</div>
            </td>
            <td>
              <div>{live ? Math.round((cakeLessTreasury * lottery.rewardsBreakdown[3] / 10_000)) : lottery.cakePerBracket[3].toFixed(2)}</div>
              <div className="text-gray-500 text-xs">{live ? "" : `${(lottery.cakePerBracket[3] / lottery.priceTicketInCake).toFixed(2)}x`}</div>
            </td>
            <td>
              <div>{live ? Math.round((cakeLessTreasury * lottery.rewardsBreakdown[4] / 10_000)) : lottery.cakePerBracket[4].toFixed(2)}</div>
              <div className="text-gray-500 text-xs">{live ? "" : `${(lottery.cakePerBracket[4] / lottery.priceTicketInCake).toFixed(2)}x`}</div>
            </td>
            <td>
              <div>{live ? Math.round((cakeLessTreasury * lottery.rewardsBreakdown[5] / 10_000)) : lottery.cakePerBracket[5].toFixed(2)}</div>
              <div className="text-gray-500 text-xs">{live ? "" : `${(lottery.cakePerBracket[5] / lottery.priceTicketInCake).toFixed(2)}x`}</div>
            </td>
          </tr>
          <tr>
            <td>Rewards</td>
            <td>{lottery.rewardsBreakdown[0]}</td>
            <td>{lottery.rewardsBreakdown[1]}</td>
            <td>{lottery.rewardsBreakdown[2]}</td>
            <td>{lottery.rewardsBreakdown[3]}</td>
            <td>{lottery.rewardsBreakdown[4]}</td>
            <td>{lottery.rewardsBreakdown[5]}</td>
          </tr>
          <tr>
            <td>Winners</td>
            <td>{lottery.countWinnersPerBracket[0]}</td>
            <td>{lottery.countWinnersPerBracket[1]}</td>
            <td>{lottery.countWinnersPerBracket[2]}</td>
            <td>{lottery.countWinnersPerBracket[3]}</td>
            <td>{lottery.countWinnersPerBracket[4]}</td>
            <td>{lottery.countWinnersPerBracket[5]}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default LotteryNode
