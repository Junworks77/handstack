syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    btnSetElement_click: function () {
        var el = syn.$l.get('txtSetElement');
        syn.$v.setElement(el);
        el.value = (syn.$v.validations[el.id] == null ? false : true).toString();
    },
    btnRequired_click: function () {
        $validation.required(syn.$l.get('txtRequired'), 'txtRequired 텍스트 박스는 필수 입력입니다');
        $validation.required(syn.$l.get('txtSetElement'), 'txtSetElement 텍스트 박스는 필수 입력입니다');
        syn.$l.get('txtRequired').value = syn.$l.get('txtRequired').required.toString();
    },
    btnAddPattern_click: function () {
        var el = syn.$l.get('txtAddPattern');
        syn.$v.setElement(el);
        syn.$v.addPattern(syn.$l.get('txtAddPattern'), { 'expr': /[0-9]/, 'invalidMessage': 'txtAddPattern 텍스트 박스는 숫자만 입력 가능 합니다' });

        var isValid = syn.$v.validateControls(syn.$l.get('txtAddPattern'));

        if (isValid == false) {
            alert(JSON.stringify(syn.$v.invalidMessages));
            syn.$v.invalidMessages.length = 0;
        }
    },
    btnAddRange_click: function () {
        var el = syn.$l.get('txtAddRange');
        syn.$v.setElement(el);
        syn.$v.addRange(syn.$l.get('txtAddRange'), { 'min': 0, 'max': 6, 'minOperator': '<', 'maxOperator': '>', 'invalidMessage': '5글자 이상 입력 불가' });

        var isValid = syn.$v.validateControls(syn.$l.get('txtAddRange'));

        if (isValid == false) {
            alert(JSON.stringify(syn.$v.invalidMessages));
            syn.$v.invalidMessages.length = 0;
        }
    },
    btnAddCustom_click: function () {

        var el = syn.$l.get('txtAddCustom');
        syn.$v.setElement(el);
        syn.$v.addCustom(syn.$l.get('txtAddCustom'), { 'func': 'addCustomFunc', 'invalidMessage': '3자리 이상 12자리 미만의 값을 입력해야 합니다!' });
    },
    addCustomFunc: function () {
        console.log('addCustomFunc');
        // v....
        return false;
    },
    btnRemove_click: function () {
        var el = syn.$l.get('txtSetElement');
        syn.$v.setElement(el);
        syn.$v.remove(el);
    },
    btnClear_click: function () {
        var el = syn.$l.get('txtRequired');
        syn.$v.setElement(el);
        syn.$v.clear(el);
    },
    btnValidateControls_click: function () {
        var isValid = syn.$v.validateControls(syn.$l.get('txtRequired', 'txtSetElement'));

        if (isValid == false) {
            alert(JSON.stringify(syn.$v.invalidMessages));
            syn.$v.invalidMessages.length = 0;
        }
    },
    btntxtValidateForm_click: function () {
        isValid = syn.$l.get('txtValidateForm').value = syn.$v.validateForm();

        if (isValid == false) {
            alert(JSON.stringify(syn.$v.invalidMessages));
            syn.$v.invalidMessages.length = 0;
        }
    },
    btnToInvalidMessages_click: function () {
        syn.$l.get('txtToInvalidMessages').value =
            JSON.stringify(syn.$v.toInvalidMessages(syn.$l.get('txtRequired', 'txtSetElement')));

    },
    btnInit_click: function () {
        syn.$v.init((syn.$l.get('txtAddPattern')));
    }
})