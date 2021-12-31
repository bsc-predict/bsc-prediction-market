import { getAllPosts } from '@api'
import React from 'react'
import HomePage from '../src/pages/home'
import AppWrapper from '../src/wrapper'

interface HomeProps {
  posts: Array<{ slug: string, title: string, date: string }>
}

const Home: React.FunctionComponent<HomeProps> = ({ posts }) => {

  return (
    <AppWrapper title="BSC Predict" description="Binance Smart Chain (BSC) Prediction Markets">
      <HomePage posts={posts} />
    </AppWrapper>
  )
}


export async function getStaticProps() {
  const allPosts = await getAllPosts()
  return {
    props: {
      posts: allPosts,
    }
  }
}


export default Home
