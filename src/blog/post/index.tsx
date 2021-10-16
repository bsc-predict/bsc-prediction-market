import Link from "next/link"
import React from "react"

interface BlogPostPageProps {
  title: string
  content: string
}

const BlogPostPage: React.FunctionComponent<BlogPostPageProps> = (props) => {
  const { title, content } = props
  return (
    <div className="p-4">
      <div className="flex items-center space-x-4">
        <div><Link href="/blog" ><a className="text-xl">←</a></Link></div>
        <h1 className="text-2xl">{title}</h1>
      </div>
      <div className="divider" />
      <article className="max-w-6xl text-xl leading-relaxed">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </div>
  )
}

export default BlogPostPage