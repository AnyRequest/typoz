import KeyboardIcon from '@mui/icons-material/Keyboard';
import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  Toolbar,
  Typography,
  Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { BRAND_NAME, COPYRIGHT } from '../utils/global';
import Typoz from 'typoz';
import { useEffect } from 'react';
import CodeBlock from '../components/common/CodeBlock';

export default function Landing() {
  useEffect(() => {
    const typoz = new Typoz();
    typoz.initialize();
    typoz.globalConfig({
      style: {
        cursor: {
          blink: false,
          blinkTime: 0.5,
          dir: 'vertical',
          color: '#565656',
        },
      },
      nodes: [
        {
          select: '#head1',
          config: {
            delay: 0.5,
            speed: {
              write: 3,
              erase: 5,
            },
            style: {
              cursor: {
                dir: 'horizontal',
              },
            },
          },
        },
        {
          select: '#head2',
          config: {
            delay: 0.5,
            speed: {
              write: 3,
              erase: 5,
            },
          },
        },
      ],
    });
    return () => {
      typoz.destroy();
    };
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" color="default">
        <Toolbar>
          <Link to="#">
            <Button startIcon={<KeyboardIcon />}>{BRAND_NAME}</Button>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            {[
              'About',
              'How to use',
              'Use cases',
              'Installation',
              'Contact',
            ].map((text) => (
              <Link key={text} to="#">
                <Button>{text}</Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <Box sx={{ py: 6, px: 4 }}>
          <Container>
            <Grid container spacing={6}>
              <Grid item lg={6} md={12}>
                <Typography
                  id="head1"
                  variant="h3"
                  gutterBottom
                  sx={{
                    height: 112,
                    '&::after': {
                      display: 'inline-block',
                      content: '""',
                      height: '1em',
                      width: '10px',
                      ml: 1,
                      backgroundColor: '#56565656',
                    },
                  }}
                >
                  Bring your text to life with TypingEffect
                </Typography>
                <Typography
                  id="head2"
                  sx={{ color: 'text.secondary', height: 48 }}
                >
                  Give your UI the dynamic text animation it deserves.
                  Effortlessly configure and deploy typing animations with our
                  library.
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }}>
                  Get Started
                </Button>
              </Grid>
              <Grid item lg={6} md={12}>
                <CodeBlock
                  language="typescript"
                  code={`
const typoz = new Typoz();
typoz.initialize();
typoz.globalConfig({
  style: {
    cursor: {
      blink: true,
      blinkTime: 0.5,
      dir: 'vertical',
      color: '#565656',
    },
  },
  nodes: [
    {
      select: '#head1',
      config: {
        delay: 0.5,
        speed: {
          write: 3,
          erase: 5,
        },
        style: {
          cursor: {
            dir: 'horizontal',
          },
        },
      },
    },
    {
      select: '#head2',
      config: {
        delay: 0.5,
        speed: {
          write: 3,
          erase: 5,
        },
      },
    },
  ],
});
                `}
                />
                {/* Typing effect demo or image */}
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* How to Use Section */}
        <Box sx={{ bgcolor: 'background.paper', py: 6, px: 4 }}>
          <Container>
            <Typography variant="h4" gutterBottom>
              How to use
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 2 }}>
              Here's an example of how to use TypingEffect in your project.
            </Typography>
            {/* Code example */}
          </Container>
        </Box>

        {/* Installation Section */}
        <Box sx={{ bgcolor: 'background.default', py: 6, px: 4 }}>
          <Container>
            <Typography variant="h4" gutterBottom>
              Installation
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 2 }}>
              Installation is a breeze. Choose between CDN or npm.
            </Typography>
            <Paper
              component="pre"
              sx={{
                // bgcolor: 'primary.dark',
                // color: 'common.white',
                p: 2,
                borderRadius: 1,
              }}
            >
              <CodeBlock language="bash" code={`npm install typoz`} sx={{}} />
              <CodeBlock language="javascript" code={'pnpm add typoz'} />
            </Paper>
          </Container>
        </Box>

        {/* Where to Use Section */}
        <Box sx={{ bgcolor: 'background.paper', py: 6, px: 4 }}>
          <Container>
            <Typography variant="h4" gutterBottom>
              Where to Use
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 4 }}>
              TypingFX is versatile and can be used in a wide range of
              applications.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
              {/* Icon list here */}
            </Box>
          </Container>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{ py: 3, borderTop: 1, borderColor: 'divider' }}
      >
        <Container>
          <Typography variant="body2" color="text.secondary" align="center">
            © {COPYRIGHT}. {BRAND_NAME}. All rights reserved.
          </Typography>
          <Box
            sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}
          >
            {['Terms of Service', 'Privacy'].map((text) => (
              <Link key={text} to="#">
                <Button size="small">{text}</Button>
              </Link>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
