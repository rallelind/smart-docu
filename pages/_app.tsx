import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"
import { QueryClientProvider, QueryClient } from 'react-query';
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  pageProps
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {

  const queryClient = new QueryClient()

  const getLayout = Component.getLayout || ((page) => page)

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={pageProps.session}>
        {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    </QueryClientProvider>
  )
}

export default MyApp
