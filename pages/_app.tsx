import type { AppProps /*, AppContext */ } from 'next/app'
import React from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { getLibrary } from '../src/utils/web3React'
import 'tailwindcss/tailwind.css'
import { RefreshContextProvider } from '../src/contexts/RefreshContext'
import { NotificationsContextProvider } from '../src/contexts/NotificationsContext'
import { UserConfigContextProvider } from '../src/contexts/UserConfigContext'
import { Provider } from 'react-redux'
import { store } from '../src/stores'

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <Provider store={store}>
      <UserConfigContextProvider>
        <NotificationsContextProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <RefreshContextProvider>
                <Component {...pageProps} />
              </RefreshContextProvider>
          </Web3ReactProvider>
        </NotificationsContextProvider>
      </UserConfigContextProvider>
    </Provider>
  )
}

export default MyApp
