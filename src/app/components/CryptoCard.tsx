import { Box, Paper, Typography, Skeleton, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { CryptoData } from '@/services/cryptoService';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CryptoCardProps {
  title: string;
  data: CryptoData[];
  isLoading: boolean;
  variant: 'gainers' | 'losers';
}

const CryptoCard = ({ title, data, isLoading, variant }: CryptoCardProps) => {
  const router = useRouter();

  const handleCryptoClick = (id: string) => {
    router.push(`/crypto/${id}`);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: '100%',
        minHeight: 500,
        background: 'rgba(13, 16, 45, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 40px rgba(99, 102, 241, 0.1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'rgba(13, 16, 45, 0.98)',
          borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
          zIndex: 1
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: variant === 'gainers'
            ? 'radial-gradient(circle at 50% 0%, rgba(34, 197, 94, 0.15), transparent 70%)'
            : 'radial-gradient(circle at 50% 0%, rgba(239, 68, 68, 0.15), transparent 70%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Box sx={{ 
        position: 'relative', 
        zIndex: 2, 
        p: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: variant === 'gainers' ? '#22c55e' : '#ef4444',
            textShadow: variant === 'gainers'
              ? '0 0 10px rgba(34, 197, 94, 0.3)'
              : '0 0 10px rgba(239, 68, 68, 0.3)',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: '1.1rem'
          }}
        >
          {title}
        </Typography>
        <Box sx={{
          px: 2,
          py: 0.5,
          borderRadius: '12px',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
        }}>
          <Typography sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.8rem',
            fontFamily: 'monospace'
          }}>
            LIVE DATA
          </Typography>
        </Box>
      </Box>

      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto',
        p: '0 10px',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(99, 102, 241, 0.3)',
          borderRadius: '3px',
          '&:hover': {
            background: 'rgba(99, 102, 241, 0.5)',
          }
        }
      }}>
        <AnimatePresence>
          {isLoading ? (
            <Grid container spacing={1}>
              {Array.from(new Array(20)).map((_, index) => (
                <Grid item xs={6} key={`skeleton-${index}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Skeleton
                      variant="rectangular"
                      height={48}
                      sx={{ 
                        bgcolor: 'rgba(99, 102, 241, 0.1)', 
                        borderRadius: 2,
                        transform: 'none',
                      }}
                    />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={1}>
              {data.map((crypto, index) => (
                <Grid item xs={6} key={crypto.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => handleCryptoClick(crypto.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Paper
                      sx={{
                        py: 1.5,
                        px: 2,
                        background: 'rgba(13, 16, 45, 0.6)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(99, 102, 241, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        '&:hover': {
                          background: 'rgba(13, 16, 45, 0.8)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.2)',
                          '&::before': {
                            opacity: 1,
                            transform: 'translateX(0)'
                          }
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '3px',
                          background: variant === 'gainers' ? '#22c55e' : '#ef4444',
                          opacity: 0,
                          transform: 'translateX(-3px)',
                          transition: 'all 0.3s ease'
                        }
                      }}
                    >
                      <Box sx={{ 
                        position: 'relative', 
                        width: 24, 
                        height: 24,
                        filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))'
                      }}>
                        <Image
                          src={crypto.image}
                          alt={crypto.name}
                          fill
                          style={{ objectFit: 'contain' }}
                        />
                      </Box>
                      <Box sx={{ 
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5
                      }}>
                        <Typography 
                          sx={{ 
                            color: '#fff',
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {crypto.symbol.toUpperCase()}
                        </Typography>
                        <Typography
                          sx={{
                            color: variant === 'gainers' ? '#22c55e' : '#ef4444',
                            fontWeight: 'bold',
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {crypto.price_change_percentage_24h > 0 ? '+' : ''}
                          {crypto.price_change_percentage_24h.toFixed(2)}%
                        </Typography>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </AnimatePresence>
      </Box>
    </Paper>
  );
};

export default CryptoCard; 