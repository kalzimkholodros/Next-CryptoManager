'use client';

import { useEffect, useState } from 'react';
import { Box, Container, Grid, Paper, Typography, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface GlobalData {
  active_cryptocurrencies: number;
  markets: number;
  total_market_cap: { [key: string]: number };
  total_volume: { [key: string]: number };
  market_cap_percentage: { [key: string]: number };
  market_cap_change_percentage_24h_usd: number;
}

interface MarketChart {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export default function Dashboard() {
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [btcChart, setBtcChart] = useState<MarketChart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [globalResponse, btcChartResponse] = await Promise.all([
          axios.get('https://api.coingecko.com/api/v3/global'),
          axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart', {
            params: {
              vs_currency: 'usd',
              days: '7',
              interval: 'daily'
            }
          })
        ]);

        setGlobalData(globalResponse.data.data);
        setBtcChart(btcChartResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: btcChart?.prices.map(price => 
      new Date(price[0]).toLocaleDateString()
    ) || [],
    datasets: [
      {
        label: 'Bitcoin Price (USD)',
        data: btcChart?.prices.map(price => price[1]) || [],
        fill: true,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        pointRadius: 0,
        pointHitRadius: 10,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(13, 16, 45, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(99, 102, 241, 0.2)',
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          family: 'monospace',
          size: 12,
        },
        titleFont: {
          family: 'monospace',
          size: 14,
          weight: 'bold' as const,
        },
        callbacks: {
          label: function(context: any) {
            return `$${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          font: {
            family: 'monospace',
            size: 10,
          },
          maxRotation: 0,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          font: {
            family: 'monospace',
            size: 10,
          },
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const StatCard = ({ title, value, isLoading }: { title: string; value: string; isLoading: boolean }) => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        background: 'rgba(13, 16, 45, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '20px',
        height: '100%',
      }}
    >
      <Typography
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.9rem',
          mb: 1
        }}
      >
        {title}
      </Typography>
      {isLoading ? (
        <Skeleton
          variant="text"
          sx={{
            bgcolor: 'rgba(99, 102, 241, 0.1)',
            borderRadius: 1,
            fontSize: '2rem'
          }}
        />
      ) : (
        <Typography
          sx={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            color: '#fff',
            textShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
          }}
        >
          {value}
        </Typography>
      )}
    </Paper>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1642 0%, #1a1c2e 50%, #0f1642 100%)',
      color: 'white',
      pt: 12,
      pb: 6
    }}>
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              fontWeight: 'bold',
              textAlign: 'center',
              background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
            }}
          >
            Market Overview
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <StatCard
                title="Active Cryptocurrencies"
                value={globalData?.active_cryptocurrencies.toLocaleString() || '0'}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard
                title="Active Markets"
                value={globalData?.markets.toLocaleString() || '0'}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard
                title="Total Market Cap (USD)"
                value={`$${(globalData?.total_market_cap.usd || 0).toLocaleString()}`}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <StatCard
                title="24h Market Cap Change"
                value={`${globalData?.market_cap_change_percentage_24h_usd.toFixed(2)}%`}
                isLoading={isLoading}
              />
            </Grid>

            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  background: 'rgba(13, 16, 45, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '20px',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 'bold',
                    color: '#fff',
                    textShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
                  }}
                >
                  Bitcoin Price Chart (7 Days)
                </Typography>
                <Box sx={{ height: 400 }}>
                  {isLoading ? (
                    <Skeleton 
                      variant="rectangular" 
                      height={400} 
                      sx={{ 
                        bgcolor: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: 4
                      }} 
                    />
                  ) : (
                    <Line data={chartData} options={chartOptions} />
                  )}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  background: 'rgba(13, 16, 45, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '20px',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 'bold',
                    color: '#fff',
                    textShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
                  }}
                >
                  Market Dominance
                </Typography>
                <Grid container spacing={2}>
                  {isLoading ? (
                    Array.from(new Array(5)).map((_, index) => (
                      <Grid item xs={12} sm={6} md={2.4} key={index}>
                        <Skeleton
                          variant="rectangular"
                          height={60}
                          sx={{
                            bgcolor: 'rgba(99, 102, 241, 0.1)',
                            borderRadius: 2
                          }}
                        />
                      </Grid>
                    ))
                  ) : (
                    Object.entries(globalData?.market_cap_percentage || {})
                      .slice(0, 5)
                      .map(([symbol, percentage]) => (
                        <Grid item xs={12} sm={6} md={2.4} key={symbol}>
                          <Box
                            sx={{
                              p: 2,
                              background: 'rgba(99, 102, 241, 0.1)',
                              borderRadius: '12px',
                              border: '1px solid rgba(99, 102, 241, 0.2)',
                            }}
                          >
                            <Typography
                              sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '0.9rem',
                                mb: 1
                              }}
                            >
                              {symbol.toUpperCase()}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: 'monospace',
                                fontSize: '1.1rem',
                                fontWeight: 'bold'
                              }}
                            >
                              {percentage.toFixed(2)}%
                            </Typography>
                          </Box>
                        </Grid>
                      ))
                  )}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
} 