---
title: Why Martingale betting strategy doesn't work 
slug: strategy-martingale
date: "2021-11-11"
sticky: false
---


<a class="underline" href="https://forms.zoho.com/contact631/form/BSCPredictMailingList">Subscribe</a> to receive an email every time a new post has been published. The subscription link has been fixed!

<br/>
As always, <a class="underline" href="mailto:contact@bscpredict.com">email me</a> with comments or suggestions.

<br/><br/>

All of the round data referenced below can be downloaded from <a class="underline" href="https://github.com/bsc-predict/bsc-predict-updater/tree/master/data/v2/main">here</a>. The data is part of a project that downloads round data periodically and uploads the csv.
<br/><br/>

<div class="divider"></div>
<h2 class="text-2xl bold">Martingale Strategy</h2>
<br/>
The martingale strategy is one in which you bet X. If you lose, you bet 2X. If you lose again, you bet 4X, and so on. You keep doubling your bet size, and when you eventually win, you reset back to X.

<br/><br/>
It's nothing new and I see a form of this on some impressive performers, but never more than 2 or 3 doublings. But this is ill-advised.

<br/><br/>

Your bet should be based solely on your expected payoff. More specifically, you should use <a href="https://en.wikipedia.org/wiki/Kelly_criterion" class="underline">Kelly criterion</a>, which I'll write about in a separate post. But generally, if you your expected payoff is 5% and another bet your expected payoff is 10%, you should place a larger bet on the second one with the higher payoff.

<br/>
<h2 class="text-2xl bold">What's the worse that could happen?</h2>

<br/>

Suppose you do use Martingale and, for simplicity, you start betting $1 and you have even odds.

<br/>
Suppose you bet only BULL
<br/><br/>

The first 35 epochs you're doing great. You're <span class="font-bold bg-accent">up $18</span> and the most you were down is $4. But starting at epoch 36 to 41, you get a string of BEARS. By epoch 41 you're <span class="font-bold bg-secondary">down $45</span>. That's fine though, keep doubling and by epoch 42 you're back to 19.

<br/>

But it doesn't end there. Rounds 61 to 70 you get another string of BEARS and now you're <span class="font-bold bg-secondary">down $933</span>. But just double it and now you're back to up $31 by round 71.

<br/>

You see where this is going...

<br/>

By epoch 13410, you're up $6,775, but rounds 13411 to 13427 happen to be an epic string of BEARS. You give it all back and then some. By epoch 13427, you're <span class="font-bold bg-secondary">down $124,296</span>. Of course if you double down again for a bet size of ~130k, you'll win it all back and you'll be back to being up $6,776, but lets be honest, you don't have the stomach (or bankroll) for that.

<br/>
How about BEARS?
<br/><br/>

The same thing happens with BEAR bets. Your biggest draw down will be lower, <span class="font-bold bg-secondary">down ~$27k</span>, meaning you'll have to put down a bet size of ~$30k at that point.


<br/>

This doesn't even take into consideration how such large bet sizes will move the odds against you, so your payout on a $10k+ bet is unlikely to be 2x! And betting $1 is not advisable since you'll be paying 10-20% in gas fees!

<br/>

Don't do naive martingale. It doesn't work. You're picking up pennies in front a steam roller.
