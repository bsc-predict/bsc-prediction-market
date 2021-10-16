import React from "react";
import { getAllPosts, getPostBySlug } from "../../api";
import BlogPostPage from "../../src/blog/post";
import AppWrapper from "../../src/wrapper";

interface PostProps {
  title: string
  content: string
}

const Post: React.FunctionComponent<PostProps> = (props) => {
  return (
    <AppWrapper title="BSC Predictions Blog" description="Binance Smart Chain (BSC) Prediction Markets Blog">
      <BlogPostPage title={props.title} content={props.content} />
    </AppWrapper>
  )
}

export async function getStaticProps(context: { params: { slug: string } }) {
  return {
    props: await getPostBySlug(context.params.slug)
  }
}

export async function getStaticPaths() {
  const paths = await getAllPosts().then(posts => posts.map(post => ({ params: { slug: post.slug } })))
  return {
    paths: paths,
    fallback: false
  }
}

export default Post