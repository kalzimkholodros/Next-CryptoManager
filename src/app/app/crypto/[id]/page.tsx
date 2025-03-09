'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Container, Paper, Typography, Skeleton, Grid } from '@mui/material';
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
import { getCryptoDetail } from '@/services/cryptoService';
import Image from 'next/image';

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

export default function CryptoDetail() {
  const params = useParams();
  const [cryptoData, setCryptoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCryptoDetail(params.id as string);
        setCryptoData(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const chartData = {
    labels: cryptoData?.market_data?.sparkline_7d?.price?.map((_: any, index: number) => 
      new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString()
    ) || [],
    datasets: [
      {
        label: 'Price (USD)',
        data: cryptoData?.market_data?.sparkline_7d?.price || [],
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
            return `$${context.parsed.y.toFixed(2)}`;
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
            return '$' + value.toFixed(2);
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

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
          {isLoading ? (
            <Box sx={{ width: '100%' }}>
              <Skeleton 
                variant="rectangular" 
                height={400} 
                sx={{ 
                  bgcolor: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: 4
                }} 
              />
            </Box>
          ) : (
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
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
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    mb: 4 
                  }}>
                    <Box sx={{ 
                      position: 'relative',
                      width: 48,
                      height: 48,
                      filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))'
                    }}>
                      <Image
                        src={cryptoData.image.large}
                        alt={cryptoData.name}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ 
                        fontWeight: 'bold',
                        color: '#fff',
                        textShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
                      }}>
                        {cryptoData.name}
                      </Typography>
                      <Typography sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontFamily: 'monospace'
                      }}>
                        {cryptoData.symbol.toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ 
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      fontFamily: 'monospace',
                      color: '#fff',
                      textShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
                    }}>
                      ${cryptoData.market_data.current_price.usd.toLocaleString()}
                    </Typography>
                    <Typography sx={{
                      color: cryptoData.market_data.price_change_percentage_24h > 0 ? '#22c55e' : '#ef4444',
                      fontFamily: 'monospace',
                      fontSize: '1.1rem',
                      mt: 1
                    }}>
                      {cryptoData.market_data.price_change_percentage_24h > 0 ? '+' : ''}
                      {cryptoData.market_data.price_change_percentage_24h.toFixed(2)}%
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}>
                    <Box sx={{ 
                      p: 2,
                      background: 'rgba(99, 102, 241, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}>
                      <Typography sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.9rem',
                        mb: 1
                      }}>
                        Market Cap
                      </Typography>
                      <Typography sx={{ 
                        fontFamily: 'monospace',
                        fontSize: '1.1rem'
                      }}>
                        ${cryptoData.market_data.market_cap.usd.toLocaleString()}
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      p: 2,
                      background: 'rgba(99, 102, 241, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}>
                      <Typography sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.9rem',
                        mb: 1
                      }}>
                        24h Trading Volume
                      </Typography>
                      <Typography sx={{ 
                        fontFamily: 'monospace',
                        fontSize: '1.1rem'
                      }}>
                        ${cryptoData.market_data.total_volume.usd.toLocaleString()}
                      </Typography>
                    </Box>

                    <Box sx={{ 
                      p: 2,
                      background: 'rgba(99, 102, 241, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}>
                      <Typography sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.9rem',
                        mb: 1
                      }}>
                        24h Range
                      </Typography>
                      <Typography sx={{ 
                        fontFamily: 'monospace',
                        fontSize: '1.1rem'
                      }}>
                        ${cryptoData.market_data.low_24h.usd.toLocaleString()} - ${cryptoData.market_data.high_24h.usd.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={8}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    height: '100%',
                    minHeight: 500,
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
                    Price Chart (7 Days)
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <Line data={chartData} options={chartOptions} />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </motion.div>
      </Container>
    </Box>
  );
} 