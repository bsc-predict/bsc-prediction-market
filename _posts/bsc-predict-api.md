---
title: Announcing BSC Predict API
slug: bsc-predict-api
date: "2021-11-08"
---

As part of my trading, I developed a lot of tooling around BSC Predict. This includes this website which is free and <a href="https://github.com/bsc-predict/bsc-prediction-market" class="underline">open source</a> as well as <a href="https://github.com/bsc-predict/bsc-prediction-updater" class="underline">round data</a> and the tools to scrape the rounds yourself.

<br/><br/>

I want to continue doing this and help grow the BSC Predict market. So I'm planning on introducing an API and starter code for a bot that anyone can run or contribute to.

<br/><br/>


<h2 class="text-2xl underline">BSC Predict API</h3>

I collect a lot of bet information for the blog and general analytics, which I want to share as an API. You'll be able to query any user or a round range and get the corresponding bets and results of those bets.

<br/><br/>

There will be reasonable limits just to prevent abuse, but you should be able to get a lot of utility out of it. I also hope to migrate my app to consume this API as opposed to the PancakeSwap API.

<br/><br/>
You'll be able to use this API to create the same statistics I post every week and more. The <a href="https://pancakeswap.finance/prediction/leaderboard" class="underline">leaderboard</a> on PancakeSwap was a great addition but a lot more can be done in that domain.




<h2 class="text-2xl underline">Starter Bot</h3>

It's no surprise that most of the volume coming in to prediction markets is coming from bots. You can tell because the prize pool spikes up in the last few seconds. Getting your bet in that close to close on the web-app would be very difficult if not impossible. Besides, you see the same addresses playing consistently day and night.

<br/><br/>

I will release a simple bot that you can use to run a simple strategy. I'll pre-load the bot with a few simple configurable strategies (e.g. trending, mean reversion, martingale, etc). You'll easily be able to add your own strategies or alter the ones I created.

<br/><br/>

You then just update the keys in the config file and run on the command line.