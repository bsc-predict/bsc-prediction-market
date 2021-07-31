import React from "react"
import { rowClass } from "../style"

const EmptyRow: React.FunctionComponent = () => {
  
  return(
    <tr className="animate-pulse">
      <td className={rowClass}>&nbsp;</td>
      <td className={rowClass}>&nbsp;</td>
      <td className={rowClass}>&nbsp;</td>
      <td className={rowClass}>&nbsp;</td>
      <td className={rowClass}>&nbsp;</td>
      <td className={rowClass}>&nbsp;</td>
      <td className={rowClass}>&nbsp;</td>
      <td className={rowClass}>&nbsp;</td>
    </tr>
  )
}

export default EmptyRow