export const treasuryQuery = `
query {
    protocolMetrics(first: 1000, orderBy: timestamp, orderDirection: desc) {
      id
      timestamp
      treasuryMIMMarketValue
      treasuryWAVAXMarketValue
      treasuryWETHMarketValue
      treasuryMIMFromWETHMIMJLP
      treasuryMIMFromTIMEMIMJLP
      treasuryWETHValueFromWETHMIMJLP
    }
  }
`;
