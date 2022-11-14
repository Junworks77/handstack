syn.Config.IsViewMappingModel = false;
/*
$layout.menus.push({
	PROGRAMID: 991,
	PROGRAMNAME: 'mainframeUIA',
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
	CLASSNAME: 'mainframeUIA',
	SORTNUM: 99,
	PROGRAMPATH: '/sample/UI/mainframeUIA.html'
});
 */
$w.initializeScript({
    pageLoad: function () {
        syn.$l.eventLog('pageLoad', JSON.stringify(syn.Config));
    },
    
    btnTriggerUICommand_click: function () {
        syn.$w.triggerUICommand('UI', 'mainframeUIB', 'triggerFunction', 'A > B 전달 데이터');
    },

    btnStatusMessage_click: function () {
        // window.$resource 목록 확인 필요
        syn.$w.statusMessage($res.retrieve);
    },

    btnUIStorage_click: function () {
        syn.$w.setUIStorage('UI', 'mainframeUIB', 'CUSTOMKEY', 'CUSTOMVALUE');
    },

    triggerFunction: function (parameters) {
        console.log(parameters);
    }
});