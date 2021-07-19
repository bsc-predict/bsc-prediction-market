import React from "react"
import { ModalContext } from "../../contexts/ModalContext"


const Modal: React.FunctionComponent = () => {
  const {closeModal, content} = React.useContext(ModalContext)

  const handleClose = () => {
    closeModal()
  }

  return(
    <div className="modal opacity-0 pointer-events-none fixed w-full h-full top-0 left-0 flex items-center justify-center z-10">
      <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
      <div className="modal-container bg-white dark:bg-gray-700 w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div
          className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50"
          onClick={handleClose}
        >
          <svg className="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
          </svg>
          <span className="text-sm">(Esc)</span>
        </div>
  
        <div className="modal-content py-4 text-left px-6">
          {content}
        </div>
      </div>
    </div>
  )
}

export default Modal