import Link from "next/link"

const questions = [
  {
    id: "what",
    q: <div>What is this website?</div>,
    a: <div>This is a website where you can bet on the price movement in the BNB-USDT market.
      You can find more info <a className="underline" href="https://docs.pancakeswap.finance/products/prediction">here</a> </div>
  },
  {
    id: "how",
    q: <div>How is this different than <a className="underline" href="https://pancakeswap.finance/prediction">Pancake Swap Prediction Market?</a></div>,
    a: <div>It&apos;s not. It&apos;s just another way to interact with the same <a className="underline" href="https://bscscan.com/address/0x516ffd7d1e0ca40b1879935b2de87cb20fc1124b">contract</a></div>
  },
  {
    id: "why",
    q: <div>So what&apos;s different from your site?</div>,
    a: <div>
      <ol>
        <li>• It&apos;s a lot lighter, faster and simpler to use</li>
        <li>• More frequent polling for more accurate pool size and payoffs</li>
        <li>• Historical data for yourself or any other account</li>
      </ol>
    </div>
  },
  {
    id: "public",
    q: <div>Is the code public?</div>,
    a: <div><a className="underline" href="https://github.com/bsc-predict/bsc-prediction-market">Yes</a></div>,
  },
  {
    id: "play",
    q: <div>How can I play</div>,
    a: <div>Go <Link  href="/bnbusdt"><a className="underline">here</a></Link> to play. If you need help, click the big <strong>?</strong> on the header</div>
  },
  {
    id: "contact",
    q: <div>How can I contact you?</div>,
    a: <div>You can <a className="underline" href="contact@bscpredict.com">email me</a></div>,
  },
]

export default questions

