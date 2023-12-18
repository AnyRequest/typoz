import Typoz from 'typoz';

const typoz = new Typoz();
// The initialize method must be executed.
typoz.initialize();
// After running globalConfig, it automatically finds and executes typoz elements.
// typoz looks for the .typoz class name by default.
typoz.globalConfig({
  delay: 0.5,
  speed: {
    erase: 5,
    write: 5,
  },
  mode: {
    divide: true,
    erase: true,
  },
  nodes: [
    {
      select: '.typoz',
      words: ['다음 표시 될 내용을 추가할 수도 있습니다.'],
      config: {
        speed: {
          write: 5,
        },
      },
    },
  ],
});
