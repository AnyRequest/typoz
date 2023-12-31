import Typoz from 'typoz';

const typoz = new Typoz();
typoz.initialize();
typoz.globalConfig();

const controls = document.getElementById('controls');
let toggle = false;

function handleControl() {
  controls.innerHTML = !toggle ? 'resume' : 'pause';
  toggle = !toggle;
  typoz[!toggle ? 'resume' : 'pause']();
}

window.addEventListener('click', handleControl);
