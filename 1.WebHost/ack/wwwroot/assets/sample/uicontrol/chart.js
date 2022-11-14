syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    btnGetValue_click: function () {
        syn.$l.eventLog('btnGetValue_click', JSON.stringify($this.$chart.getValue('chtChart')));
    },

    btnSetValue_click: function () {
        var dataSource = [{
            name: '시리즈 1',
            data: [121, 140, 324]
        }, {
            name: '시리즈 2',
            data: [552, 271, 513]
        }, {
            name: '시리즈 3',
            data: [823, 257, 732]
        }];

        $this.$chart.setValue('chtChart', dataSource);
    },

    btnClear_click: function () {
        $this.$chart.clear('chtChart');
    }
});