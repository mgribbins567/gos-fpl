import Head from "next/head";
import utilStyles from "../styles/utils.module.css";
import homeStyles from "../styles/Home.module.css";
import { getSortedPostsData } from "../lib/posts";
import Date from "../lib/date";
import Tags from "../lib/tags";

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
    <div className={homeStyles.homePage}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width  initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>Blogs - Game of Stones</title>
      </Head>
      <h1>
        <p>Blog Posts</p>
      </h1>
      <hr style={{ width: "100%" }} />
      <br />
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        {allPostsData.map(({ id, date, title, tags }) => (
          <a href={`/blog/${id}`} className={homeStyles.blogLink} key={id}>
            {title}
            <br />
            <small className={utilStyles.lightText}>
              <Date dateString={date} />
            </small>
            <br />
            <small className={utilStyles.tagsLightText}>
              <Tags tagList={tags} />
            </small>
          </a>
        ))}
      </section>
    </div>
  );
}
