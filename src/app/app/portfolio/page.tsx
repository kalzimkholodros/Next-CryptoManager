'use client';

import { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Skeleton
} from '@mui/material';
import { Delete, TrendingUp, TrendingDown } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';
import Image from 'next/image';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

interface PortfolioItem {
  id: string;
  name: string;
  symbol: string;
  image: string;
  amount: number;
  buyPrice: number;
  currentPrice: number;
  priceChange24h: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

const samplePortfolio: PortfolioItem[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    amount: 0.5,
    buyPrice: 45000,
    currentPrice: 0,
    priceChange24h: 0,
    totalValue: 0,
    profitLoss: 0,
    profitLossPercentage: 0
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    amount: 2,
    buyPrice: 2800,
    currentPrice: 0,
    priceChange24h: 0,
    totalValue: 0,
    profitLoss: 0,
    profitLossPercentage: 0
  }
];

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(samplePortfolio);
  const [isLoading, setIsLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);
  const [totalProfitLossPercentage, setTotalProfitLossPercentage] = useState(0);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = portfolio.map(item => item.id).join(',');
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
          params: {
            ids,
            vs_currencies: 'usd',
            include_24hr_change: true
          }
        });

        const updatedPortfolio = portfolio.map(item => {
          const currentPrice = response.data[item.id].usd;
          const priceChange24h = response.data[item.id].usd_24h_change;
          const totalValue = item.amount * currentPrice;
          const profitLoss = totalValue - (item.amount * item.buyPrice);
          const profitLossPercentage = (profitLoss / (item.amount * item.buyPrice)) * 100;

          return {
            ...item,
            currentPrice,
            priceChange24h,
            totalValue,
            profitLoss,
            profitLossPercentage
          };
        });

        setPortfolio(updatedPortfolio);
        
        const newTotalValue = updatedPortfolio.reduce((acc, item) => acc + item.totalValue, 0);
        const newTotalProfitLoss = updatedPortfolio.reduce((acc, item) => acc + item.profitLoss, 0);
        const totalInvestment = updatedPortfolio.reduce((acc, item) => acc + (item.amount * item.buyPrice), 0);
        const newTotalProfitLossPercentage = (newTotalProfitLoss / totalInvestment) * 100;

        setTotalValue(newTotalValue);
        setTotalProfitLoss(newTotalProfitLoss);
        setTotalProfitLossPercentage(newTotalProfitLossPercentage);
      } catch (error) {
        console.error('Error fetching prices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, [portfolio]);

  const StatCard = ({ title, value, subValue, isProfit, isLoading }: { 
    title: string;
    value: string;
    subValue?: string;
    isProfit?: boolean;
    isLoading: boolean;
  }) => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        height: '100%',
        background: 'rgba(13, 16, 45, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '20px',
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
        <>
          <Skeleton
            variant="text"
            sx={{
              bgcolor: 'rgba(99, 102, 241, 0.1)',
              borderRadius: 1,
              fontSize: '2rem'
            }}
          />
          {subValue && (
            <Skeleton
              variant="text"
              sx={{
                bgcolor: 'rgba(99, 102, 241, 0.1)',
                borderRadius: 1,
                width: '60%'
              }}
            />
          )}
        </>
      ) : (
        <>
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
          {subValue && (
            <Typography
              sx={{
                color: isProfit ? '#22c55e' : '#ef4444',
                fontFamily: 'monospace',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                mt: 1
              }}
            >
              {isProfit ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
              {subValue}
            </Typography>
          )}
        </>
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
            Portfolio Overview
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Total Portfolio Value"
                value={`$${totalValue.toLocaleString()}`}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Total Profit/Loss"
                value={`$${Math.abs(totalProfitLoss).toLocaleString()}`}
                subValue={`${totalProfitLoss > 0 ? '+' : '-'}${Math.abs(totalProfitLossPercentage).toFixed(2)}%`}
                isProfit={totalProfitLoss > 0}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                title="Number of Assets"
                value={portfolio.length.toString()}
                isLoading={isLoading}
              />
            </Grid>

            <Grid item xs={12}>
              <TableContainer
                component={Paper}
                sx={{
                  background: 'rgba(13, 16, 45, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '20px',
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Asset</TableCell>
                      <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Amount</TableCell>
                      <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Buy Price</TableCell>
                      <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Current Price</TableCell>
                      <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>24h Change</TableCell>
                      <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Total Value</TableCell>
                      <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Profit/Loss</TableCell>
                      <TableCell align="right" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading ? (
                      Array.from(new Array(2)).map((_, index) => (
                        <TableRow key={index}>
                          {Array.from(new Array(8)).map((_, cellIndex) => (
                            <TableCell key={cellIndex}>
                              <Skeleton
                                variant="text"
                                sx={{
                                  bgcolor: 'rgba(99, 102, 241, 0.1)',
                                  borderRadius: 1
                                }}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      portfolio.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ 
                                position: 'relative',
                                width: 24,
                                height: 24,
                                filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))'
                              }}>
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  style={{ objectFit: 'contain' }}
                                />
                              </Box>
                              <Box>
                                <Typography sx={{ color: '#fff' }}>
                                  {item.name}
                                </Typography>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                                  {item.symbol.toUpperCase()}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontFamily: 'monospace' }}>
                            {item.amount}
                          </TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontFamily: 'monospace' }}>
                            ${item.buyPrice.toLocaleString()}
                          </TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontFamily: 'monospace' }}>
                            ${item.currentPrice.toLocaleString()}
                          </TableCell>
                          <TableCell 
                            align="right" 
                            sx={{ 
                              color: item.priceChange24h > 0 ? '#22c55e' : '#ef4444',
                              fontFamily: 'monospace'
                            }}
                          >
                            {item.priceChange24h > 0 ? '+' : ''}
                            {item.priceChange24h.toFixed(2)}%
                          </TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontFamily: 'monospace' }}>
                            ${item.totalValue.toLocaleString()}
                          </TableCell>
                          <TableCell 
                            align="right"
                            sx={{ 
                              color: item.profitLoss > 0 ? '#22c55e' : '#ef4444',
                              fontFamily: 'monospace'
                            }}
                          >
                            ${Math.abs(item.profitLoss).toLocaleString()}
                            <br />
                            <Typography
                              component="span"
                              sx={{
                                fontSize: '0.8rem',
                                color: item.profitLoss > 0 ? '#22c55e' : '#ef4444',
                              }}
                            >
                              ({item.profitLoss > 0 ? '+' : ''}{item.profitLossPercentage.toFixed(2)}%)
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Remove">
                              <IconButton
                                size="small"
                                sx={{ color: '#ef4444' }}
                                onClick={() => {
                                  setPortfolio(portfolio.filter(p => p.id !== item.id));
                                }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
} 