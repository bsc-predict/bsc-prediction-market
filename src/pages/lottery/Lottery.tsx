import React from "react"

interface LotteryNodeProps {
  lottery: Lottery
}

const LotteryNode: React.FunctionComponent<LotteryNodeProps> = (props) => {
  const { lottery } = props
  return (
    <div className="space-y-2 border p-2 rounded w-max m-4">
      <div className="text-2xl font-bold">
        Lottery {lottery.id}
      </div>
      <div className="text-xl font-bold text-green-500">
        <div>Winner {lottery.finalNumber.slice(1)}</div>
      </div>
      <div className="flex space-x-4 mx-2">
        <div >
          <div className="text-gray-500 text-xs">Price of Ticket (CAKE)</div>
          <div className="font-bold">{lottery.priceTicketInCake.toLocaleString()}</div>
        </div>
        <div >
          <div className="text-gray-500 text-xs">Start Time</div>
          <div className="font-bold">{lottery.startTime.toLocaleString()}</div>
        </div>
        <div >
          <div className="text-gray-500 text-xs">End Time</div>
          <div className="font-bold">{lottery.endTime.toLocaleString()}</div>
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
            <td>Cake</td>
            <td>{lottery.cakePerBracket[0].toFixed(2)}</td>
            <td>{lottery.cakePerBracket[1].toFixed(2)}</td>
            <td>{lottery.cakePerBracket[2].toFixed(2)}</td>
            <td>{lottery.cakePerBracket[3].toFixed(2)}</td>
            <td>{lottery.cakePerBracket[4].toFixed(2)}</td>
            <td>{lottery.cakePerBracket[5].toFixed(2)}</td>
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
