
interface WindowChain {
  ethereum?: {
    isMetaMask?: true
    request?: (...args: any[]) => void
  }
}

declare module 'theme-change' {
  export const themeChange: (b: boolean) => void
}

type Chain = "main" | "test"
type Pair = "bnbusdt" | "ethusdt"
type Service = "ps" | "prdt"

interface GameType { chain: Chain, service: Service, pair: Pair }
