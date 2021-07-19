import React from 'react'
import Web3 from 'web3'
import { useWeb3React } from '@web3-react/core'
import web3NoAccount from "../utils/web3"

/**
 * Provides a web3 instance using the provider provided by useWallet
 * with a fallback of an httpProver
 * Recreate web3 instance only if the provider change
 */
const useWeb3 = () => {
  const { library } = useWeb3React()
  const refEth = React.useRef(library)
  const [web3, setweb3] = React.useState(library ? new Web3(library) : web3NoAccount)

  React.useEffect(() => {
    if (library !== refEth.current) {
      setweb3(library ? new Web3(library) : web3NoAccount)
      refEth.current = library
    }
  }, [library])

  return web3
}

export default useWeb3
