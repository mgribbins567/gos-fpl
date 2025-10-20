import Head from "next/head";
import utilStyles from "../styles/utils.module.css";
import homeStyles from "../styles/Home.module.css";
import Date from "../lib/date";
import Tags from "../lib/tags";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSortedPostsData } from "../lib/posts";

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  var post = allPostsData.length - 1;
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
    <div className={homeStyles.home}>
      <Analytics />
      <SpeedInsights />
      <Head>
        <meta
          name="viewport"
          content="width=device-width  initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <title>Game of Stones</title>
      </Head>
      <h1>Game of Stones</h1>
      <a href="/live" className={homeStyles.link}>
        Live
        <br />
        <small className={utilStyles.lightText}>
          Quick link to the current season!
        </small>
      </a>
      <h2>Featured Post</h2>
      {featuredPost.map(({ id, date, title, summary, tags }) => (
        <a href={`/blog/${id}`} className={homeStyles.link}>
          {title}
          <br />
          <small className={utilStyles.lightText}>
            <Date dateString={date} />
          </small>
          <br />
          <small className={utilStyles.tagsLightText}>
            <Tags tagList={tags} />
          </small>
          <small className={utilStyles.lightTextItalics}>
            <p>{summary}</p>
          </small>
        </a>
      ))}
      <h2>Recent Blog Posts</h2>
      {allPostsData.map(({ id, date, title, summary, tags }) => (
        <a href={`/blog/${id}`} className={homeStyles.link}>
          {title}
          <br />
          <small className={utilStyles.lightText}>
            <Date dateString={date} />
          </small>
          <br />
          <small className={utilStyles.tagsLightText}>
            <Tags tagList={tags} />
          </small>
          <small className={utilStyles.lightTextItalics}>
            <p>{summary}</p>
          </small>
        </a>
      ))}
    </div>
  );
}
