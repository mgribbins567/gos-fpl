import Head from "next/head";
import Layout from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";
import { getSortedPostsData } from "../lib/posts";
import Date from "../components/date";
import Tags from "../components/tags";

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Blog({ allPostsData }) {
  return (
    <Layout blog>
      <div className={utilStyles.main}>
        <Head>
          <title>Blogs - Game of Stones</title>
        </Head>
        <h1>
          <p>Blog Posts</p>
        </h1>
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <ul className={utilStyles.list}>
            {allPostsData.map(({ id, date, title, tags }) => (
              <li className={utilStyles.listItem} key={id}>
                <Link href={`/posts/${id}`}>{title}</Link>
                <br />
                <small className={utilStyles.lightText}>
                  <Date dateString={date} />
                </small>
                <br />
                <small className={utilStyles.tagsLightText}>
                  <Tags tagList={tags} />
                </small>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Layout>
  );
}
