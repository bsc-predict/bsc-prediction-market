import React from "react"
import Link from "next/link"
import { predictionLarge } from "../../images/prediction"

interface HomePageProps {
  posts: Array<{ slug: string, title: string, date: string }>
}

const HomePage: React.FunctionComponent<HomePageProps> = (props) => {

  const recentPosts = props.posts.sort((a, b) => a.date < b.date ? 1 : -1).slice(0, 3)

  return (
    <div className="text-center space-y-8">
      <div className="py-24 space-y-6">
        <div className="flex justify-center">
          {predictionLarge}
        </div>
        <h1 className="text-4xl">BSC Predict</h1>
        <div className="text-xl">Predict BNB-USD movements in 5 minute intervals</div>
        <div className="flex space-x-4 justify-center">
          <Link href="/bnbusdt" passHref>
            <button className="btn btn-primary"><a>Play Now</a></button>
          </Link>
          <Link href="/blog" passHref>
            <button className="btn btn-ghost"><a>Blog</a></button>
          </Link>
        </div>
      </div>
      <div className="text-lg p-4 border border-solid">
        <a className="underline" href="https://forms.zoho.com/contact631/form/BSCPredictMailingList">Subscribe</a> to BSC Predict mailing list to receive emails on the
        updates and new blog posts
      </div>
      <div className="space-y-4">
        <div className="text-4xl underline">Recent Blog Posts</div>
        {recentPosts.map(post =>
          <div key={post.slug}>
            <Link href={`/blog/${post.slug}`} >
              <a className="text-xl hover:font-bold">{post.title}</a>
            </Link>
            <div className="text-xs">Published {post.date}</div>
          </div>)}
      </div>
      {/* <div className="grid justify-items-center">
        <h2 className="text-2xl my-8">How does it work?</h2>
        <MockRound />
      </div> */}
    </div>
  )
}

export default HomePage