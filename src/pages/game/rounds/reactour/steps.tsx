import Link from "next/link";
import React from "react";
import { ReactourStep } from "reactour";

export const gameSteps: ReactourStep[] = [
  {
    content: <div className="text-black">
      <strong>BSC Predict</strong> lets you bet on the price of crypto in <strong>5 minute intervals</strong>
    </div>,
  },
  {
    selector: "#reactour-sign-in",
    content: <div className="text-black">
      <strong>Sign in</strong> to your binance smart chain wallet
    </div>,
  },
  {
    selector: "#reactour-live",
    content: <div className="text-black">
      The first row is the upcoming round
    </div>,
  },
  {
    selector: "#reactour-position",
    content: <div className="text-black">
      Choose either <strong>up (bull)</strong> or <strong>down (bear)</strong> to place a bet.
      <br /><br />Once a bet is placed, this will show you your position
    </div>,
  },
  {
    selector: "#reactour-bull-payout",
    content: <div className="text-black">
      The <strong>bull payoff</strong> for a correct bull bet is here.<br /><br />
      A payout of 2.2 means a bet of 0.1 BNB will pay off 0.22 (0.12 plus your initial bet size minus a 3% fee)
    </div>,
  },
  {
    selector: "#reactour-bear-payout",
    content: <div className="text-black">
      The <strong>bear payoff</strong> for a successful bear bet.<br /><br />Note that the payoffs will change as the round approaches close
    </div>,
  },
  {
    selector: "#reactour-prize-pool",
    content: <div className="text-black">
      The <strong>prize pool</strong> is the total size of all bets made
    </div>,
  },
  {
    selector: "#reactour-lock-price",
    content: <div className="text-black">
      The <strong>lock price</strong> is the reference price for that round.
      <br /><br />For instance a lock price of 420 means the price would have to be
      above 420 for a bull to win, and below 420 for a bear to win.
      <br /><br />If it closes at exactly 420 (very rare), everyone loses
    </div>,
  },
  {
    selector: "#reactour-close-price",
    content: <div className="text-black">
      The <strong>close price</strong> is how much the price moved in the round.
      <br /><br />This determines whether bulls or bears won. The cell is faded if the round is live
    </div>,
  },
  {
    selector: "#reactour-result",
    content: <div className="text-black">
      The <strong>result</strong> is your result for the round.
      <br /><br />If you lost, the cell will be red and have the amount lost.
      <br /><br />If won, the cell will be green and have the amount won with the amount bet in parenthesis. For example 0.1 (0.08) means you won 0.1 BNB on a bet size of 0.08
    </div>,
  },
  {
    selector: "#reactour-time-remaining",
    content: <div className="text-black">
      The <strong>time remaining</strong> before the round is closed is here
    </div>,
  },
  {
    selector: "#reactour-claim",
    content: <div className="text-black">
      You can claim all your successful bets by clicking <strong>Claim</strong>
    </div>,
  },
  {
    selector: "#reactour-history",
    content: <div className="text-black">
      You can see your bet <strong>history</strong> here or the history of any account
    </div>,
  },
  {
    content: <div className="text-black">
      For more information on the game itself, visit the
      &nbsp;<strong><Link href="https://docs.pancakeswap.finance/products/prediction"><a className="text-bold">documentation</a></Link></strong> or
      &nbsp;<strong><Link href="mailto:contact@bscpredict.com"><a className="text-bold">contact us</a></Link></strong>
    </div>,
    
  },





]