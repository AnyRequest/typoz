import { Box } from '@mui/material';
import { useEffect } from 'react';
import Typoz from 'typoz';

function Test() {
  useEffect(() => {
    const typoz = new Typoz();
    typoz.initialize();
    typoz.globalConfig({
      mode: { realTyping: true },
      speed: { write: 1 },
    });
    typoz
      .node()
      .select('#builder')
      .conf({
        speed: {
          write: 2,
        },
      })
      .write('Write the entire text')
      .write(' ')
      .write('r')
      .move(-1)
      .write('o')
      .move(2)
      .write(' ')
      .write('type each character individually.')
      .write(' 한글과 영어')
      .pause(1)
      .erase()
      .erase()
      .write('숫자')
      .pause(1)
      .erase()
      .erase()
      .write('여러 문자 등 작성 가능합니다.')
      .move(-7)
      .write(', 추가 작성도')
      .forever(true);
  });

  return (
    <Box>
      <div className="typoz">테스트 내용입니다! 리얼 타이핑 적용.</div>
      <div id="builder">test</div>
    </Box>
  );
}

export default Test;
