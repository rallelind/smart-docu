import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"
import { QueryClientProvider, QueryClient } from 'react-query';


function MyApp({ Component, pageProps }) {

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
