"use strict";

const ROW = '.charts_list_i.soh-s';
const ROW__untouched = '.charts_list_i_cell:not(.tragometr)';

const ROW__COLUMN = '.charts_list_i_cell';

const ROW__COLUMN__COUNTER = '.charts_count.__overview';


// fix columns width
$(ROW__untouched).css({minWidth: 105});

$(ROW).each((i, row)=> {

    let tragometr = $(row).find('.tragometr');
    let noTragometrInRowYet = tragometr.length == 0;

    if (noTragometrInRowYet) {
        // dirty means html from element (may contains &nbsp; and others which
        // parseInt can't parse correctly)
        let reachDirty = $($(row).find(ROW__COLUMN)[1]).find(ROW__COLUMN__COUNTER).html();
        let feedbackDirty = $($(row).find(ROW__COLUMN)[2]).find(ROW__COLUMN__COUNTER).html();

        let reach = parseInt(_.join(reachDirty.match(/\d/g), ''));
        let feedback = parseInt(_.join(feedbackDirty.match(/\d/g), ''));

        let tragocent = ( feedback / reach ) * 100;
        let roundedTragocent = _.round(tragocent, 2);
        debugger;
        $(row).append(`<div class="charts_list_i_cell tragometr" style="width:50px;min-width:0px;">${roundedTragocent}</div>`);
    }

});