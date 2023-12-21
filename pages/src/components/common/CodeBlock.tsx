import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import {
  Box,
  IconButton,
  Stack,
  SxProps,
  Theme,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import Prism from 'prismjs';

type CodeBlockProps = {
  filename?: string;
  language: string;
  code: string;
  folding?: boolean;
  sx?: SxProps<Theme>;
};

function CodeBlock({
  filename,
  language = 'javascript',
  code,
  folding = false,
  sx = {},
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [toggleFolding, setToggleFolding] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  function handleToggleFolding() {
    setToggleFolding(!toggleFolding);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }

  return (
    <Box
      sx={{
        transition: '150ms ease-in-out',
        overflow: 'hidden',
        position: 'relative',
        my: 2,
        borderRadius: '0.2em !important',
        '&::-webkit-scrollbar': {
          width: 5,
          height: 5,
          backgroundColor: 'inherit',
        },
        '&::-webkit-scrollbar-thumb': {
          width: 5,
          height: 5,
          backgroundColor: 'inherit',
        },
        '&::-webkit-scrollbar-corner': {
          width: 5,
          height: 5,
          backgroundColor: 'inherit',
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          color: 'background.default',
          backgroundColor: 'text.secondary',
          px: 2,
          py: 1,
          minHeight: 50,
        }}
      >
        <Typography textTransform={filename ? 'unset' : 'uppercase'}>
          {filename || language}
        </Typography>
        {folding && (
          <Tooltip title={toggleFolding ? '접기' : '열기'} placement="top">
            <IconButton size="small" onClick={handleToggleFolding}>
              {toggleFolding ? '📁' : '📂'}
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      <Box
        component="div"
        sx={{
          ...(folding && {
            pre: {
              transition: '150ms ease-in-out',
              ...(!toggleFolding
                ? {
                    filter: 'blur(2px)',
                    maxHeight: '50px',
                  }
                : {
                    maxHeight: '100vh',
                  }),
            },
          }),
        }}
      >
        <Box
          component="pre"
          sx={{
            my: '0 !important',
            '&::-webkit-scrollbar': {
              width: 5,
              height: 5,
              backgroundColor: 'inherit',
            },
            '&::-webkit-scrollbar-thumb': {
              width: 5,
              height: 5,
              backgroundColor: 'inherit',
            },
            '&::-webkit-scrollbar-corner': {
              width: 5,
              height: 5,
              backgroundColor: 'inherit',
            },
            ...sx,
          }}
        >
          <Box
            component="code"
            className={`language-${language}`}
            sx={{
              borderTopLeftRadius: '0 !important',
              borderTopRightRadius: '0 !important',
            }}
          >
            {code.trim()}
          </Box>
        </Box>
      </Box>
      <Tooltip title={copied ? 'Copied!' : ''} placement="right">
        <IconButton
          onClick={copyToClipboard}
          sx={{
            position: 'absolute',
            top: 56,
            right: 8,
            [copied ? 'color' : 'background']: (theme) =>
              copied
                ? theme.palette.primary.main
                : theme.palette.background.default,
            '&:hover': {
              [copied ? 'color' : 'background']: (theme) =>
                copied
                  ? theme.palette.primary.main
                  : theme.palette.background.default,
            },
          }}
        >
          {copied ? (
            <AssignmentTurnedInIcon />
          ) : (
            <IntegrationInstructionsIcon />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default CodeBlock;
