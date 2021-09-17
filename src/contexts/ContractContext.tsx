import { useWeb3React } from "@web3-react/core"
import React from "react"
import Web3 from "web3"
import predictionAbi from "../contracts/prediction_abi.json"
import oracleAbi from "../contracts/oracle_abi.json"
import type {AbiItem} from "web3-utils"
import { PredictionAddress, toRound } from "../contracts/prediction"
import { OracleAddresses } from "../contracts/oracle"
import axios from "axios"
import { csvToJson } from "../api/utils"
import { NotificationsContext } from "./NotificationsContext"

export type Chain = "main" | "test"


const Urls = {
  rpc: {
    main: "https://bsc-dataseed1.binance.org:443",
    test: "https://data-seed-prebsc-2-s1.binance.org:8545/"  
  },
  bets: {
    main: (address: string) => `https://jkfwxgcdmc.execute-api.us-east-1.amazonaws.com/dev/main/bets/${address}`,
    test: (address: string) => `https://jkfwxgcdmc.execute-api.us-east-1.amazonaws.com/dev/test/bets/${address}`,
  },
  bnbPrice: {
    main: "https://api1.binance.com/api/v3/ticker/price?symbol=BNBUSDT",
    test: "https://api1.binance.com/api/v3/ticker/price?symbol=BNBUSDT",
  },
  latestRounds: {
    main: "https://raw.githubusercontent.com/bsc-predict/bsc-predict-updater/master/data/main/latest.csv",
    test: "https://raw.githubusercontent.com/bsc-predict/bsc-predict-updater/master/data/test/latest.csv",
  },
  allRounds: {
    main: "https://raw.githubusercontent.com/bsc-predict/bsc-predict-updater/master/data/main/rounds.csv",
    test: "https://raw.githubusercontent.com/bsc-predict/bsc-predict-updater/master/data/test/rounds.csv",
  },
}


export interface PredictionConstants {
  bufferBlocks: number
  rewardRate: number
  intervalBlocks: number
}

const initialConstants = {
  bufferBlocks: 20,
  rewardRate: 0.97,
  intervalBlocks: 100
}

interface IContractContext {
  constants: PredictionConstants
  makeBet: (b: BetType, eth: number, onSent: () => void, onConfirmed: () => void, onError: (e?: Error) => void) => Promise<void>
  claim: (epoch: string, onSent: () => void, onConfirmed: () => void, onError: (e?: Error) => void) => Promise<void>
  fetchBalance: (a: string) => Promise<Balance>
  fetchCurrentEpoch: () => Promise<string>
  fetchGamePaused: () => Promise<boolean>
  fetchRounds: (epochs: Array<string | number>) => Promise<Round[]>
  fetchLatestRounds: (n: number, skip: string[]) => Promise<Round[]>
  fetchLatestOracleRound: () => Promise<Oracle>
  fetchBets: (a: string) => Promise<{claimed: Set<number>, bets: Bet[]}>
  fetchBnbPrice: () => Promise<number>
  fetchArchivedRounds: (latest: boolean) => Promise<Round[]>
  fetchBlockNumber: () => Promise<number>
  chain: Chain
}

const ContractContext = React.createContext<IContractContext>({
  constants: initialConstants,
  makeBet: () => Promise.reject(),
  claim: () => Promise.reject(),
  fetchBalance: () => Promise.reject(),
  fetchCurrentEpoch: () => Promise.reject(),
  fetchGamePaused: () => Promise.reject(),
  fetchRounds: () => Promise.reject(),
  fetchLatestRounds: () => Promise.reject(),
  fetchLatestOracleRound: () => Promise.reject(),
  fetchBets: () => Promise.reject(),
  fetchBnbPrice: () => Promise.reject(),
  fetchArchivedRounds: () => Promise.reject(),
  fetchBlockNumber: () => Promise.reject(),
  chain: "main",
})

const ContractContextProvider: React.FunctionComponent<{chain: Chain}> = ({ children, chain }) => {
  const [constants, setConstants] = React.useState<PredictionConstants>(initialConstants)

  const { setMessage } = React.useContext(NotificationsContext)
  const { library, account } = useWeb3React()

  // initialize the contract constants
  React.useEffect(() => {
    const web3 = web3Provider()
    const address = PredictionAddress[chain]
    const contract = new web3.eth.Contract(predictionAbi as AbiItem[], address)
    const b = contract.methods.bufferBlocks().call() as Promise<string>
    const r = contract.methods.rewardRate().call() as Promise<string>
    const i = contract.methods.intervalBlocks().call() as Promise<string>
    Promise.all([b, r, i]).then(([b, r, i]) => {
      setConstants({bufferBlocks: Number(b), rewardRate: Number(r), intervalBlocks: Number(i)})
    })
  }, [chain])

  const web3Provider = React.useCallback(() => {
    const rpc = chain === "test" ? Urls.rpc.test : Urls.rpc.main
    return new Web3(rpc)
  }, [chain])


  const fetchBalance = React.useCallback(async (account: string): Promise<Balance> => {
    const web3 = web3Provider()

    const bnbPrice = await fetchBnbPrice()
    const balance = web3.eth.getBalance(web3.utils.toChecksumAddress(account))
  
    return Promise.all([bnbPrice, balance])
      .then(([price, bal]) => {
        const balanceEth = web3.utils.fromWei(bal, "ether")
        const balanceUsd = Number(balanceEth) * price
        return{balance: bal, balanceUsd, balanceEth, bnbPrice: price}
      })
  }, [web3Provider])
  
  const makeBet = React.useCallback(async (
    direction: BetType,
    eth: number,
    onSent: () => void,
    onConfirmed: () => void,
    onError: (error: Error | undefined) => void
  ) => {
    const address = PredictionAddress[chain]
    const web3 = new Web3(library)
    const value = web3.utils.toWei(eth.toString(), "ether")
    const betMethod = direction === "bull" ? "betBull" : "betBear"
    const contract = new web3.eth.Contract(predictionAbi as AbiItem[], address)
    return contract.methods[betMethod]()
      .send({ from: account, value })
      .once('sent', onSent)
      .once('confirmation', onConfirmed)
      .once('error', onError)
  }, [library, account])
  
  const claim = React.useCallback(async (
    epoch: string,
    onSent: () => void,
    onConfirmed: () => void,
    onError: (e: Error | undefined) => void
  ) => {
    const web3 = new Web3(library)
    const address = PredictionAddress[chain]
    const contract = new web3.eth.Contract(predictionAbi as AbiItem[], address)
    return contract.methods.claim(epoch)
      .send({from: account})
      .once('sending', onSent)
      .once('confirmation', onConfirmed)
      .once('error', onError)
  }, [library, account])

  const fetchCurrentEpoch = React.useCallback(async (): Promise<string> => {
    // console.log('fetching current epoch')
    const web3 = web3Provider()
    const address = PredictionAddress[chain]
    const contract = new web3.eth.Contract(predictionAbi as AbiItem[], address)
    return contract.methods.currentEpoch().call()
  }, [])

  const fetchGamePaused = React.useCallback(async (): Promise<boolean> => {
    // console.log('fetching paused')
    const web3 = web3Provider()
    const address = PredictionAddress[chain]
    const contract = new web3.eth.Contract(predictionAbi as AbiItem[], address)
    return contract.methods.paused().call()
  }, [])

  const fetchRounds = React.useCallback(async (epochs: Array<string | number>): Promise<Round[]> => {
    const web3 = web3Provider()
    const address = PredictionAddress[chain]
    const contract = new web3.eth.Contract(predictionAbi as AbiItem[], address)
  
    const rounds = epochs.map(async epoch => {
      const r = await contract.methods.rounds(epoch.toString()).call() as Object
      return toRound(r as RoundResponse)
    })
    return await Promise.all(rounds)
  }, [])

  const fetchLatestRounds = React.useCallback(async (n: number, skip: string[]): Promise<Round[]> => {  
    // console.log(`fetching latest rounds ${n} ${skip}`)
    const web3 = web3Provider()
    const address = PredictionAddress[chain]
    const contract = new web3.eth.Contract(predictionAbi as AbiItem[], address)
    const skipSet = new Set(skip)
    const epoch = await contract.methods.currentEpoch().call()
    const epochs = Array.from(Array(n).keys()).map(offset => `${epoch - offset}`).filter(e => !skipSet.has(e) && Number(e) >= 0)
    return fetchRounds(epochs)
  }, [fetchRounds])

  const fetchLatestOracleRound = React.useCallback(async (): Promise<Oracle> => {
    // console.log(`fetching latest oracle`)
    const web3 = web3Provider()
    const address = OracleAddresses[chain]
    const contract = new web3.eth.Contract(oracleAbi as AbiItem[], address)
    const o = await contract.methods.latestRoundData().call()
    return o
  }, [])
  
  const fetchBets = React.useCallback(async (address: string) => {
    // console.log('fetching bets')
    const web3 = web3Provider()
    const url = Urls.bets[chain](web3.utils.toChecksumAddress(address))
    return axios.get(url)
      .then((res: {data: BetResponse}) => {
        const bets: Bet[] = res.data.bets.map(b => ({
          ...b,
          valueNum: Number(b.value),
          valueEthNum: Number(web3.utils.fromWei(b.value, "ether")),
          blockNumberNum: Number(b.blockNumber),
        }))
        const claimed = new Set(res.data.claimed)
        return {bets, claimed}
      })
      .catch(() => {
        setMessage({type: "error", title: "Failed to fetch bets", duration: 5000})
        return {bets: [], claimed: new Set<number>()}
      })
  }, [])
  
  const fetchBnbPrice = React.useCallback(async (): Promise<number> => {
    // console.log('fetching bnb price')
    const url = Urls.bnbPrice[chain]
    const res = await axios.get(url)
    return res.data.price
  }, [])
  
  const fetchArchivedRounds = React.useCallback(async (latest: boolean): Promise<Round[]> => {
    const url = latest ? Urls.latestRounds[chain] : Urls.allRounds[chain]
    const res = await axios.get(url)
    const roundResponse = csvToJson(res.data) as RoundResponse[]
    return roundResponse.map(toRound)
  }, [])

  const fetchBlockNumber = React.useCallback(() => {
    // console.log('fetching block number')
    const web3 = web3Provider()
    return web3.eth.getBlockNumber()
  }, [])
  

  return <ContractContext.Provider value={{
    constants,
    makeBet,
    claim,
    fetchBalance,
    fetchCurrentEpoch,
    fetchGamePaused,
    fetchRounds,
    fetchLatestRounds,
    fetchLatestOracleRound,
    fetchBets,
    fetchBnbPrice,
    fetchArchivedRounds,
    fetchBlockNumber,
    chain,
  }}>{children}</ContractContext.Provider>
}
  
export { ContractContext, ContractContextProvider }
