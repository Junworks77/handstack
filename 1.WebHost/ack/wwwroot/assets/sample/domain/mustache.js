syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    people:
    {
        'name': 'Moe',
        'wrapped': function () {
            return function (text, render) {
                return '<b style="font-size: 20px;">' + render(text) + '</b>'
            }
        },
        'age': 13,
        peoples: [
            {
                'name': 'Moe',
                'age': 13
            },
            {
                'name': 'Larry',
                'age': 16

            },
            {
                'name': 'Curly',
                'age': 21
            },
            {
                'name': 'Jusun',
                'age': 36
            }
        ]
    },


    pageLoad: function () {

    },

    btnTemplate1_click: function () {
        var rendered = Mustache.render(syn.$l.get('template1').innerHTML, $this.people);
        syn.$l.get('divTemplateResult').innerHTML = rendered;
    },

    btnTemplate2_click: function () {
        var rendered = Mustache.render(syn.$l.get('template2').innerHTML, $this.people);
        syn.$l.get('divTemplateResult').innerHTML = rendered;
    }
});
