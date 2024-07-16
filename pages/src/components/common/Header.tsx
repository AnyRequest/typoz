import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ColorModeContext } from '../../provider/ThemeProvider';
import { goTo } from '../../utils/features';
import { BASE_PATH, BRAND_NAME, VERSION } from '../../utils/global';

const menu = [
  {
    name: 'document',
    id: 'document',
    to: `${BASE_PATH}document`,
  },
  {
    name: 'Advanced',
    id: 'advanced',
    to: `${BASE_PATH}advanced`,
  },
  // { name: 'Installation', id: 'installation', to: '' },
  // { name: 'How to use', id: 'how-to-use', to: '' },
  // { name: 'Use cases', id: 'use-cases', to: '' },
  // { name: 'Contact', id: 'contact', to: '' },
];

function Header() {
  const navigate = useNavigate();
  const darkMode = useContext(ColorModeContext);
  const gnbRef = useRef(null);
  const [isFloat, setIsFloat] = useState(false);

  function handleFloat(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (entry.intersectionRatio === 0) {
        setIsFloat(true);
        darkMode.change('dark');
      } else {
        setIsFloat(false);
        darkMode.change('light');
      }
    });
  }

  useEffect(() => {
    const io = new IntersectionObserver(handleFloat);

    if (gnbRef.current) {
      io.observe(gnbRef.current);
    }
  }, []);

  return (
    <>
      <Box ref={gnbRef}></Box>
      <AppBar
        position={'fixed'}
        color="default"
        elevation={5}
        sx={{
          width: isFloat ? '100%' : '99%',
          top: isFloat ? 0 : 10,
          left: '50%',
          transform: 'translateX(-50%)',
          transition: 'top 5ms ease-in-out, width 150ms ease-in-out',
        }}
      >
        <Toolbar>
          <Stack
            direction="row"
            alignItems="center"
            component={Link}
            to={BASE_PATH}
            sx={{ textDecoration: 'none' }}
          >
            <Avatar
              variant="square"
              src={`${BASE_PATH}logo/${
                isFloat ? 'typoz-logo-w-fit.png' : 'typoz-logo-bw-fit.png'
              }`}
              slotProps={{
                img: {
                  sx: {
                    objectFit: 'contain',
                  },
                },
              }}
            />
            <Typography
              component="div"
              fontSize={(theme) => theme.typography.pxToRem(20)}
              fontWeight={700}
              sx={{ color: (theme) => theme.palette.text.primary }}
            >
              {BRAND_NAME}
              <Chip
                color="info"
                size="small"
                label={'v' + VERSION}
                sx={{
                  ml: 1,
                  fontSize: 10,
                  px: 0.1,
                  py: 0.3,
                  height: 'inherit',
                }}
              />
            </Typography>
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            {menu.map(({ name, id, to }) => (
              <Button
                key={name}
                color="inherit"
                onClick={() => (to ? navigate(to) : id ? goTo(id) : {})}
              >
                {name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Header;
