import { getAllPostIds, getPostData } from "../../lib/posts";
import Head from "next/head";
import Date from "../../lib/date";

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export default function Post({ postData }) {
  return (
    <div>
      <Head>
        <meta
          name="viewport"
          content="width=device-width  initial-scale=1.0, maximum-scale=1.0, user-scalable=yes"
        />
        <title>{postData.title}</title>
      </Head>
      <div className="content-wrapper">
        <article className="blog-content">
          <h1>{postData.title}</h1>
          <div>
            <Date dateString={postData.date} />
          </div>
          <div
            // className={utilStyles.posts}
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
          />
        </article>
      </div>
    </div>
  );
}
