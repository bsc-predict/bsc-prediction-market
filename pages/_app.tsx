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
import { UserConfigContextProvider } from '../src/contexts/UserConfigContext'
import { NotificationsContextProvider } from '../src/contexts/NotificationsContext'
import { ModalContextProvider } from '../src/contexts/ModalContext'

function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <UserConfigContextProvider>
      <NotificationsContextProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <RefreshContextProvider>
            <AccountContextProvider>
              <BlockContextProvider>
                <RoundsContextProvider>
                  <OracleContextProvider>
                    <BetsContextProvider>
                      <ModalContextProvider>
                        <Component {...pageProps} />
                      </ModalContextProvider>
                    </BetsContextProvider>
                  </OracleContextProvider>
                </RoundsContextProvider>
              </BlockContextProvider>
            </AccountContextProvider>
          </RefreshContextProvider>
        </Web3ReactProvider>
      </NotificationsContextProvider>
    </UserConfigContextProvider>
  )
}

export default MyApp
