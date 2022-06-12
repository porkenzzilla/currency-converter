export interface Motd {
  msg: string;
  url: string;
}

export interface Rates {
  [key: string]: number | undefined
}

export interface IExchangeRateResponse {
  motd: Motd;
  success: boolean;
  base: string;
  date: string;
  rates: Rates;
}
