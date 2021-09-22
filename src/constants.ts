export const Urls = {
    rpc: {
      main: "https://bsc-dataseed1.binance.org:443",
      test: "https://data-seed-prebsc-2-s1.binance.org:8545/"  
    },
    bets: {
      main: (address: string) => `https://jkfwxgcdmc.execute-api.us-east-1.amazonaws.com/dev/main/bets/${address}`,
      test: (address: string) => `https://jkfwxgcdmc.execute-api.us-east-1.amazonaws.com/dev/test/bets/${address}`,
    },
    bnbPrice: "https://api1.binance.com/api/v3/ticker/price?symbol=BNBUSDT",
    latestRounds: {
      main: "https://raw.githubusercontent.com/bsc-predict/bsc-predict-updater/master/data/main/latest.csv",
      test: "https://raw.githubusercontent.com/bsc-predict/bsc-predict-updater/master/data/test/latest.csv",
    },
    allRounds: {
      main: "https://raw.githubusercontent.com/bsc-predict/bsc-predict-updater/master/data/main/rounds.csv",
      test: "https://raw.githubusercontent.com/bsc-predict/bsc-predict-updater/master/data/test/rounds.csv",
    },
  }

export interface PredictionConstants {
  bufferBlocks: number
  rewardRate: number
  intervalBlocks: number
}
