export const OracleAddresses = {
  main: "0xD276fCF34D54A926773c399eBAa772C12ec394aC",
  test: "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526"
}

export const toOracle = (o: OracleResponse): Oracle => {
  return {
    answer: Number(o.answer),
    // answeredInRound: Number(o.answeredInRound),
    // startedAt: Number(o.startedAt),
    // roundId: Number(o.roundId),
    // updatedAt: Number(o.updatedAt),
  }
}