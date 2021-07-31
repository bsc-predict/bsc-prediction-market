import type { AppProps /*, AppContext */ } from 'next/app'
import React from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { getLibrary } from '../src/utils/web3React'
import 'tailwindcss/tailwind.css'
import { RefreshContextProvider } from '../src/contexts/RefreshContext'
import { BlockContextProvider } from '../src/contexts/BlockContext'
import { RoundsContextProvider } from '../src/contexts/RoundsContext'
import { BetsContextProvider } from '../src/contexts/BetsContext'
import { OracleContextProvider } from '../src/contexts/OracleContext'
import { AccountContextProvider } from '../src/contexts/AccountContext'
import { NotificationsContextProvider } from '../src/contexts/NotificationsContext'
import { UserConfigContextProvider } from '../src/contexts/UserConfigContext'
import { BlockchainContextProvider } from '../src/contexts/BlockchainContext'

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <UserConfigContextProvider>
      <NotificationsContextProvider>
        <BlockchainContextProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <RefreshContextProvider>
              <AccountContextProvider>
                <BlockContextProvider>
                  <RoundsContextProvider>
                    <OracleContextProvider>
                      <BetsContextProvider>
                        <Component {...pageProps} />
                      </BetsContextProvider>
                    </OracleContextProvider>
                  </RoundsContextProvider>
                </BlockContextProvider>
              </AccountContextProvider>
            </RefreshContextProvider>
          </Web3ReactProvider>
        </BlockchainContextProvider>
      </NotificationsContextProvider>
    </UserConfigContextProvider>
  )
}

export default MyApp
