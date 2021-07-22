import React from "react"
import { ModalContext } from "../../../contexts/ModalContext"

interface ModalFooterProps {
  onSuccess: () => void
  successText: string
  isLoading: boolean
}

const ModalFooter: React.FunctionComponent<ModalFooterProps> = ({onSuccess, successText, isLoading}) => {
  const {closeModal} = React.useContext(ModalContext)

  return(

    <div className="flex justify-end pt-2">
      <button
        className="flex px-4 bg-transparent p-3 rounded-lg text-indigo-500 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 mr-2"
        onClick={onSuccess}
        disabled={isLoading}
      >
        <svg
          className={`${!isLoading ? "hidden" : ""} animate-spin -ml-1 mr-3 h-5 w-5 dark:text-white`}
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
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

export default ModalFooter
