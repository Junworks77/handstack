syn.Config.IsViewMappingModel = false;
/*
$layout.menus.push({
	PROGRAMID: 992,
	PROGRAMNAME: 'mainframeUIB',
	PARENTID: 9,
	PARENTNM: 'EasyWork 시스템',
	VIEWYN: '1',
	FNREAD: '1',
	FNUPDATE: '1',
	FN_PRINT: 'Y',
	FNEXCEL: '1',
	FNPREPRINT: '1',
	FOLDERYN: '0',
	ASSEMBLYNAME: 'UI',
	CLASSNAME: 'mainframeUIB',
	SORTNUM: 99,
	PROGRAMPATH: '/sample/UI/mainframeUIB.html'
});
 */
$w.initializeScript({
    pageLoad: function () {
        syn.$l.eventLog('pageLoad', JSON.stringify(syn.Config));

        if (syn.$w.getUIStorage('CUSTOMKEY')) {

            syn.$l.eventLog('storegeChanging', 'storageKey: {0}'.format(syn.$w.getUIStorage('CUSTOMKEY')));
            syn.$w.setUIStorage('UI', 'mainframeUIB', 'CUSTOMKEY', null);
		}
    },

    frameEvent: function (eventName, jsonObject) {
        syn.$l.eventLog('frameEvent', 'eventName: {0}, jsonObject: {1}'.format(eventName, JSON.stringify(jsonObject)));

        if (eventName == 'storegeChanging') {
            syn.$l.eventLog('storegeChanging', 'storageKey: {0}, storageValue: {1}'.format(jsonObject.storageKey, JSON.stringify(syn.$w.getUIStorage(jsonObject.storageKey))));
		}
    },

    btnTriggerUICommand_click: function () {
        syn.$w.triggerUICommand('UI', 'mainframeUIA', 'triggerFunction', 'B > A 전달 데이터');
    },

    triggerFunction: function (parameters) {
        console.log(parameters);
    }
});