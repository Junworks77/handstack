syn.Config.IsViewMappingModel = false;

var isFileBusinessID = false;
if (syn.$r.getCookie('FileBusinessID') == null) {
    syn.$r.setCookie('FileBusinessID', '1');
    isFileBusinessID = true;
}

if (isFileBusinessID == false && syn.$w.getStorage('FileBusinessID') == null) {
    syn.$w.setStorage('FileBusinessID', '1');
}

$w.initializeScript({
    pageLoad: function () {
        // syn.$w.SSO = JSON.parse('{"UserID":"yn1950","UserName":"우본테스트","BusinessTel":"","BusinessEmail":"","DepartmentID":"1950","DepartmentName":"거점뉴영","OpenStatus":"2","LoginDateTime":"2020-12-07T08:41:27.9155384+09:00","Roles":["20"]}');
    },

    btnProfile1FileGetValue_click: function () {
        syn.$l.eventLog('btnProfile1FileGetValue_click', JSON.stringify($this.$fileclient.getValue('txtProfile1FileID')));
    },

    btnProfile1FileSetValue_click: function () {
        $this.$fileclient.setValue('txtProfile1FileID', 'e9259ffe12534c83957906bdb2ff7d6b');
    },

    btnProfile1FileClear_click: function () {
        $this.$fileclient.clear('txtProfile1FileID');
    },

    btnProfile1FileUpload_click: function () {
        var uploadOptions = $this.$fileclient.getFileSetting('txtProfile1FileID');
        uploadOptions.fileUpdateCallback = 'fleProfile1File_Callback';
        uploadOptions.dependencyID = syn.$l.get('txtProfile1DependencyID').value != '' ? syn.$l.get('txtProfile1DependencyID').value : $this.$fileclient.getTemporaryDependencyID('txtProfile1DependencyID');
        uploadOptions.minHeight = 360;
        uploadOptions.profileFileName = '{0}_{1}'.format(syn.$w.SSO.DepartmentID, syn.$w.SSO.UserID);

        $this.$fileclient.uploadUI(uploadOptions);
    },

    btnProfile1FileDownload_click: function () {
        $this.$fileclient.fileDownload('txtProfile1FileID');
    },

    fleProfile1File_Callback: function (action, result) {
        syn.$l.eventLog('btnProfile1GetItem_click', action + ', ' + JSON.stringify(result));
    },

    btnProfile1GetItem_click: function () {
        $this.$fileclient.getItem('txtProfile1FileID', syn.$l.get('txtProfile1FileID').value, function (result) {
            syn.$l.eventLog('btnProfile1GetItem_click', JSON.stringify(result));
        });
    },

    btnProfile1DeleteItem_click: function () {
        $this.$fileclient.deleteItem('txtProfile1FileID', syn.$l.get('txtProfile1FileID').value, function (result) {
            syn.$l.eventLog('btnProfile1DeleteItem_click', JSON.stringify(result));
        });
    },

    btnProfile1UpdateDependencyID_click: function () {
        $this.$fileclient.updateDependencyID('txtProfile1FileID', syn.$l.get('txtProfile1DependencyID').value, 'targetDependencyID', function (result) {
            syn.$l.eventLog('btnProfile1UpdateDependencyID_click', JSON.stringify(result));
        });
    },

    btnProfile1UpdateFileName_click: function () {
        $this.$fileclient.updateFileName('txtProfile1FileID', '10_12345', '1950_yn1950', function (result) {
            syn.$l.eventLog('btnProfile1UpdateFileName_click', JSON.stringify(result));
        });
    },

    btnSingleFileGetValue_click: function () {
        syn.$l.eventLog('btnSingleFileGetValue_click', JSON.stringify($this.$fileclient.getValue('txtSingleFileID')));
    },

    btnSingleFileSetValue_click: function () {
        $this.$fileclient.setValue('txtSingleFileID', 'e9259ffe12534c83957906bdb2ff7d6b');
    },

    btnSingleFileClear_click: function () {
        $this.$fileclient.clear('txtSingleFileID');
    },

    btnSingleFileUpload_click: function () {
        var uploadOptions = $this.$fileclient.getFileSetting('txtSingleFileID');
        uploadOptions.fileUpdateCallback = 'fleSingleFile_Callback';
        uploadOptions.dependencyID = syn.$l.get('txtSingleDependencyID').value != '' ? syn.$l.get('txtSingleDependencyID').value : $this.$fileclient.getTemporaryDependencyID('txtSingleDependencyID');
        uploadOptions.minHeight = 360;

        $this.$fileclient.uploadUI(uploadOptions);
    },

    btnSingleFileDownload_click: function () {
        $this.$fileclient.fileDownload('txtSingleFileID');
    },

    fleSingleFile_Callback: function (action, result) {
        syn.$l.eventLog('btnSingleGetItem_click', action + ', ' + JSON.stringify(result));
    },

    btnSingleGetItem_click: function () {
        $this.$fileclient.getItem('txtSingleFileID', syn.$l.get('txtSingleFileID').value, function (result) {
            syn.$l.eventLog('btnSingleGetItem_click', JSON.stringify(result));
        });
    },

    btnSingleDeleteItem_click: function () {
        $this.$fileclient.deleteItem('txtSingleFileID', syn.$l.get('txtSingleFileID').value, function (result) {
            syn.$l.eventLog('btnSingleDeleteItem_click', JSON.stringify(result));
        });
    },

    btnSingleUpdateDependencyID_click: function () {
        $this.$fileclient.updateDependencyID('txtSingleFileID', syn.$l.get('txtSingleDependencyID').value, 'targetDependencyID', function (result) {
            syn.$l.eventLog('btnSingleUpdateDependencyID_click', JSON.stringify(result));
        });
    },

    btnMultiFileGetValue_click: function () {
        syn.$l.eventLog('btnMultiFileGetValue_click', JSON.stringify($this.$fileclient.getValue('txtMultiFileID')));
    },

    btnMultiFileSetValue_click: function () {
        $this.$fileclient.setValue('txtMultiFileID', 'e9259ffe12534c83957906bdb2ff7d6b');
    },

    btnMultiFileClear_click: function () {
        $this.$fileclient.clear('txtMultiFileID');
    },

    btnMultiFileUpload_click: function () {
        var uploadOptions = $this.$fileclient.getFileSetting('txtMultiFileID');
        uploadOptions.fileUpdateCallback = 'fleMultiFile_Callback';
        uploadOptions.dependencyID = syn.$l.get('txtMultiDependencyID').value != '' ? syn.$l.get('txtMultiDependencyID').value : $this.$fileclient.getTemporaryDependencyID('txtMultiDependencyID');
        uploadOptions.minHeight = 360;

        $this.$fileclient.uploadUI(uploadOptions);
    },

    btnMultiFileDownload_click: function () {
        $this.$fileclient.fileDownload('txtMultiFileID');
    },

    fleMultiFile_Callback: function (action, result) {
        syn.$l.eventLog('btnMultiGetItem_click', action + ', ' + JSON.stringify(result));
    },

    btnMultiGetItem_click: function () {
        $this.$fileclient.getItem('txtMultiFileID', syn.$l.get('txtMultiItemID').value, function (result) {
            syn.$l.eventLog('btnMultiGetItem_click', JSON.stringify(result));
        });
    },

    btnMultiGetItems_click: function () {
        $this.$fileclient.getItems('txtMultiFileID', syn.$l.get('txtMultiDependencyID').value, function (result) {
            syn.$l.eventLog('btnMultiGetItem_click', JSON.stringify(result));
        });
    },

    btnMultiDeleteItem_click: function () {
        $this.$fileclient.deleteItem('txtMultiFileID', syn.$l.get('txtMultiItemID').value, function (result) {
            syn.$l.eventLog('btnMultiDeleteItem_click', JSON.stringify(result));
        });
    },

    btnMultiDeleteItems_click: function () {
        $this.$fileclient.deleteItems('txtMultiFileID', syn.$l.get('txtMultiDependencyID').value, function (result) {
            syn.$l.eventLog('btnMultiDeleteItems_click', JSON.stringify(result));
        });
    },

    btnMultiUpdateDependencyID_click: function () {
        $this.$fileclient.updateDependencyID('txtMultiFileID', syn.$l.get('txtMultiDependencyID').value, 'targetDependencyID', function (result) {
            syn.$l.eventLog('btnMultiUpdateDependencyID_click', JSON.stringify(result));
        });
    },

    btnImageLinkFileGetValue_click: function () {
        syn.$l.eventLog('btnImageLinkFileGetValue_click', JSON.stringify($this.$fileclient.getValue('txtImageLinkFileID')));
    },

    btnImageLinkFileSetValue_click: function () {
        $this.$fileclient.setValue('txtImageLinkFileID', 'e9259ffe12534c83957906bdb2ff7d6b');
    },

    btnImageLinkFileClear_click: function () {
        $this.$fileclient.clear('txtImageLinkFileID');
    },

    btnImageLinkFileUpload_click: function () {
        var uploadOptions = $this.$fileclient.getFileSetting('txtImageLinkFileID');
        uploadOptions.fileUpdateCallback = 'fleImageLinkFile_Callback';
        uploadOptions.dependencyID = syn.$l.get('txtImageLinkDependencyID').value != '' ? syn.$l.get('txtImageLinkDependencyID').value : $this.$fileclient.getTemporaryDependencyID('txtImageLinkDependencyID');
        uploadOptions.minHeight = 360;

        $this.$fileclient.uploadUI(uploadOptions);
    },

    btnImageLinkFileDownload_click: function () {
        $this.$fileclient.fileDownload('txtImageLinkFileID');
    },

    fleImageLinkFile_Callback: function (action, result) {
        syn.$l.eventLog('btnImageLinkGetItem_click', action + ', ' + JSON.stringify(result));
    },

    btnImageLinkGetItem_click: function () {
        $this.$fileclient.getItem('txtImageLinkFileID', syn.$l.get('txtImageLinkItemID').value, function (result) {
            syn.$l.eventLog('btnImageLinkGetItem_click', JSON.stringify(result));
        });
    },

    btnImageLinkGetItems_click: function () {
        $this.$fileclient.getItems('txtImageLinkFileID', syn.$l.get('txtImageLinkDependencyID').value, function (result) {
            syn.$l.eventLog('btnImageLinkGetItem_click', JSON.stringify(result));
        });
    },

    btnImageLinkDeleteItem_click: function () {
        $this.$fileclient.deleteItem('txtImageLinkFileID', syn.$l.get('txtImageLinkItemID').value, function (result) {
            syn.$l.eventLog('btnImageLinkDeleteItem_click', JSON.stringify(result));
        });
    },

    btnImageLinkDeleteItems_click: function () {
        $this.$fileclient.deleteItems('txtImageLinkFileID', syn.$l.get('txtImageLinkDependencyID').value, function (result) {
            syn.$l.eventLog('btnImageLinkDeleteItems_click', JSON.stringify(result));
        });
    },

    btnImageLinkUpdateDependencyID_click: function () {
        $this.$fileclient.updateDependencyID('txtImageLinkFileID', syn.$l.get('txtImageLinkDependencyID').value, 'targetDependencyID', function (result) {
            syn.$l.eventLog('btnImageLinkUpdateDependencyID_click', JSON.stringify(result));
        });
    }
});