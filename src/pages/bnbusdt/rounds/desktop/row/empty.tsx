import React from "react"
import { rowClass } from "../style"

const EmptyRow: React.FunctionComponent = () => {
  
  return(
    <tr className="animate-pulse bg-white dark:bg-gray-900">
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