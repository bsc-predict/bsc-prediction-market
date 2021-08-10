import React from "react"

const RoundHeader: React.FunctionComponent = () => {
  return(
    <tr>
      <th className="px-5 p-1">Epoch</th>
      <th className="px-5 p-1">
        Bull Payout
      </th>
      <th className="px-5 p-1">
        Bear Payout
      </th>
      <th className="px-5 p-1">
        Prize Pool
      </th>
      <th className="px-5 p-1">
        Lock
      </th>
      <th className="px-5 p-1">
        Close
      </th>
      <th className="px-5 p-1">
        Position
      </th>
      <th className="px-5 p-1">
        Result
      </th>
    </tr>
  )
}

export default RoundHeader
