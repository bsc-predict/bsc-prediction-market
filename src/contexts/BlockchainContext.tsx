import React from "react"
import Web3 from "web3"

export type Chain = "main" | "test"

const Rpc = {
  prod: "https://bsc-dataseed1.binance.org:443",
  test: "https://data-seed-prebsc-2-s1.binance.org:8545/"
}

interface IBlockchainContext {
  chain: Chain,
  setChain: (c: Chain) => void,
  web3Provider: () => Web3
}

const BlockchainContext = React.createContext<IBlockchainContext>({
  chain: "main",
  setChain: () => {/**/},
  web3Provider: () => new Web3(Rpc.prod)
})

const BlockchainContextProvider: React.FunctionComponent = ({ children }) => {
  const [chain, setChain] = React.useState<Chain>("main")

  const handleSetChain = React.useCallback((c: Chain) => setChain(c), [])

  const web3Provider = React.useCallback(() => {
    const rpc = chain === "test" ? Rpc.test : Rpc.prod
    return new Web3(rpc)
  }, [chain])

  return <BlockchainContext.Provider value={{ chain, setChain: handleSetChain, web3Provider }}>{children}</BlockchainContext.Provider>
}
  
export { BlockchainContext, BlockchainContextProvider }
