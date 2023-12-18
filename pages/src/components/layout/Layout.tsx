import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Footer from '../common/Footer';
import Header from '../common/Header';

function Layout() {
  return (
    <Box>
      <Header />
      <Toolbar />
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}

export default Layout;
