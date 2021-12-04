import { useWeb3React } from "@web3-react/core"
import { useRouter } from "next/router"
import React from "react"
import { getArchivedRounds } from "src/api"
import { enrichBets } from "src/utils/bets"
import Notification from "../../components/notifications"
import { UserConfigContext } from "../../contexts/UserConfigContext"
import { useAppSelector } from "../../hooks/reduxHooks"
import { getUserRounds } from "../../thunks/bet"
import { isAddress } from "../../utils/utils"
import RoundsTable from "../game/rounds/table"
import HistoricalInfo from "./info"

interface HistoryPageProps {
  account?: string
}

const HistoryPage: React.FunctionComponent<HistoryPageProps> = (props) => {
  const { account: pageAccount } = props
  
  const [page, setPage] = React.useState(0)
  const [showRounds, setShowRounds] = React.useState<Round[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [account, setAccount] = React.useState<string | undefined>()
  const [unenrichedUserBets, setUnenrichedUserBets] = React.useState<Bet[]>([])
  const [userBets, setUserBets] = React.useState<Bet[]>([])
  const [rounds, setRounds] = React.useState<Round[]>([])
  const [evenMoney, setEvenMoney] = React.useState(false)

  const router = useRouter()
  const { account: userAccount } = useWeb3React()
  const { a: pathAccount } = router.query

  const { showRows } = React.useContext(UserConfigContext)

  const bufferSeconds = useAppSelector(s => s.game.bufferSeconds)
  const intervalSeconds = useAppSelector(s => s.game.intervalSeconds)
  const block = useAppSelector(s => s.game.block)
  const library = useAppSelector(s => s.game.library)
  const game = useAppSelector(s => s.game.game)

  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const a = typeof pathAccount === "string" ? pathAccount : pageAccount || userAccount
    setAccount(a || undefined)
  }, [pathAccount, userAccount, pageAccount])

  React.useEffect(() => {
    if (!account) {
      setShowRounds([])
    }
  }, [account])

  React.useEffect(() => {
    if (game) {
      getArchivedRounds({ latest: false, game }).then(r => setRounds(r))
    }
  }, [game])

  React.useEffect(() => {
    if (account && game && library && rounds.length > 0) {
      setIsLoading(true)
      getUserRounds({ library, game, account, latest: false }).then(bets => {
        setUnenrichedUserBets(bets)
        setIsLoading(false)
      })
    }
  }, [account, game, library, rounds])

  React.useEffect(() => {
    const enriched = enrichBets({ bets: unenrichedUserBets, rounds, block, bufferSeconds, intervalSeconds, evenMoney })
    setUserBets(enriched)
  }, [block, bufferSeconds, evenMoney, intervalSeconds, rounds, unenrichedUserBets])

  const handleSetAccount = React.useCallback((a: string) => {
    setAccount(a)
  }, [])

  const handleSetEvenMoney = React.useCallback((b: boolean) => setEvenMoney(b), [])

  React.useEffect(() => {
    const epochs = new Set(userBets.map(b => b.epoch))
    const start = page * showRows

    const show = rounds
      .filter(r => epochs.has(r.epoch))
      .sort((r1, r2) => r2.epochNum < r1.epochNum ? -1 : 1)
      .slice(start, start + showRows)
    setShowRounds(show)
  }, [userBets, rounds, page, showRows])

  const handleSetPage = React.useCallback((p: number) => setPage(p), [])

  let message: JSX.Element | null = null
  const numPages = Math.floor((rounds.length - 1) / showRows)

  if (!isLoading && !account) {
    message =
      <Notification
        type="error"
        title="Error"
        absolute={false}
        message="No account provided. Login or provide account in the account text field above"
      />
  } else if (!isLoading && showRounds.length === 0) {
    message =
      <Notification
        type="info"
        title="No bets made"
        absolute={false}
        message={`Account ${account} has not made any bets`}
      />
  } else if (account && !isAddress(account)) {
    message =
      <Notification
        type="error"
        title="Error"
        absolute={false}
        message="Invalid account"
      />
  }
  return (
    <div ref={ref}>
      <HistoricalInfo
        bets={userBets}
        account={account || ""}
        changeAccount={handleSetAccount}
        evenMoney={evenMoney}
        setEvenMoney={handleSetEvenMoney}
      />
      {message}
      {isLoading ? <div>Loading...</div> :
        <RoundsTable
          rounds={showRounds}
          setPage={handleSetPage}
          page={page}
          bets={userBets}
          numPages={numPages}
        />
      }
    </div>
  )
}

export default HistoryPage
