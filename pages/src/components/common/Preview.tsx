import { Box, Paper, Stack, Typography } from '@mui/material';
import CodeBlock from './CodeBlock';

type PreviewProps = {
  title: string;
  desc: string;
  typozId?: string;
  typozClass?: string;
  lang: string;
  code: string;
  // children: ReactElement;
};

function Preview({
  title,
  desc,
  typozId,
  typozClass,
  lang,
  code,
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
      <Box sx={{ flex: 1 }}>
        <CodeBlock language={lang} code={code.trim()} />
      </Box>
    </Paper>
  );
}

export default Preview;
