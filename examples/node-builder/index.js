import Typoz from 'typoz';

const typoz = new Typoz();
// The initialize method must be executed.
typoz.initialize();
// After running globalConfig, it automatically finds and executes typoz elements.
// typoz looks for the .typoz class name by default.
typoz.globalConfig({
  mode: { realTyping: true },
});
// typoz node builder operates individually without running globalConfig.
typoz
  .node()
  .select('#node-builder')
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
