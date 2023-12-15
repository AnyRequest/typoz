import { Typer } from 'anyrequest-typer';

const typer = new Typer();
typer.initialize();
typer.globalConfig({
  mode: {
    divide: true,
    erase: false,
  },
  nodes: [
    {
      select: '.typer',
      words: ['제주(祭主)가 되는 기도사(祈禱詞)'],
    },
  ],
});

// typer.render();

const controls = document.getElementById('controls');
let toggle = false;

function handleControl() {
  controls.innerHTML = !toggle ? 'resume' : 'pause';
  toggle = !toggle;
  typer[!toggle ? 'resume' : 'pause']();
}

window.addEventListener('click', handleControl);
