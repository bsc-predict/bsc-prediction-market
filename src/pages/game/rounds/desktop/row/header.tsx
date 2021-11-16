import React from "react"

const RoundHeader: React.FunctionComponent = () => {
  return(
    <thead>
      <tr>
        <td className="px-5 p-1">Epoch</td>
        <td className="px-5 p-1">Bull Payout</td>
        <td className="px-5 p-1">Bear Payout</td>
        <td className="px-5 p-1">Prize Pool</td>
        <td className="px-5 p-1">Lock</td>
        <td className="px-5 p-1">Close</td>
        <td className="px-5 p-1">Position</td>
        <td className="px-5 p-1">Result</td>
      </tr>
    </thead>
  )
}

export default RoundHeader
