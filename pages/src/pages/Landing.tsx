import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Typoz from 'typoz';
import CodeBlock from '../components/common/CodeBlock';
import { goTo } from '../utils/features';
import { BRAND_NAME, VERSION } from '../utils/global';

export default function Landing() {
  useEffect(() => {
    const typoz = new Typoz();
    typoz.initialize();
    typoz.globalConfig({
      nodes: [
        {
          select: '#head1',
          words: [''],
          config: {
            delay: 2,
            speed: {
              write: 3,
              erase: 5,
            },
            style: {
              cursor: {
                blink: true,
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
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        '& *': { transition: 'background-color 150ms ease-in-out' },
      }}
    >
      {/* Hero Section */}
      <Box id="about" sx={{ py: 6, px: 4, bgcolor: 'background.default' }}>
        <Container>
          <Stack direction={{ xs: 'column', lg: 'row' }} gap={3}>
            <Stack flex={1} gap={1}>
              <Typography
                id="head1"
                variant="h3"
                gutterBottom
                sx={{
                  height: { xs: '3.5em', lg: '2.5em' },
                  color: (theme) => theme.palette.text.primary,
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
                Bring your text to life with {BRAND_NAME}
              </Typography>
              <Typography
                id="head2"
                sx={{
                  color: 'text.secondary',
                  height: { xs: '3.5em', lg: '2.5em' },
                }}
              >
                Give your UI the dynamic text animation it deserves.
                Effortlessly configure and deploy typing animations with our
                library.
              </Typography>
              <Box>
                <Button
                  startIcon={'🚀'}
                  variant="contained"
                  color="success"
                  sx={{ mt: 2 }}
                  onClick={() => goTo('installation')}
                >
                  Get Started!
                </Button>
              </Box>
            </Stack>
            <Stack flex={1}>
              <CodeBlock
                sx={{
                  maxHeight: '70vh',
                  overflowY: 'auto',
                }}
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
            </Stack>
          </Stack>
          {/* <Grid container spacing={6}>
            <Grid item lg={6} md={12}></Grid>

            <Grid item lg={6} md={12}>
              
            </Grid>
          </Grid> */}
        </Container>
      </Box>

      {/* Installation Section */}
      <Box
        id="installation"
        sx={{ bgcolor: 'background.default', py: 6, px: 4 }}
      >
        <Container>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: (theme) => theme.palette.text.primary,
            }}
          >
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
            <Typography variant="h6">CDN</Typography>
            <CodeBlock
              language="html"
              code={`
<script src="https://www.unpkg.com/typoz@${VERSION}/dist/umd/typoz.min.js"></script>
              `}
            />
            <Typography variant="h6">NPM module</Typography>
            <CodeBlock language="bash" code={`npm install typoz`} />
            <CodeBlock language="bash" code={'pnpm add typoz'} />
          </Paper>
        </Container>
      </Box>

      {/* Where to Use Section */}
      <Box id="contact" sx={{ bgcolor: 'background.default', py: 6, px: 4 }}>
        <Container>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: (theme) => theme.palette.text.primary }}
          >
            Contact
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 4 }}>
            {BRAND_NAME} will continue to evolve, and we welcome your interest
            and contributions. 😁
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 4 }}>
            Email:{' '}
            <Typography
              component={Link}
              to="mailto:chaplet01@gmail.com"
              sx={{
                color: 'secondary.main',
                textDecoration: 'none',
              }}
            >
              chaplet01@gmail.com
            </Typography>
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            {/* Icon list here */}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
