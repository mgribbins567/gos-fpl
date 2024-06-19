import Head from "next/head";
import Layout from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";
import Date from "../components/date";

export default function About() {
  return (
    <Layout about>
      <Head>
        <title>About - Game of Stones</title>
      </Head>
      <h1>
        <p>Welcome to my blog!</p>
      </h1>
      <div className={utilStyles.about}>
        My name is Matthew and this is my blog that accompanies a FPL league
        that I run called the Game of Stones (named after John Stones,
        Manchester City)! This is where I will catalog things like
        announcements, weekly updates, and other posts about things I find
        interesting!
      </div>
      <div className={utilStyles.about}>
        If you'd like to contact me, feel free to message me on Discord, email,
        or text me! I'd be more than happy to chat about anything I've written
        here or answer any questions you may have.
      </div>
    </Layout>
  );
}
