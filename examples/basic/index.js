import Typoz from 'typoz';

const typoz = new Typoz();
// The initialize method must be executed.
typoz.initialize();
// After running globalConfig, it automatically finds and executes typoz elements.
// typoz looks for the .typoz class name by default.
typoz.globalConfig();

typoz
  .createBuilder()
  .select('#test')
  .config()
  .write('안녕하세요', 1)
  .pause(1)
  .move(-3, 2)
  .move(2)
  .run();

let toggle = false;

window.addEventListener('click', () => {
  const node = typoz.typeBuilderNodes[0];
  if (node) {
    if (toggle) {
      node.resumeRender();
      toggle = !toggle;
    } else {
      node.pauseRender();
      toggle = !toggle;
    }
  }
});
