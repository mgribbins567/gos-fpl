import "../styles/global.css";
import Navbar from "../components/Navbar";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar /> {}
      <main className="page-container">
        {" "}
        {} <Component {...pageProps} />
      </main>
    </>
  );
}
