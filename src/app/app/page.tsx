'use client';

import { useEffect, useState, Suspense } from 'react';
import { Box, Container, Grid, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { getCryptoData, CryptoData } from '@/services/cryptoService';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const CryptoCard = dynamic(() => import('@/components/CryptoCard'), { ssr: false });

const LoadingCard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <Box
      sx={{
        height: '100%',
        minHeight: 500,
        background: 'rgba(13, 16, 45, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(99, 102, 241, 0.1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
          animation: 'pulse 2s ease-in-out infinite'
        },
        '@keyframes pulse': {
          '0%': {
            transform: 'translate(-50%, -50%) scale(0.8)',
            opacity: 0.5
          },
          '50%': {
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 0.8
          },
          '100%': {
            transform: 'translate(-50%, -50%) scale(0.8)',
            opacity: 0.5
          }
        }
      }}
    >
      <CircularProgress 
        sx={{ 
          color: '#6366f1',
          filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))'
        }} 
      />
    </Box>
  </motion.div>
);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cryptoData, setCryptoData] = useState<{
    topGainers: CryptoData[];
    topLosers: CryptoData[];
  }>({
    topGainers: [],
    topLosers: []
  });

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getCryptoData();
        setCryptoData(data);
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

  if (!mounted) {
    return null;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1642 0%, #1a1c2e 50%, #0f1642 100%)',
      color: 'white',
      pt: 8,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
        animation: 'gradientMove 15s ease infinite',
        opacity: 0.5
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '200px',
        background: 'linear-gradient(to bottom, rgba(13, 16, 45, 0.8) 0%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: 1
      },
      '@keyframes gradientMove': {
        '0%': {
          backgroundPosition: '0% 50%'
        },
        '50%': {
          backgroundPosition: '100% 50%'
        },
        '100%': {
          backgroundPosition: '0% 50%'
        }
      }
    }}>
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      
      <Container 
        maxWidth="xl" 
        sx={{ 
          mt: 12,
          position: 'relative',
          zIndex: 2,
          px: { xs: 2, sm: 4, md: 6 }
        }}
      >
        <Grid 
          container 
          spacing={4}
          sx={{
            '& > .MuiGrid-item': {
              display: 'flex'
            }
          }}
        >
          <Grid item xs={12} md={6}>
            <Suspense fallback={<LoadingCard />}>
              <CryptoCard
                title="Top Gainers 🚀"
                data={cryptoData.topGainers}
                isLoading={isLoading}
                variant="gainers"
              />
            </Suspense>
          </Grid>
          <Grid item xs={12} md={6}>
            <Suspense fallback={<LoadingCard />}>
              <CryptoCard
                title="Top Losers 📉"
                data={cryptoData.topLosers}
                isLoading={isLoading}
                variant="losers"
              />
            </Suspense>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
