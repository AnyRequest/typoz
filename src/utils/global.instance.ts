import type { Options } from '..';

export const DEFAULT_CONFIG: Options = {
  autoRender: true,
  mode: {
    erase: true,
    realTyping: false,
    divide: true,
  },
  speed: {
    write: 1,
    erase: 5,
  },
  delay: 3,
  nodes: [],
  querySelector: '.typoz',
  style: {
    cursor: {
      blink: true,
      blinkTime: 1,
      content: '',
      color: '#56565656',
      dir: 'vertical',
      size: 1,
      distance: 0.1,
    },
  },
};
