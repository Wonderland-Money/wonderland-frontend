export interface GrowthDataPoint {
    id: string;
    timestamp: Date;
    treasuryMIMFromTIMEMIMJLP: number;
    treasuryMIMFromWETHMIMJLP: number;
    treasuryMIMMarketValue: number;
    treasuryWAVAXMarketValue: number;
    treasuryWETHMarketValue: number;
    treasuryWETHValueFromWETHMIMJLP: number;
}

export interface RawDataPoint {
    id: number;
    timestamp: number;
    treasuryMIMFromTIMEMIMJLP: number;
    treasuryMIMFromWETHMIMJLP: number;
    treasuryMIMMarketValue: number;
    treasuryWAVAXMarketValue: number;
    treasuryWETHMarketValue: number;
    treasuryWETHValueFromWETHMIMJLP: number;
}
