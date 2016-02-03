import { runPostHunter, runTragometr } from './actions'

$('#run-post-hunter').click(()=> {
    runPostHunter();
});

$('#run-tragometr').click(()=> {
    runTragometr();
});