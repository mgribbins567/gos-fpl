import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";
import { getSortedPostsData } from "../lib/posts";
import Date from "../components/date";

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  var post = allPostsData.length - 4;
  const featuredPost = allPostsData.slice(post, post + 1);
  allPostsData.length = 3;
  return {
    props: {
      allPostsData,
      featuredPost,
    },
  };
}

export default function Home({ allPostsData, featuredPost }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingLg}>
        <h1>Game of Stones</h1>
      </section>
      <small className={utilStyles.subtitle}>
        A Fantasy Premier League Blog
      </small>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Featured Post</h2>
        <ul className={utilStyles.list}>
          {featuredPost.map(({ id, date, title, summary }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
              <small className={utilStyles.lightTextItalics}>
                <p>{summary}</p>
              </small>
            </li>
          ))}
        </ul>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Recent Blog Posts</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title, summary }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
              <small className={utilStyles.lightTextItalics}>
                <p>{summary}</p>
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
