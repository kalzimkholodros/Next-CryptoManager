'use client';

import { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Skeleton,
  IconButton,
  Tooltip
} from '@mui/material';
import { Search, ArrowUpward, ArrowDownward, Star, StarBorder } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
}

export default function Markets() {
  const router = useRouter();
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CoinData | '';
    direction: 'asc' | 'desc';
  }>({ key: 'market_cap_rank', direction: 'asc' });
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
            sparkline: true
          }
        });
        setCoins(response.data);
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

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const handleSort = (key: keyof CoinData) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const filteredCoins = coins
    .filter(coin =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortConfig.key === '') return 0;
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
            Cryptocurrency Markets
          </Typography>

          <Paper
            sx={{
              p: 3,
              background: 'rgba(13, 16, 45, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '20px',
              mb: 4
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search cryptocurrency..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(99, 102, 241, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(99, 102, 241, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>

          <TableContainer
            component={Paper}
            sx={{
              background: 'rgba(13, 16, 45, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '20px',
              '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(0, 0, 0, 0.1)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(99, 102, 241, 0.3)',
                borderRadius: '4px',
                '&:hover': {
                  background: 'rgba(99, 102, 241, 0.5)',
                },
              },
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Favorite
                  </TableCell>
                  <TableCell 
                    onClick={() => handleSort('market_cap_rank')}
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      cursor: 'pointer',
                      '&:hover': {
                        color: '#fff'
                      }
                    }}
                  >
                    #
                    {sortConfig.key === 'market_cap_rank' && (
                      sortConfig.direction === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Name</TableCell>
                  <TableCell 
                    align="right"
                    onClick={() => handleSort('current_price')}
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      cursor: 'pointer',
                      '&:hover': {
                        color: '#fff'
                      }
                    }}
                  >
                    Price
                    {sortConfig.key === 'current_price' && (
                      sortConfig.direction === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </TableCell>
                  <TableCell 
                    align="right"
                    onClick={() => handleSort('price_change_percentage_24h')}
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      cursor: 'pointer',
                      '&:hover': {
                        color: '#fff'
                      }
                    }}
                  >
                    24h %
                    {sortConfig.key === 'price_change_percentage_24h' && (
                      sortConfig.direction === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </TableCell>
                  <TableCell 
                    align="right"
                    onClick={() => handleSort('market_cap')}
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      cursor: 'pointer',
                      '&:hover': {
                        color: '#fff'
                      }
                    }}
                  >
                    Market Cap
                    {sortConfig.key === 'market_cap' && (
                      sortConfig.direction === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </TableCell>
                  <TableCell 
                    align="right"
                    onClick={() => handleSort('total_volume')}
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      cursor: 'pointer',
                      '&:hover': {
                        color: '#fff'
                      }
                    }}
                  >
                    Volume (24h)
                    {sortConfig.key === 'total_volume' && (
                      sortConfig.direction === 'asc' ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                    )}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {isLoading ? (
                    Array.from(new Array(rowsPerPage)).map((_, index) => (
                      <TableRow key={index}>
                        {Array.from(new Array(7)).map((_, cellIndex) => (
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
                    filteredCoins
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((coin) => (
                        <TableRow
                          key={coin.id}
                          onClick={() => router.push(`/crypto/${coin.id}`)}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              background: 'rgba(99, 102, 241, 0.1)',
                            }
                          }}
                        >
                          <TableCell
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFavorite(coin.id);
                            }}
                          >
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <IconButton size="small">
                                {favorites.includes(coin.id) ? (
                                  <Star sx={{ color: '#6366f1' }} />
                                ) : (
                                  <StarBorder sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                                )}
                              </IconButton>
                            </motion.div>
                          </TableCell>
                          <TableCell sx={{ color: '#fff' }}>
                            {coin.market_cap_rank}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ 
                                position: 'relative',
                                width: 24,
                                height: 24,
                                filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))'
                              }}>
                                <Image
                                  src={coin.image}
                                  alt={coin.name}
                                  fill
                                  style={{ objectFit: 'contain' }}
                                />
                              </Box>
                              <Box>
                                <Typography sx={{ color: '#fff' }}>
                                  {coin.name}
                                </Typography>
                                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                                  {coin.symbol.toUpperCase()}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontFamily: 'monospace' }}>
                            ${coin.current_price.toLocaleString()}
                          </TableCell>
                          <TableCell 
                            align="right" 
                            sx={{ 
                              color: coin.price_change_percentage_24h > 0 ? '#22c55e' : '#ef4444',
                              fontFamily: 'monospace'
                            }}
                          >
                            {coin.price_change_percentage_24h > 0 ? '+' : ''}
                            {coin.price_change_percentage_24h.toFixed(2)}%
                          </TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontFamily: 'monospace' }}>
                            ${coin.market_cap.toLocaleString()}
                          </TableCell>
                          <TableCell align="right" sx={{ color: '#fff', fontFamily: 'monospace' }}>
                            ${coin.total_volume.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredCoins.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              color: '#fff',
              '.MuiTablePagination-select': {
                color: '#fff',
              },
              '.MuiTablePagination-selectIcon': {
                color: '#fff',
              },
              '.MuiTablePagination-actions': {
                color: '#fff',
              },
            }}
          />
        </motion.div>
      </Container>
    </Box>
  );
} 