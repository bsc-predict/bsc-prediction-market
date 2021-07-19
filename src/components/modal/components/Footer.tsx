import React from "react"
import { ModalContext } from "../../../contexts/ModalContext"

interface FooterProps {
  onSuccess: () => void
  successText: string
}

const AppFooter: React.FunctionComponent<FooterProps> = ({onSuccess, successText}) => {
  const {closeModal} = React.useContext(ModalContext)

  return(

    <div className="flex justify-end pt-2">
      <button
        className="px-4 bg-transparent p-3 rounded-lg text-indigo-500 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 mr-2"
        onClick={onSuccess}
      >
        {successText}
      </button>
      <button
        className="modal-close px-4 bg-indigo-500 p-3 rounded-lg  hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
        onClick={closeModal}
      >
        Close
      </button>
    </div>
  )
}

export default AppFooter
