import "@mantine/core/styles.css";

import Navbar from "../components/Navbar/Navbar";
import { MantineProvider } from "@mantine/core";
import "../styles/global.css";

export default function App({ Component, pageProps }) {
  return (
    <MantineProvider defaultColorScheme="dark">
      <Navbar /> {}
      <main className="page-container">
        {" "}
        {} <Component {...pageProps} />
      </main>
    </MantineProvider>
  );
}
