'use strict';
let $tr1_1_basic = {
    hook: {
        pageLoad: function () {
            window.noUiSlider && (noUiSlider.create(document.getElementById('range-color'), {
                start: 40,
                connect: [true, false],
                step: 10,
                range: {
                    min: 0,
                    max: 100
                }
            }));
        }
    }
};
