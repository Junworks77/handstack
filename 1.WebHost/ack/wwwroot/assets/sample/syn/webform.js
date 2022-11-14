syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    pageLoad: function () {
        syn.$l.get('txtVersion').value = syn.$w.version;
        syn.$l.get('txtLocaleID').value = syn.$w.localeID;
        syn.$l.get('txtDefaultControlOptions').value = JSON.stringify(syn.$w.defaultControlOptions);
    },
    btnSetStorage_click: function () {
        syn.$w.setStorage('txtSetStorage', syn.$l.get('txtSetStorage').value, syn.$l.get('chkLocalStorage').checked);
        alert('$w.setStorage 완료');
    },
    btnGetStorage_click: function () {
        syn.$l.get('txtGetStorage').value = syn.$w.getStorage('txtSetStorage', syn.$l.get('chkLocalStorage').checked);
    },
    btnRemoveStorage_click: function () {
        syn.$l.get('txtRemoveStorage').value = syn.$w.removeStorage('txtSetStorage', syn.$l.get('chkLocalStorage').checked);
    },
    btnRemoveStorage_blur: function () {
        syn.$l.get('txtRemoveStorage').value = 'blur !!!';
    },
    txtInnerHTML_click: function () {
        syn.$l.get('txtInnerHTML').value = 'HTML 변경 완료!';
    },
    btnInnerText_click: function () {
        syn.$l.get('txtInnerText').value = syn.$l.get('txtInnerText2').innerText;
    },
    btnActiveControl_click: function () {
        syn.$l.get('txtActiveControl').value = 'activeControl - ' + syn.$w.activeControl().id;
    },
    btnHasAutoFocus_click: function () {
        syn.$l.get('txtHasAutoFocus').value = syn.$w.hasAutoFocus();
    },
    btnCreateSelection_click: function () {
        syn.$w.createSelection(syn.$l.get('txtCreateSelection'), 0, 10);
    },
    btnGetClassRegEx_click: function () {
        syn.$l.get('txtGetClassRegEx').value = syn.$w.getClassRegEx('view').test(syn.$l.get('txtGetClassRegEx').className);
    },
    btnArgumentsExtend_click: function () {
        var parameter = {
            aaaa: 1234,
            bbbb: '2222'
        };

        var func = function (arg) {
            var parameter = {
                aaaa: 0,
                bbbb: '',
                cccc: false
            };
            var copyParameter = syn.$w.argumentsExtend(parameter, arg);

            parameter.cccc = 'hello world';

            syn.$l.get('txtArgumentsExtend').value = JSON.stringify(copyParameter);
        }

        func(parameter);
    },
    btnLoadJSON_click: function () {
        syn.$w.loadJson('JsonExample/json.json', null, function (module, jsonObject) {
            syn.$l.get('txtLoadJSON').value = JSON.stringify(module) + ', ' + JSON.stringify(jsonObject);
        });
    },
    btnStart_click: function () {
        syn.$l.get('txtStart').value = new Date(syn.$w.start);
    }
});