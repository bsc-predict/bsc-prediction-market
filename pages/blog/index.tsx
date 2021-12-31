import Link from 'next/link'
import React from 'react'
import { getAllPosts } from '../../api'
import AppWrapper from '../../src/wrapper'

interface BlogProps {
  posts: Array<{ slug: string, title: string, date: string }>
  description: string
  title: string
}

const Blog: React.FunctionComponent<BlogProps> = (props) => {
  const sortedPosts = props.posts.sort((a, b) => a.date < b.date ? 1 : -1)
  return (
    <AppWrapper title="BSC Predict - Blog" description="Binance Smart Chain (BSC) Prediction Markets Blog">
      <div className="space-y-4 p-6" title={props.title} >
        <p className="text-4xl">BSC Prediction Market Insights &amp; Analysis</p>
        <div className="divider" />
        <ul className="space-y-4">
          {props.posts.map((post, idx) => {
            return (
              <li key={idx} >
                <Link href={'/blog/' + post.slug}>
                  <a className="text-2xl hover:font-bold">{post.title}</a>
                </Link>
                <div className="text-xs">Published {post.date}</div>
              </li>
            )
          })}
        </ul>
      </div>
    </AppWrapper>
  )
}

export async function getStaticProps() {
  const allPosts = await getAllPosts()
  return {
    props: {
      posts: allPosts,
      description: "Strategy and more"
    }
  }
}

export default Blog