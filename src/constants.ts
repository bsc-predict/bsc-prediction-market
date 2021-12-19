export const Urls = {
    rpc: {
      main: "https://nodes.pancakeswap.com",
      // main: "https://speedy-nodes-nyc.moralis.io/f50c95b944af245f8c9a951e/bsc/mainnet",
      test: "https://data-seed-prebsc-2-s1.binance.org:8545/"  
    },
    bets: {
      main: (address: string) => `https://jkfwxgcdmc.execute-api.us-east-1.amazonaws.com/dev/v2/main/bets/${address}`,
      test: (address: string) => `https://jkfwxgcdmc.execute-api.us-east-1.amazonaws.com/dev/v2/test/bets/${address}`,
    },
    bnbPrice: "https://api1.binance.com/api/v3/ticker/price?symbol=BNBUSDT",
    cakePrice: "https://api1.binance.com/api/v3/ticker/price?symbol=CAKEUSDT",
    leaderboard: {
      main: "https://raw.githubusercontent.com/bsc-predict/bsc-predict-updater/master/data/v2/main/leaderboard.csv",
      test: "https://raw.githubusercontent.com/bsc-predict/bsc-predict-updater/master/data/v2/test/latest.csv",
    },
    leaderboardEvenMoney: {
      main: "https://raw.githubusercontent.com/bsc-predict/bsc-predict-updater/master/data/v2/main/leaderboard-even-money.csv",
      test: "https://raw.githubusercontent.com/bsc-predict/bsc-predict-updater/master/data/v2/main/leaderboard-even-money.csv",
    },
    latestRounds: {
      main: "https://raw.githubusercontent.com/bsc-predict/bsc-predict-updater/master/data/v2/main/latest.csv",
      test: "https://raw.githubusercontent.com/bsc-predict/bsc-predict-updater/master/data/v2/test/latest.csv",
    },
    allRounds: {
      main: "https://raw.githubusercontent.com/bsc-predict/bsc-predict-updater/master/data/v2/main/rounds.csv",
      test: "https://raw.githubusercontent.com/bsc-predict/bsc-predict-updater/master/data/v2/test/rounds.csv",
    },
    gqlPrediction: {
      main: "https://api.thegraph.com/subgraphs/name/pancakeswap/prediction-v2",
      test: "",
    },
    lotteryRounds: {
      main: "https://gist.githubusercontent.com/bsc-predict/dcdde5b482c31508cb5ab3b29a906299/raw/pancake-swap-lottery.csv"
    }
  }

export interface PredictionConstants {
  bufferSeconds: number
  rewardRate: number
  intervalSeconds: number
}
