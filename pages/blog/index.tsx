import Link from 'next/link'
import React from 'react'
import { flatten, uniqBy } from 'src/utils/utils'
import { getAllPosts } from '../../api'
import AppWrapper from '../../src/wrapper'

interface BlogProps {
  posts: Array<{ slug: string, title: string, date: string, tags: string[], sticky: boolean }>
  description: string
  title: string
}

const Blog: React.FunctionComponent<BlogProps> = (props) => {
  const [activeTag, setActiveTag] = React.useState<string | undefined>(undefined)
  const [posts, setPosts] = React.useState(props.posts)

  React.useEffect(() => {
    if (activeTag) {
      setPosts(props.posts.filter(p => p.tags.some(t => t === activeTag)))
    } else {
      setPosts(props.posts)
    }
  }, [activeTag])

  const tags = uniqBy(flatten(props.posts.map(p => p.tags)), f => f)

  return (
    <AppWrapper title="BSC Predict - Blog" description="Binance Smart Chain (BSC) Prediction Markets Blog">
      <div className="space-y-4 p-6" title={props.title} >
        <p className="text-4xl">BSC Prediction Market Insights &amp; Analysis</p>
        <div className="divider" />
        <div className="flex space-x-4 items-center">
          <div className="text-xl font-bold">Tags</div>
          <div className="divider divider-vertical"/>
          <div>
            {tags.map(tag =>
              <button className={tag === activeTag ? "btn btn-primary" : "btn"} onClick={() => setActiveTag(t => t === tag ? undefined : tag)}>{tag}</button>)}
          </div>
        </div>
        <div className="divider" />
        <ul className="space-y-4">
          {posts.map((post, idx) => {
            return (
              <li key={idx} >
                <Link href={'/blog/' + post.slug}>
                  <a className="text-2xl hover:font-bold">{post.sticky && "📎"} {post.title}</a>
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