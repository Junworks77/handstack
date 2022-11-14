syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    pageLoad: function () {
    
    },

    btnGetValue_click: function () {
        syn.$l.eventLog('btnGetValue_click', JSON.stringify($this.$tree.getValue('tvlTreeView')));
    },

    btnSetValue_click: function () {
        debugger;
        $this.$tree.setValue('tvlTreeView', dataSet);
    },

    btnClear_click: function () {
        $this.$tree.clear('tvlTreeView');
    },

    btnGetControl_click: function () {
        var tvlTreeView = $this.$tree.getControl('tvlTreeView');
        // https://github.com/mar10/fancytree/wiki
        // https://wwwendt.de/tech/fancytree/demo/#welcome.html
        // https://wwwendt.de/tech/fancytree/doc/jsdoc/global.html#NodeData
    },

    tvlTreeView_click: function (evt, data) {
        syn.$l.eventLog('tvlTreeView_click', '');
    },

    tvlTreeView_dblclick: function (evt, data) {
        syn.$l.eventLog('tvlTreeView_dblclick', '');
    },

    tvlTreeView_select: function (evt, data) {
        debugger;
        syn.$l.eventLog('tvlTreeView_select', '');
        // $this.$tree.setSelectedAll('tvlTreeView', data.node);
    },

    ctxTreeItem_beforeOpen: function (evt, ui) {
        var node = $.ui.fancytree.getNode(ui.target);
        syn.$l.eventLog('ctxTreeItem_beforeOpen', 'before open ' + ui.cmd + ' on ' + node);
    },

    ctxTreeItem_select: function (evt, ui) {
        var node = $.ui.fancytree.getNode(ui.target);
        syn.$l.eventLog('ctxTreeItem_select', 'select ' + ui.cmd + ' on ' + node);
    },

    btnOpenTreeView_click: function () {
        var dialogOptions = $reflection.clone(syn.$w.dialogOptions);
        dialogOptions.minWidth = 340;
        dialogOptions.minHeight = 240;

        syn.$l.querySelector('#htmlTemplete > h3').innerText = '테스트';
        syn.$w.showDialog(syn.$l.get('htmlTemplete'), dialogOptions);
    }
});

var dataSet = [
    {
        "PROGRAMID": 1,
        "PROGRAMNAME": "B2B섬유소재플랫폼",
        "PARENTID": null,
        "PARENTNM": "",
        "VIEWYN": "1",
        "FOLDERYN": "1",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "",
        "SEQ": 1
    },
    {
        "PROGRAMID": 101,
        "PROGRAMNAME": "AI 서비스",
        "PARENTID": 1,
        "PARENTNM": "B2B섬유소재플랫폼",
        "VIEWYN": "1",
        "FOLDERYN": "1",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "",
        "SEQ": 100
    },
    {
        "PROGRAMID": 110,
        "PROGRAMNAME": "AI 서비스",
        "PARENTID": 101,
        "PARENTNM": "AI 서비스",
        "VIEWYN": "1",
        "FOLDERYN": "1",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "",
        "SEQ": 100
    },
    {
        "PROGRAMID": 111,
        "PROGRAMNAME": "AI 서비스 관리",
        "PARENTID": 110,
        "PARENTNM": "AI 서비스",
        "VIEWYN": "1",
        "FOLDERYN": "0",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "AIS010",
        "SEQ": 100
    },
    {
        "PROGRAMID": 112,
        "PROGRAMNAME": "학습 모델 관리",
        "PARENTID": 110,
        "PARENTNM": "AI 서비스",
        "VIEWYN": "1",
        "FOLDERYN": "0",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "AIM010",
        "SEQ": 100
    },


    {
        "PROGRAMID": 201,
        "PROGRAMNAME": "프로모션",
        "PARENTID": 1,
        "PARENTNM": "B2B섬유소재플랫폼",
        "VIEWYN": "1",
        "FOLDERYN": "1",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "",
        "SEQ": 200
    },
    {
        "PROGRAMID": 210,
        "PROGRAMNAME": "메시지 템플릿",
        "PARENTID": 201,
        "PARENTNM": "프로모션",
        "VIEWYN": "1",
        "FOLDERYN": "1",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "",
        "SEQ": 200
    },
    {
        "PROGRAMID": 211,
        "PROGRAMNAME": "이메일/알림톡 템플릿",
        "PARENTID": 210,
        "PARENTNM": "메시지 템플릿",
        "VIEWYN": "1",
        "FOLDERYN": "0",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "EML010",
        "SEQ": 200
    },
    {
        "PROGRAMID": 220,
        "PROGRAMNAME": "메시지 발송",
        "PARENTID": 201,
        "PARENTNM": "프로모션",
        "VIEWYN": "1",
        "FOLDERYN": "1",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "",
        "SEQ": 200
    },
    {
        "PROGRAMID": 221,
        "PROGRAMNAME": "메일 발송",
        "PARENTID": 220,
        "PARENTNM": "메시지 발송",
        "VIEWYN": "1",
        "FOLDERYN": "0",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "PMS010",
        "SEQ": 200
    },
    {
        "PROGRAMID": 222,
        "PROGRAMNAME": "알림톡 발송",
        "PARENTID": 220,
        "PARENTNM": "메시지 발송",
        "VIEWYN": "1",
        "FOLDERYN": "0",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "PMS020",
        "SEQ": 200
    },
    {
        "PROGRAMID": 230,
        "PROGRAMNAME": "메시지 발송 이력",
        "PARENTID": 201,
        "PARENTNM": "프로모션",
        "VIEWYN": "1",
        "FOLDERYN": "1",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "",
        "SEQ": 200
    },
    {
        "PROGRAMID": 231,
        "PROGRAMNAME": "메일 발송 이력",
        "PARENTID": 230,
        "PARENTNM": "메시지 발송 이력",
        "VIEWYN": "1",
        "FOLDERYN": "0",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "PML010",
        "SEQ": 200
    },
    {
        "PROGRAMID": 232,
        "PROGRAMNAME": "알림톡 발송 이력",
        "PARENTID": 230,
        "PARENTNM": "메시지 발송 이력",
        "VIEWYN": "1",
        "FOLDERYN": "0",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "PML020",
        "SEQ": 200
    },



    {
        "PROGRAMID": 301,
        "PROGRAMNAME": "환경설정",
        "PARENTID": 1,
        "PARENTNM": "B2B섬유소재플랫폼",
        "VIEWYN": "1",
        "FOLDERYN": "1",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "",
        "SEQ": 300
    },
    {
        "PROGRAMID": 310,
        "PROGRAMNAME": "계정관리",
        "PARENTID": 301,
        "PARENTNM": "환경설정",
        "VIEWYN": "1",
        "FOLDERYN": "1",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "",
        "SEQ": 300
    },
    {
        "PROGRAMID": 311,
        "PROGRAMNAME": "사용자관리",
        "PARENTID": 310,
        "PARENTNM": "계정관리",
        "VIEWYN": "1",
        "FOLDERYN": "0",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "USR010",
        "SEQ": 300
    },
    {
        "PROGRAMID": 312,
        "PROGRAMNAME": "프로모션수신사용자그룹",
        "PARENTID": 310,
        "PARENTNM": "계정관리",
        "VIEWYN": "1",
        "FOLDERYN": "0",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "USR020",
        "SEQ": 300
    },
    {
        "PROGRAMID": 313,
        "PROGRAMNAME": "외부서비스계정",
        "PARENTID": 310,
        "PARENTNM": "계정관리",
        "VIEWYN": "1",
        "FOLDERYN": "0",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "USR030",
        "SEQ": 300
    },
    {
        "PROGRAMID": 320,
        "PROGRAMNAME": "외부서비스",
        "PARENTID": 301,
        "PARENTNM": "환경설정",
        "VIEWYN": "1",
        "FOLDERYN": "1",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "",
        "SEQ": 300
    },
    {
        "PROGRAMID": 321,
        "PROGRAMNAME": "스킬/메일발송서버",
        "PARENTID": 320,
        "PARENTNM": "외부서비스",
        "VIEWYN": "1",
        "FOLDERYN": "0",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "SVR010",
        "SEQ": 300
    },
    {
        "PROGRAMID": 322,
        "PROGRAMNAME": "챗봇 오픈빌더",
        "PARENTID": 320,
        "PARENTNM": "외부서비스",
        "VIEWYN": "1",
        "FOLDERYN": "0",
        "ASSEMBLYNAME": "DWP",
        "CLASSNAME": "URL|https://accounts.kakao.com/login/kakaobusiness?continue=https://i.kakao.com/openbuilder",
        "SEQ": 300
    }
];
