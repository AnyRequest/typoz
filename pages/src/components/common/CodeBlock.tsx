import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import {
  Box,
  IconButton,
  SxProps,
  Theme,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
// import SyntaxHighlighter from 'react-syntax-highlighter';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

type CodeBlockProps = {
  language: string;
  code: string;
  sx?: SxProps<Theme>;
};

function CodeBlock({ language = 'javascript', code, sx = {} }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

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
        position: 'relative',
        my: 2,
        borderRadius: '0.3em !important',
        overflow: 'hidden',
      }}
    >
      <Typography
        sx={{
          color: 'background.default',
          backgroundColor: 'text.secondary',
          px: 2,
          py: 1,
        }}
        textTransform={'uppercase'}
      >
        {language}
      </Typography>
      <Box
        component={SyntaxHighlighter}
        language={language}
        style={atomDark}
        sx={{
          my: '0 !important',
          borderTopLeftRadius: '0 !important',
          borderTopRightRadius: '0 !important',
          '&::-webkit-scrollbar': {
            width: 5,
            height: 5,
            backgroundColor: 'inherit',
          },
          '&::-webkit-scrollbar-thumb': {
            width: 5,
            height: 5,
            backgroundColor: (theme) => theme.palette.text.primary,
          },
          '&::-webkit-scrollbar-corner': {
            width: 5,
            height: 5,
            backgroundColor: 'inherit',
          },
          ...sx,
        }}
      >
        {code.trim()}
      </Box>
      <Tooltip title={copied ? 'Copied!' : ''} placement="right">
        <IconButton
          onClick={copyToClipboard}
          sx={{
            position: 'absolute',
            top: 48,
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
