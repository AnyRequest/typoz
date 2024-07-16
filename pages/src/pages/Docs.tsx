import { Box, Container, Stack, Typography } from '@mui/material';
import CodeBlock from '../components/common/CodeBlock';
import { BRAND_NAME } from '../utils/global';
import Preview from '../components/common/Preview';
import { useEffect } from 'react';
import Typoz from 'typoz';

function Docs() {
  useEffect(() => {
    const typoz = new Typoz();
    typoz.initialize();
    typoz.globalConfig({
      nodes: [
        {
          select: '#target',
        },
      ],
    });
    typoz
      .createBuilder()
      .select('#non-loop-node-builder')
      .config({
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
      .run();

    typoz
      .createBuilder()
      .select('#loop-node-builder-with-erase-motion')
      .config({
        speed: {
          write: 2,
        },
      })
      .write('지우기 모션이 있는 무한 반복 예시입니다.')
      .forever();

    typoz
      .createBuilder()
      .select('#loop-node-builder-without-erase-motion')
      .config({
        speed: {
          write: 2,
        },
      })
      .write('지우기 모션이 없는 무한 반복 예시입니다.')
      .forever(true);
    return () => {
      typoz.destroy();
    };
  }, []);
  return (
    <Box id="how-to-use" sx={{ bgcolor: 'background.paper', py: 6, px: 4 }}>
      {/* How to Use Section */}
      <Container>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: (theme) => theme.palette.text.primary }}
        >
          How to use
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          Here's an example of how to use {BRAND_NAME} in your project.
        </Typography>

        {/* Configuration */}

        <Stack
          direction={{
            xs: 'column',
            lg: 'row',
          }}
          gap={3}
        >
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ color: (theme) => theme.palette.text.primary }}
            >
              Configuration
            </Typography>
            <Typography
              component="div"
              sx={{ flex: 1, color: 'text.secondary', mb: 2 }}
            >
              When setting options in
              <Box
                component="code"
                sx={{
                  ml: 1,
                  borderRadius: 1,
                  px: 0.7,
                  py: 0.3,
                  color: '#ffffff',
                  backgroundColor: (theme) => theme.palette.secondary.main,
                }}
              >
                globalConfig
              </Box>
              , entering only the desired attributes will retain the rest of the
              default values.
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <CodeBlock
              sx={{ maxHeight: 300, overflowY: 'auto' }}
              language="typescript"
              code={`
const typoz = new Typoz();
typoz.initialize();
// 기본적으로 .typoz 클래스를 가지고 있는 요소를 탐색하고
// globalConfig호출 시 자동 렌더링 합니다.
// 자동 렌더링을 비활성화하려면 autoRender를 false로 지정하세요.
typoz.globalConfig(
/* {
// 자동 렌더링 여부
autoRender: true,

mode: {
// 지우기 모션 여부
erase: true,
// 현실감 여부
realTyping: false,
// true면 한 글자에 span태그로 감싸여진 상태로, false면 텍스트로 렌더링
divide: true,
},

speed: {
// 쓰기 속도 [높을수록 빠름]
write: 1,
// 지우기 속도 [높을수록 빠름]
erase: 5,
},

// 다음 렌더링 전 휴식시간 [높을수록 길어짐]
delay: 3,

// 커스텀 노드 [default: []]
nodes: [
// select를 찾지 못하면 에러 로그가 발생하고, 어느 요소가 누락되었는지 알립니다.
{ select: '#test', words: ['추가 텍스트'], config: {동일한 config} },
],

// 자동 렌더링 대상 클래스 또는 아이디 커스텀
// .my-typing 으로 변경 시 my-typing 클래스로 탐색
querySelector: '.typoz',

style: {
cursor: {
  // 커서 색상
  color: '#56565656',
  // 커서 수직, 수평 방향 조정
  dir: 'vertical',
  // 커서 사이즈
  size: 1,
},
},
} */);
        `}
            />
          </Box>
        </Stack>

        {/* default modee */}
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: (theme) => theme.palette.text.primary }}
        >
          Usage
        </Typography>
        <Stack gap={5}>
          {/* exam 1 */}

          <Preview
            typozClass="typoz"
            title="Auto Rendering"
            desc="기본 사용방법입니다. 자동 렌더링 예시입니다."
            lang="javascript"
            code={`
// auto render
const typoz = new Typoz();
typoz.initialize();
typoz.globalConfig();`}
            addCodes={
              <CodeBlock
                language={'html'}
                code={`
<div class="typoz">기본 사용방법입니다. 자동 렌더링 예시입니다.</div>
        `}
              />
            }
          />

          {/* exam 2 */}
          <Preview
            typozClass="typoz"
            title="Manual Rendering"
            desc="기본 사용방법입니다. 수동 렌더링 예시입니다."
            lang="javascript"
            code={`
// manual render
const typoz = new Typoz();
typoz.initialize();
typoz.globalConfig({
autoRender: false,
});

// ... other processes ...
typoz.render();`}
            addCodes={
              <CodeBlock
                language={'html'}
                code={`
<div class="typoz">기본 사용방법입니다. 수동 렌더링 예시입니다.</div>
`}
              />
            }
          />

          {/* exam 2 */}
          <Preview
            typozId="target"
            title="Specified TypeNode"
            desc="지정된 노드 사용방법입니다."
            lang="javascript"
            code={`
const typoz = new Typoz();
typoz.initialize();
typoz.globalConfig({
nodes: [
{
select: '#target',
}
]`}
            addCodes={
              <CodeBlock
                language={'html'}
                code={`
<div id="target">지정된 노드 사용방법입니다.</div>
`}
              />
            }
          />

          {/* exam 3 */}
          <Preview
            typozId="non-loop-node-builder"
            title="TypeBuilder: non-loop"
            desc="이 내용은 표시되지 않습니다."
            lang="javascript"
            code={`
const typoz = new Typoz();
typoz
.createBuilder()
.select('#non-loop-node-builder')
.config({
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
.run();`}
            addCodes={
              <CodeBlock
                language={'html'}
                code={`
<div id="non-loop-node-builder">이 내용은 표시되지 않습니다.</div>
`}
              />
            }
          />

          {/* exam 4 */}
          <Preview
            typozId="loop-node-builder-with-erase-motion"
            title="TypeBuilder: loop with erase motion"
            desc="이 내용은 표시되지 않습니다."
            lang="javascript"
            code={`
const typoz = new Typoz();
typoz
.createBuilder()
.select('#loop-node-builder-with-erase-motion')
.config({
speed: {
  write: 2,
},
})
.write('지우기 모션이 있는 무한 반복 예시입니다.')
/**
* @param {boolean=false} skipErase if true, deactivate erase motion
*/
.forever();`}
            addCodes={
              <CodeBlock
                language={'html'}
                code={`
<div id="loop-node-builder-with-erase-motion">이 내용은 표시되지 않습니다.</div>
`}
              />
            }
          />

          {/* exam 5 */}
          <Preview
            typozId="loop-node-builder-without-erase-motion"
            title="TypeBuilder: loop without erase motion"
            desc="이 내용은 표시되지 않습니다."
            lang="javascript"
            code={`
const typoz = new Typoz();
typoz
.createBuilder()
.select('#loop-node-builder-without-erase-motion')
.config({
speed: {
  write: 2,
},
})
.write('지우기 모션이 없는 무한 반복 예시입니다.')
.forever(true);`}
            addCodes={
              <CodeBlock
                language={'html'}
                code={`
<div id="loop-node-builder-without-erase-motion">이 내용은 표시되지 않습니다.</div>
`}
              />
            }
          />
        </Stack>
      </Container>
    </Box>
  );
}

export default Docs;
