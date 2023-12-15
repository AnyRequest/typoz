import { Typoz } from 'typoz';

const typoz = new Typoz();
typoz.initialize();
typoz.globalConfig({
  mode: {
    divide: true,
    erase: false,
  },
  nodes: [
    {
      select: '.typer',
      words: ['다음 표시 될 내용을 추가할 수도 있습니다.'],
    },
  ],
});

// typer.render();

const controls = document.getElementById('controls');
let toggle = false;

function handleControl() {
  controls.innerHTML = !toggle ? 'resume' : 'pause';
  toggle = !toggle;
  typoz[!toggle ? 'resume' : 'pause']();
}

window.addEventListener('click', handleControl);
