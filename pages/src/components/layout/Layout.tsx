import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <Box>
      <Outlet />
    </Box>
  );
}

export default Layout;
