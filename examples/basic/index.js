import Typoz from 'typoz';

const typoz = new Typoz();
// The initialize method must be executed.
typoz.initialize();
// After running globalConfig, it automatically finds and executes typoz elements.
// typoz looks for the .typoz class name by default.
typoz.globalConfig();
