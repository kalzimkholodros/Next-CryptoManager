import { useState } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, MenuItem } from '@mui/material';
import { 
  CurrencyBitcoin, 
  Dashboard, 
  AccountBalance, 
  ShowChart, 
  Newspaper,
  Menu as MenuIcon 
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const pages = [
  { name: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { name: 'Portfolio', icon: <AccountBalance />, path: '/portfolio' },
  { name: 'Markets', icon: <ShowChart />, path: '/markets' },
  { name: 'News', icon: <Newspaper />, path: '/news' }
];

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const pathname = usePathname();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'rgba(13, 16, 45, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <CurrencyBitcoin 
              sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                mr: 1, 
                fontSize: 40,
                color: '#6366f1',
                filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))'
              }} 
            />
          </motion.div>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textDecoration: 'none',
              textShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
            }}
          >
            CRYPTOMASTER
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: '#6366f1' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  background: 'rgba(13, 16, 45, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(99, 102, 241, 0.1)',
                }
              }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.name} 
                  onClick={handleCloseNavMenu}
                  component={Link}
                  href={page.path}
                  sx={{
                    color: pathname === page.path ? '#6366f1' : '#fff',
                    background: pathname === page.path ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    '&:hover': {
                      background: 'rgba(99, 102, 241, 0.1)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {page.icon}
                    <Typography textAlign="center">{page.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 4, justifyContent: 'center' }}>
            {pages.map((page) => (
              <motion.div
                key={page.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  component={Link}
                  href={page.path}
                  sx={{
                    color: pathname === page.path ? '#6366f1' : '#fff',
                    display: 'flex',
                    gap: 1,
                    padding: '8px 16px',
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: pathname === page.path ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      opacity: 0,
                    },
                    '&:hover': {
                      color: '#6366f1',
                      '&::before': {
                        opacity: 1,
                      }
                    }
                  }}
                  startIcon={page.icon}
                >
                  {page.name}
                </Button>
              </motion.div>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outlined"
                sx={{
                  color: '#6366f1',
                  borderColor: '#6366f1',
                  borderRadius: '12px',
                  padding: '8px 24px',
                  '&:hover': {
                    borderColor: '#6366f1',
                    background: 'rgba(99, 102, 241, 0.1)',
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)'
                  }
                }}
              >
                Login
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  padding: '8px 24px',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #8b5cf6, #6366f1)',
                    boxShadow: '0 4px 30px rgba(99, 102, 241, 0.5)',
                  }
                }}
              >
                Sign Up
              </Button>
            </motion.div>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 