syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    btnGetValue_click: function () {
        syn.$l.eventLog('btnGetValue_click', JSON.stringify($this.$datepicker.getValue('dtpDatePicker')));
    },

    btnSetValue_click: function () {
        $this.$datepicker.setValue('dtpDatePicker', '2020-02-28');
    },

    btnClear_click: function () {
        $this.$datepicker.clear('dtpDatePicker');
    },

    btnGetControl_click: function () {
        var picker = $this.$datepicker.getControl('dtpDatePicker');
        // https://github.com/Pikaday/Pikaday 메서드 참조
    }
});