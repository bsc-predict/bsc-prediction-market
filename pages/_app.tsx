import type { AppProps /*, AppContext */ } from 'next/app'
import React from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { getLibrary } from '../src/utils/web3React'
import 'tailwindcss/tailwind.css'
import { RefreshContextProvider } from '../src/contexts/RefreshContext'
import { NotificationsContextProvider } from '../src/contexts/NotificationsContext'
import { UserConfigContextProvider } from '../src/contexts/UserConfigContext'

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <UserConfigContextProvider>
      <NotificationsContextProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <RefreshContextProvider>
              <Component {...pageProps} />
            </RefreshContextProvider>
        </Web3ReactProvider>
      </NotificationsContextProvider>
    </UserConfigContextProvider>
  )
}

export default MyApp
