import Head from "next/head";
import utilStyles from "../styles/utils.module.css";
import homeStyles from "../styles/Home.module.css";
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
    <div className={utilStyles.main}>
      <Head>
        <title>Blogs - Game of Stones</title>
      </Head>
      <h1>
        <p>Blog Posts</p>
      </h1>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <ul className={homeStyles.postList}>
          {allPostsData.map(({ id, date, title, tags }) => (
            <li className={homeStyles.postListItem} key={id}>
              <Link href={`/blog/${id}`}>{title}</Link>
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
  );
}
