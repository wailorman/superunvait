const MODULE_NAME_STYLE = 'background-color: lightyellow; color: black;';
const MESSAGE_STYLE = 'background-color: none; color: none;';

export function log(module, message) {
    // todo: should work with forward slashes
    module = module.split('\\');
    module = module[module.length - 1];
    console.log(`%c ${module} %c: ${message}`, MODULE_NAME_STYLE, MESSAGE_STYLE);
}

export function error(module, message) {
    module = module.split('\\');
    module = module[module.length - 1];
    console.error(`%c ${module} %c: ${message}`, MODULE_NAME_STYLE, MESSAGE_STYLE);
}