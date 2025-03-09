import axios from 'axios';

const API_KEY = 'CG-CYpAAvF7JjqTEjnfhrpmGXVQ';
const BASE_URL = 'https://api.coingecko.com/api/v3';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-cg-demo-api-key': API_KEY
  }
});

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
}

export const getCryptoData = async () => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          order: 'price_change_percentage_24h',
          per_page: 250,
          page: 1,
          sparkline: true
        }
      }
    );

    const data = response.data as CryptoData[];
    
    const topGainers = data
      .filter(coin => coin.price_change_percentage_24h > 0)
      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
      .slice(0, 20);

    const topLosers = data
      .filter(coin => coin.price_change_percentage_24h < 0)
      .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
      .slice(0, 20);

    return { topGainers, topLosers };
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return { topGainers: [], topLosers: [] };
  }
};

export const getCryptoDetail = async (id: string) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}`,
      {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: true
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching crypto detail:', error);
    throw error;
  }
}; 