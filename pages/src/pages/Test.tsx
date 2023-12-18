import { Box } from '@mui/material';
import { useEffect } from 'react';
import Typoz from 'typoz';

function Test() {
  useEffect(() => {
    const typoz = new Typoz();
    typoz.initialize();
    typoz.globalConfig({
      mode: { realTyping: true },
    });
    typoz
      .node()
      .select('#builder')
      .conf({
        delay: 1,
        speed: { write: 1, erase: 1 },
      })
      .write('안녕?!')
      .write(' ')
      .write('test word wa')
      .erase()
      .erase()
      .write('is')
      .write(' ')
      .write('oo')
      .move(-2)
      .write('g')
      .move(3)
      .write('d!22')
      .allErase()
      .pause(5)
      .write('done! 잘됐나?')
      .move(-1)
      .erase()
      .write('지!')
      .run();
  });

  return (
    <Box>
      <div className="typoz">테스트 내용입니다! 리얼 타이핑 적용.</div>
      <div id="builder">test</div>
    </Box>
  );
}

export default Test;
