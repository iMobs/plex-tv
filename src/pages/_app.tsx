import type { AppProps } from 'next/app';
import type { EmotionCache } from '@emotion/cache';
import { CacheProvider, ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import Head from 'next/head';
import createEmotionCache from 'utils/createEmotionCache';
import theme from 'utils/theme';

declare module 'next/app' {
  interface AppInitialProps {
    emotionCache?: EmotionCache;
    pageProps: any;
  }
}

const clientCache = createEmotionCache();

function MyApp({ Component, emotionCache = clientCache, pageProps }: AppProps) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Plex TV</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="TV stations from Plex" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
