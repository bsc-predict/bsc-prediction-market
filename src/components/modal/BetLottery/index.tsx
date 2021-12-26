import { useRouter } from "next/router"
import React from "react"
import { NotificationsContext } from "src/contexts/NotificationsContext"
import { approveCakeSpender, isApprovedCakeSpender } from "src/contracts/cake"
import { buyLotteryTickets, LotteryAddress } from "src/contracts/lottery"
import { useAppSelector } from "src/hooks/reduxHooks"

interface BetLotteryProps {
  lottery: Lottery
}

const getTicketError = (ticket: string, idx: number) => {
  const prefix = `[Ticket ${idx + 1}]`
  if (ticket.length !== 6) {
    return `${prefix} ${ticket} must be 6 digits`
  } else if (ticket.split('').some(n => Number.isNaN(Number(n)))) {
    return `${prefix} ${ticket} must be all digits`
  }
}

const getDiscount = (numTickets: number) => Math.max(0, numTickets - 1 * 0.005)

const BetLottery: React.FunctionComponent<BetLotteryProps> = (props) => {
  const { lottery } = props

  const balance = useAppSelector(s => s.account.cakeBalance)
  const account = useAppSelector(s => s.account.account)
  const library = useAppSelector(s => s.account.library)

  const [raw, setRaw] = React.useState("")
  const [tickets, setTickets] = React.useState<string[]>([])
  const [errors, setErrors] = React.useState("")
  const [approved, setApproved] = React.useState<boolean>()

  const { setMessage } = React.useContext(NotificationsContext)

  React.useEffect(() => {
    if (account) {
      isApprovedCakeSpender(account, LotteryAddress.main).then(a => setApproved(a))
    } else {
      setApproved(false)
    }
  }, [])

  React.useEffect(() => {
    const tRaw = raw.split(/\n|\,/g)
    const t = tRaw.filter(t => getTicketError(t, 0) === undefined)
    setTickets(t)
    const price = lottery.priceTicketInCake * t.length

    let errorsFound = false
    if (price > balance.balanceEth) {
      setErrors("Not enough CAKE")
      return
    }
    t.slice(0, t.length - 1).forEach((t, idx) => {
      const e = getTicketError(t, idx)
      if (e) {
        setErrors(e)
        errorsFound = true
        return
      }
    })
    if (!errorsFound) {
      setErrors("")
    }
  }, [raw, balance, lottery])


  const generate = (ct: number) => {
    const out: string[] = []
    const seen = new Set<number>()

    while (out.length < ct) {
      const t = Math.floor(Math.random() * 999_999)
      if (!seen.has(t)) {
        out.push(t.toString().padStart(6, "0"))
      }
    }
    setRaw(out.join("\n"))
    setTickets(out)
  }

  const buyTickets = () => {
    if (!betDisabled && library) {
      buyLotteryTickets({
        account,
        library,
        lotteryId: lottery.id,
        numbers: tickets,
        onSent: () => setMessage({ type: "info", title: "Ticket purchase sent", duration: 5000 }),
        onConfirmed: () => setMessage({ type: "info", title: "Tickets purchased", duration: 5000 }),
        onError: () => setMessage({ type: "error", title: "Purchase cancelled", duration: 5000 })
      })
    }
  }

  const enable = () => {
    if (account && library) {
      approveCakeSpender({
        account,
        library,
        spender: LotteryAddress.main,
        onSent: () => {
          setMessage({ type: "success", title: "Approval sent", duration: 5000 })
          isApprovedCakeSpender(account, LotteryAddress.main).then(a => setApproved(a))
        },
        onConfirmed: () => {
          setMessage({ title: "Approval complete", type: "success", duration: 5000 })
          isApprovedCakeSpender(account, LotteryAddress.main).then(a => setApproved(a))
        },
        onError: e => {
          setMessage({ type: "error", title: "Approval failed", message: e.message, duration: 5000 })
          isApprovedCakeSpender(account, LotteryAddress.main).then(a => setApproved(a))
        },
      })

    }
  }

  const router = useRouter()
  const price = lottery.priceTicketInCake * tickets.length

  const betDisabled = !account || errors || tickets.length === 0 || price > balance.balanceEth

  return (
    <div id={"bet-lottery-modal"} className="modal">
      <div className="modal-box">
        <div className="flex justify-between items-center pb-3">
          <p className="text-2xl font-bold">Buy Tickets [{lottery.id}]</p>
          <p>Balance {balance.balanceEth.toFixed(2)} CAKE</p>
          <a className="modal-close cursor-pointer z-50" onClick={() => router.back()}>
            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
            </svg>
          </a>
        </div>
        <div className="alert">
          <div className="flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#2196f3" className="w-6 h-6 mx-2">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <label>{tickets.length} Valid Tickets: {(price).toFixed(2)} CAKE</label>
          </div>
        </div>

        <textarea className="textarea h-36 textarea-bordered w-full" placeholder="Ticket #s (comma or newline separated)" value={raw} onChange={r => setRaw(r.currentTarget.value)}></textarea>
        <div className="flex items-center space-x-4">
          <span>Generate</span>
          <button className="btn bt-primary" onClick={() => generate(1)}>1</button>
          <button className="btn bt-primary" onClick={() => generate(5)}>5</button>
          <button className="btn bt-primary" onClick={() => generate(10)}>10</button>
          <button className="btn bt-primary" onClick={() => generate(25)}>25</button>
          <button className="btn bt-primary" onClick={() => generate(100)}>100</button>
        </div>
        <div className={errors === "" ? "invisible alert alert-error" : "alert alert-error"}>
          <div className="flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
            </svg>
            <label>{errors}</label>
          </div>
        </div>
        <div >
          {approved && <button className={betDisabled ? "btn btn-disabled float-right" : "btn btn-accent float-right"} onClick={() => buyTickets()}>Buy</button>}
          {!approved && <button className={approved === undefined ? "btn btn-loading float-right" : "btn btn-accent float-right"} onClick={() => enable()}>Enable</button>}
        </div>
      </div>
    </div>
  )
}

export default BetLottery
