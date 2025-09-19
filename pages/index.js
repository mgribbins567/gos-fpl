import Head from "next/head";
import { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import homeStyles from "../styles/Home.module.css";
import Link from "next/link";
import Date from "../components/date";
import Tags from "../components/tags";
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
        <title>{siteTitle}</title>
      </Head>
      <h1>Game of Stones</h1>
      <ul className={homeStyles.postList}>
        <li className={homeStyles.postListItem}>
          <Link href="/live">Game of Stones Season 4</Link>
          <br />
          <small className={utilStyles.lightText}>
            Quick link to the current season!
          </small>
        </li>
      </ul>
      <h2>Featured Post</h2>
      <ul className={homeStyles.postList}>
        {featuredPost.map(({ id, date, title, summary, tags }) => (
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
            <small className={utilStyles.lightTextItalics}>
              <p>{summary}</p>
            </small>
          </li>
        ))}
      </ul>
      <h2>Recent Blog Posts</h2>
      <ul className={homeStyles.postList}>
        {allPostsData.map(({ id, date, title, summary, tags }) => (
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
            <small className={utilStyles.lightTextItalics}>
              <p>{summary}</p>
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
