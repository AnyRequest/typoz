import Typoz from 'typoz';

const typoz = new Typoz();
typoz.initialize();
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

const controls = document.getElementById('controls');
let toggle = false;

function handleControl() {
  controls.innerHTML = !toggle ? 'resume' : 'pause';
  toggle = !toggle;
  typoz[!toggle ? 'resume' : 'pause']();
}

window.addEventListener('click', handleControl);
