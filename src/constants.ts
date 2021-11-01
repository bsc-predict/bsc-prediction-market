export const Urls = {
    rpc: {
      main: "https://nodes.pancakeswap.com",
      test: "https://data-seed-prebsc-2-s1.binance.org:8545/"  
    },
    bets: {
      main: (address: string) => `https://jkfwxgcdmc.execute-api.us-east-1.amazonaws.com/dev/v2/main/bets/${address}`,
      test: (address: string) => `https://jkfwxgcdmc.execute-api.us-east-1.amazonaws.com/dev/v2/test/bets/${address}`,
    },
    bnbPrice: "https://api1.binance.com/api/v3/ticker/price?symbol=BNBUSDT",
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
    }
  }

export interface PredictionConstants {
  bufferSeconds: number
  rewardRate: number
  intervalSeconds: number
}
