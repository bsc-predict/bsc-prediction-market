import React from "react"
import Link from "next/link"
import { predictionLarge } from "../../images/prediction"
import { Links } from "src/constants"
import { twitter } from "../../images/twitter"
import { github } from "src/images/github"

interface HomePageProps {
  posts: Array<{ slug: string, title: string, date: string }>
}

const HomePage: React.FunctionComponent<HomePageProps> = (props) => {

  const recentPosts = props.posts.sort((a, b) => a.date < b.date ? 1 : -1).slice(0, 3)

  return (
    <div className="flex flex-col text-center items-center space-y-8">
      <div className="py-20 space-y-6">
        <div className="flex justify-center">
          {predictionLarge}
        </div>
        <h1 className="text-4xl">BSC Predict</h1>
        <div className="text-xl">Predict BNB-USD movements in 5 minute intervals</div>
        <div className="flex space-x-4 justify-center">
          <Link href="/ps/bnbusdt" passHref>
            <button className="btn btn-primary"><a>Predict</a></button>
          </Link>
          <Link href="/lottery/cake" passHref>
            <button className="btn btn-primary"><a>CAKE Lottery</a></button>
          </Link>
          <Link href="/blog" passHref>
            <button className="btn btn-ghost"><a>Blog</a></button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <div>Follow on</div>
        <div className="flex space-x-4">
          <Link href={Links.twitter}>
            <a>
              <div className="p-4 border rounded-lg w-16 h-16">
                {twitter}
              </div>
            </a>
          </Link>
          <Link href={Links.github}>
            <a>
              <div className="p-4 border rounded-lg w-16 h-16">
                {github}
              </div>
            </a>
          </Link>
        </div>
      </div>

      <div className="text-lg p-4">
        <a
          className="underline"
          href="https://forms.zohopublic.com/contact631/form/BSCPredictMailingList/formperma/FfjprXQKPkAZNTCcpdNfWQfMlHQvkuBkPvEldZqsUWs"
        >
          Subscribe</a> to BSC Predict mailing list to receive emails on the updates and new blog posts
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
    </div>
  )
}

export default HomePage