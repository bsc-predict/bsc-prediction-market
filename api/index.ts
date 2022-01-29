// api/index.js
import matter from 'gray-matter'
import { marked } from 'marked'

export async function getAllPosts() {
  const context = require.context('../_posts', false, /\.md$/)
  const posts = []
  const postNames = new Set(
    context.keys().map(k => k.replace(/.*\//g, "")))
  for (const key of postNames) {
    const post = key
    const content = await import(`../_posts/${post}`);
    const meta = matter(content.default)
    posts.push({
      slug: post.replace('.md', ''),
      title: meta.data.title,
      date: meta.data.date,
      sticky: meta.data.sticky ? true : false,
      tags: meta.data.tags?.split(",") || []
    })
  }
  return posts.sort((p1, p2) => p1.date < p2.date ? 1 : -1)
}


export async function getPostBySlug(slug: string) {
  const fileContent = await import(`../_posts/${slug}.md`)
  const meta = matter(fileContent.default)
  const content = marked(meta.content)
  return {
    title: meta.data.title,
    date: meta.data.date,
    content: content,
  }
}