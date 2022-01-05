import Link from "next/link"
import React from "react"

interface BlogPostPageProps {
  title: string
  published: string
  content: string
}

const BlogPostPage: React.FunctionComponent<BlogPostPageProps> = (props) => {
  const { title, published, content } = props
  return (
    <div className="p-4 overflow-auto">
      <div className="flex items-center space-x-4">
        <div>
          <Link href="/blog" >
            <a className="text-2xl">← Blog</a>
          </Link>
        </div>

      </div>
      <div className="divider" />
      <div className="flex flex-col items-center ">
        <h1 className="text-2xl font-bold underline">{title}</h1>
        <div className="text-sm">Published: {props.published}</div>
        <div className="divider" />
        <article className="max-w-6xl w-full text-xl leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>
      </div>
    </div>
  )
}

export default BlogPostPage