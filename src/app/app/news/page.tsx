'use client';

import { useEffect, useState } from 'react';
import { Box, Container, Grid, Paper, Typography, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import Image from 'next/image';

interface NewsItem {
  title: string;
  description: string;
  url: string;
  thumb_2x: string;
  author: string;
  published_at: string;
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/news');
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const NewsCard = ({ news }: { news: NewsItem }) => (
    <Paper
      component="a"
      href={news.url}
      target="_blank"
      rel="noopener noreferrer"
      elevation={3}
      sx={{
        p: 3,
        height: '100%',
        background: 'rgba(13, 16, 45, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.2)',
          background: 'rgba(13, 16, 45, 0.98)',
        }
      }}
    >
      <Box sx={{ position: 'relative', width: '100%', height: 200, mb: 2 }}>
        <Image
          src={news.thumb_2x}
          alt={news.title}
          fill
          style={{ 
            objectFit: 'cover',
            borderRadius: '12px'
          }}
        />
      </Box>
      <Typography
        variant="h6"
        sx={{
          color: '#fff',
          mb: 2,
          fontWeight: 'bold',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minHeight: '60px'
        }}
      >
        {news.title}
      </Typography>
      <Typography
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          mb: 2,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flex: 1
        }}
      >
        {news.description}
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        mt: 2,
        pt: 2,
        borderTop: '1px solid rgba(99, 102, 241, 0.2)'
      }}>
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.9rem'
          }}
        >
          By {news.author}
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.9rem'
          }}
        >
          {formatDate(news.published_at)}
        </Typography>
      </Box>
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
            Cryptocurrency News
          </Typography>

          <Grid container spacing={4}>
            {isLoading ? (
              Array.from(new Array(8)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Paper
                    sx={{
                      p: 3,
                      height: '100%',
                      background: 'rgba(13, 16, 45, 0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      borderRadius: '20px',
                    }}
                  >
                    <Skeleton
                      variant="rectangular"
                      height={200}
                      sx={{
                        bgcolor: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: 2,
                        mb: 2
                      }}
                    />
                    <Skeleton
                      variant="text"
                      height={60}
                      sx={{
                        bgcolor: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: 1
                      }}
                    />
                    <Skeleton
                      variant="text"
                      height={80}
                      sx={{
                        bgcolor: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: 1
                      }}
                    />
                  </Paper>
                </Grid>
              ))
            ) : (
              news.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.url}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <NewsCard news={item} />
                  </motion.div>
                </Grid>
              ))
            )}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
} 