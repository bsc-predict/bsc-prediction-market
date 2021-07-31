import { InjectedConnector } from '@web3-react/injected-connector'
import Web3 from 'web3'

const chainId = 56
const testNetChainId = 97

export const injected = new InjectedConnector({ supportedChainIds: [chainId, testNetChainId] })

export const getLibrary = (provider: Web3): Web3 => {
  return provider
}
