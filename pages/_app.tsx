import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

import { SessionProvider } from "next-auth/react";
import { createTheme, ThemeProvider } from "@mui/material";
import { SWRConfig } from "swr";
import { Session } from "next-auth";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#084d62",
    },
    secondary: {
      main: "#d2d2d2",
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#084d62",
    },
  },
});

export default function App({
  Component,
  pageProps,
}: AppProps<{ session: Session }>) {
  return (
    <ThemeProvider theme={lightTheme}>
      <Head>
        <title>Sumz Shop</title>
      </Head>
      <SWRConfig
        value={{
          fetcher: (url: string) =>
            fetch(url).then((response) => response.json()),
        }}
      >
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </SWRConfig>
    </ThemeProvider>
  );
}
