

let doStuff = function () {
    $('body').append('<div class="some-module"></div>');
};

describe("jquery!", ()=> {

    it('does stuff', function() {
        doStuff();
        expect($('div.some-module').length).to.eql(1);
    });

});