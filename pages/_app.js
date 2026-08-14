import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";

import Head from "next/head";
import { createTheme, MantineProvider, AppShell } from "@mantine/core";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../styles/global.css";
import { NewNavbar } from "../components/Navbar/Navbar";

const theme = createTheme({
  colors: {
    "deep-blue": [
      "#ecefff",
      "#d5dafb",
      "#a9b1f1",
      "#7a87e9",
      "#5362e1",
      "#3a4bdd",
      "#2c40dc",
      "#1f32c4",
      "#182cb0",
      "#0a259c",
    ],
  },
  autoContrast: true,
  defaultRadius: "md",
  primaryColor: "deep-blue",
  primaryShade: 4,
});

export default function App({ Component, pageProps }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Analytics />
      <SpeedInsights />
      <AppShell
        padding="md"
        header={{ height: { base: 0, sm: 40, lg: 50 } }}
        footer={{ height: { base: 80, sm: 0 } }}
      >
        <AppShell.Header bg="deep-blue.5" visibleFrom="sm">
          <NewNavbar />
        </AppShell.Header>
        <AppShell.Main
          style={{
            width: "100vw",
            maxWidth: "100%",
            paddingLeft: "0",
            paddingRight: "0",
          }}
        >
          <Head>
            <meta
              name="viewport"
              content="width=device-width  initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
            />
            <title>Game of Stones</title>
          </Head>
          <Component {...pageProps} />
        </AppShell.Main>
        <AppShell.Footer bg="deep-blue.5" hiddenFrom="sm">
          <NewNavbar />
        </AppShell.Footer>
      </AppShell>
    </MantineProvider>
  );
}
