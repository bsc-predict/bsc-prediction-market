import React from "react"
import MakeBet from "../components/modal/MakeBet"

interface MakeBetProps {
  tag: "make-bet"
  direction: "bull" | "bear"
}

type ModalProps = MakeBetProps

interface IModalContext {
  showModal: (p: ModalProps) => void
  closeModal: () => void
  content: JSX.Element | null
}

const ModalContext = React.createContext<IModalContext>({ content: null, closeModal: () => {/**/}, showModal: () => {/* */} })

const ModalContextProvider: React.FunctionComponent = ({ children }) => {
  const [content, setContent] = React.useState<JSX.Element | null>(null)

  const closeModal = React.useCallback(() => {
    setContent(null)
    const body = document.querySelector('body')
    const modal = document.querySelector('.modal')
    modal?.classList.toggle('opacity-0')
    modal?.classList.toggle('pointer-events-none')
    body?.classList.toggle('modal-active')
  }, [])

  const showModal = React.useCallback((p: ModalProps) => {
    if (p.tag === "make-bet") {
      setContent(<MakeBet direction={p.direction}/>)
    } else {
      setContent(null)
    }

    const body = document.querySelector('body')
    const modal = document.querySelector('.modal')
    modal?.classList.toggle('opacity-0')
    modal?.classList.toggle('pointer-events-none')
    body?.classList.toggle('modal-active')

  }, [])

  return <ModalContext.Provider value={{content, showModal, closeModal}}>{children}</ModalContext.Provider>
}
  
export { ModalContext, ModalContextProvider }
