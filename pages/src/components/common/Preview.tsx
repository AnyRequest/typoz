import { Box, Paper, Stack, Typography } from '@mui/material';
import CodeBlock from './CodeBlock';
import { ReactElement } from 'react';

type PreviewProps = {
  title: string;
  desc: string;
  typozId?: string;
  typozClass?: string;
  lang: string;
  code: string;
  addCodes?: ReactElement | ReactElement[];
  // children: ReactElement;
};

function Preview({
  title,
  desc,
  typozId,
  typozClass,
  lang,
  code,
  addCodes,
}: PreviewProps) {
  return (
    <Paper
      component={Stack}
      gap={2}
      sx={{
        p: 3,
      }}
    >
      <Typography fontWeight={700} variant="h6">
        {title}
      </Typography>
      <Box
        {...(typozId && { id: typozId })}
        {...(typozClass && { className: typozClass })}
        sx={{
          minHeight: '3em',
        }}
      >
        {desc}
      </Box>
      <Stack gap={1} sx={{ flex: 1 }}>
        {addCodes}
        <CodeBlock language={lang} code={code.trim()} />
      </Stack>
    </Paper>
  );
}

export default Preview;
