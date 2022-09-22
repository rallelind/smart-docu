import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"
import { QueryClientProvider, QueryClient } from 'react-query';


function MyApp({ Component, pageProps }) {

  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  )
}

export default MyApp
