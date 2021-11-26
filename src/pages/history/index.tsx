import { useWeb3React } from "@web3-react/core"
import { useRouter } from "next/router"
import React from "react"
import { getArchivedRounds } from "src/api"
import { enrichBets } from "src/utils/bets"
import Notification from "../../components/notifications"
import { UserConfigContext } from "../../contexts/UserConfigContext"
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks"
import { getUserRounds } from "../../thunks/bet"
import { fetchArchivedRounds } from "../../thunks/round"
import { isAddress } from "../../utils/utils"
import RoundsTable from "../game/rounds/table"
import HistoricalInfo from "./info"


const HistoryPage: React.FunctionComponent = () => {
  const [page, setPage] = React.useState(0)
  const [showRounds, setShowRounds] = React.useState<Round[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [account, setAccount] = React.useState<string | undefined>()
  const [unclaimed, setUnclaimed] = React.useState(false)
  const [userBets, setUserBets] = React.useState<Bet[]>([])
  const [rounds, setRounds] = React.useState<Round[]>([])

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
    const a = typeof pathAccount === "string" ? pathAccount : userAccount
    setAccount(a || undefined)
  }, [pathAccount, userAccount])

  React.useEffect(() => {
    if (!account) {
      setShowRounds([])
    }
  }, [account])

  React.useEffect(() => {
    if (game) {
      getArchivedRounds({latest: false, game}).then(r => setRounds(r))
    }

  }, [game])

  React.useEffect(() => {
    if (account && game && library && rounds.length > 0) {
      getUserRounds(library, game, account).then(bets => {
        const enriched = enrichBets({ bets, rounds, block, bufferSeconds, intervalSeconds })
        setUserBets(enriched)
        setIsLoading(false)
      })
    }
  }, [account, block, bufferSeconds, game, intervalSeconds, library, rounds])

  const handleSetAccount = React.useCallback((a: string) => {
    setIsLoading(true)
    setAccount(a)
  }, [])

  const handleSetUnclaimed = React.useCallback((b: boolean) => setUnclaimed(b), [])

  React.useEffect(() => {
    const epochs = new Set(userBets.map(b => b.epoch))
    const unclaimedRounds = new Set(userBets.filter(b => b.status === "claimable").map(b => b.epoch))
    const start = page * showRows

    const show = rounds
      .filter(r => epochs.has(r.epoch))
      .filter(r => unclaimed === false || unclaimedRounds.has(r.epoch))
      .sort((r1, r2) => r2.epochNum < r1.epochNum ? -1 : 1)
      .slice(start, start + showRows)
    setShowRounds(show)
  }, [userBets, rounds, page, showRows, unclaimed])

  const handleSetPage = React.useCallback((p: number) => setPage(p), [])

  let message: JSX.Element | null = null
  const numPages = unclaimed ?
    Math.floor((userBets.filter(b => b.status === "claimable").length - 1) / showRows) :
    Math.floor((rounds.length - 1) / showRows)

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
        title={unclaimed ? "No unclaimed bets" : "No bets made"}
        absolute={false}
        message={`Account ${account} has ${unclaimed ? "no unclaimed bets" : "not made any bets"}`}
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
        unclaimed={userAccount === account ? unclaimed : undefined}
        setUnclaimed={handleSetUnclaimed}
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
