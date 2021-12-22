import '../styles/globals.css'
import { SessionProvider } from "next-auth/react"
import { RecoilRoot } from 'recoil';
import Head from 'next/head';
import NProgress from 'nprogress';
import Router from 'next/router';
import Layout from '../components/Layout/Layout';

function MyApp({ Component, pageProps : { session, ...pageProps } }) {

  
  NProgress.configure({ showSpinner: false });

  Router.events.on('routeChangeStart', () => {
    NProgress.start();
  });

  Router.events.on('routeChangeComplete', () => {
    NProgress.done();
  });
  return (
  <SessionProvider session={session}>
    <Head>
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css' integrity='sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ==' crossOrigin='anonymous' referrerPolicy='no-referrer' />
    </Head>
    <RecoilRoot>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RecoilRoot>
  </SessionProvider>

    )
}

export default MyApp
