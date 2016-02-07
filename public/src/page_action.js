import {
    runPostHunter,
    runTragometr,
    runMembersObserver
} from './actions'

$('#run-post-hunter').click(()=> {
    runPostHunter();
});

$('#run-tragometr').click(()=> {
    runTragometr();
});

$('#run-members-observer').click(()=> {
    runMembersObserver();
});