import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import { Box, IconButton, SxProps, Theme, Tooltip } from '@mui/material';
import { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
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
        ...sx,
      }}
    >
      <SyntaxHighlighter language={language} style={atomDark}>
        {code}
      </SyntaxHighlighter>
      <Tooltip title={copied ? 'Copied!' : ''} placement="right">
        <IconButton
          onClick={copyToClipboard}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            [copied ? 'color' : 'background']: (theme) =>
              copied
                ? theme.palette.success.main
                : theme.palette.background.default,
            '&:hover': {
              [copied ? 'color' : 'background']: (theme) =>
                copied
                  ? theme.palette.success.main
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
