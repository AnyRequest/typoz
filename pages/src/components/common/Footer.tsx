import GitHubIcon from '@mui/icons-material/GitHub';
import { Box, Button, Container, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_PATH, BRAND_NAME, COPYRIGHT } from '../../utils/global';

function Footer() {
  const footerRef = useRef(null);
  // const [isFloat, setIsFloat] = useState(false);
  const [logoPath, setLogoPath] = useState(
    BASE_PATH + 'logo/typoz-logo-bw-fit.png',
  );

  function handleFloat(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (entry.intersectionRatio === 0) {
        setLogoPath(BASE_PATH + 'logo/typoz-logo-bw-fit.png');
      } else {
        setLogoPath(BASE_PATH + 'logo/typoz-logo-w-fit.png');
      }
    });
  }

  useEffect(() => {
    const io = new IntersectionObserver(handleFloat);

    if (footerRef.current) {
      io.observe(footerRef.current);
    }
  }, []);

  const menu = [
    {
      name: 'GITHUB',
      to: 'https://github.com/AnyRequest/typoz/tree/main',
      icon: <GitHubIcon />,
    },
    {
      name: 'NPM',
      to: 'https://www.npmjs.com/package/typoz?activeTab=readme',
      icon: (
        <Box
          component="svg"
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          width={18}
          height={18}
          sx={{
            fill: (theme) => theme.palette.text.primary,
          }}
        >
          <title>npm</title>
          <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
        </Box>
      ),
      color: '#CB3837',
    },
    {
      name: 'UPDATE',
      to: 'https://github.com/AnyRequest/typoz/blob/main/UPDATE.md',
      icon: (
        <Box
          component="img"
          src={logoPath}
          sx={{ width: 15, objectFit: 'contain' }}
        />
      ),
    },
  ];

  return (
    <Box
      ref={footerRef}
      component="footer"
      sx={{
        py: 3,
        borderTop: 1,
        borderColor: 'background.paper',
        bgcolor: 'background.paper',
      }}
    >
      <Container>
        <Typography variant="body2" color="text.secondary" align="center">
          © {COPYRIGHT}. {BRAND_NAME}. All rights reserved.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
          {menu.map(({ name, to, icon }) => (
            <Typography
              component={Link}
              key={name}
              to={to}
              target="_blank"
              color={(theme) => theme.palette.text.primary}
            >
              <Button startIcon={icon} size="small" color="inherit">
                {name}
              </Button>
            </Typography>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
