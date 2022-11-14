syn.Config.IsViewMappingModel = false;

$w.initializeFormScript({
    managerID: 'ProfileFileUpload',
    fileUploadOptions: null,
    profileFileName: null,
    fileUpdateCallback: null,
    uploadCount: 0,
    uploadExtensions: '*/*',
    uploadDependencyID: null,

    controlInit: function (elID, controlOptions) {
        if (elID == 'qfcFileClient') {
            controlOptions.repositoryID = syn.$r.query('repositoryID');
            return controlOptions;
        }
    },

    pageLoad: function () {
        if (syn.Config.FileBusinessIDSource && syn.Config.FileBusinessIDSource != 'None') {
            if (syn.Config.FileBusinessIDSource == 'Cookie') {
                $this.$fileclient.businessID = syn.$r.getCookie('FileBusinessID');
            }
            else if (syn.Config.FileBusinessIDSource == 'SessionStorage') {
                $this.$fileclient.businessID = syn.$w.getStorage('FileBusinessID');
            }
        }

        if ($string.isNullOrEmpty($this.$fileclient.businessID) == true) {
            $this.$fileclient.businessID = syn.$w.SSO.WorkCompanyNo;
        }

        if ($string.isNullOrEmpty($this.$fileclient.businessID) == true) {
            syn.$l.eventLog('$fileclient.controlLoad', '파일 컨트롤 초기화 오류, 파일 업무 ID 정보 확인 필요', 'Warning');
            return;
        }

        $this.fileUploadOptions = parent.fileUploadOptions;
        $this.profileFileName = $this.fileUploadOptions.profileFileName;
        $this.uploadDependencyID = $this.fileUploadOptions.dependencyID;
        $this.fileUpdateCallback = $this.fileUploadOptions.fileUpdateCallback;

        $this.$fileclient.init('ProfileFileUpload', syn.$l.get('divProfilePicture'), $this.fileUploadOptions, $this.fileChangeHandler);
        $this.initFileUploadUI();
    },

    initFileUploadUI: function () {
        var fileManager = $this.$fileclient.getFileManager($this.managerID);
        var uploadSetting = fileManager.datas;

        $this.$fileclient.setDependencyID($this.managerID, $this.uploadDependencyID);

        $this.$fileclient.getItems($this.managerID, $this.uploadDependencyID, function (repositoryItems) {
            $this.uploadExtensions = uploadSetting.uploadExtensions;
            $this.uploadCount = uploadSetting.uploadCount;

            // Repository에 등록된 uploadCount와 업로드된 아이템의 갯수를 비교하여 FileUpload UI 항목를 화면에 추가합니다.
            for (var i = 0; i < $this.uploadCount - repositoryItems.length; i++) {
                $this.$fileclient.addFileUI($this.managerID, uploadSetting.accept);
            }

            // 업로드된 아이템의 갯수만큼 FileDownload UI 항목를 화면에 추가합니다.
            if (repositoryItems.length > 0) {
                var repositoryItem = repositoryItems[0];
                syn.$l.get('imgProfilePicture').src = repositoryItem.AbsolutePath + (repositoryItem.AbsolutePath.indexOf('?') == -1 ? '?' : '&') + 'ext=' + repositoryItem.Extension;
                syn.$l.get('imgProfilePicture').item = repositoryItem;

                $m.setStyle(syn.$l.get('btnUploadFileDelete'), 'display', 'inline-block');
                $m.setStyle(syn.$l.get('btnUploadFileDownload'), 'display', 'inline-block');
            }
        });
    },

    fileChangeHandler: function (el, fileItem) {
        var mimeType = fileItem.type;
        if (mimeType.indexOf('image') > -1) {
            var ext = mimeType.substring(6);
            var isAllowUpload = ($this.uploadExtensions.indexOf('*/*') > -1 || $this.uploadExtensions.indexOf(ext) > -1)
            if (isAllowUpload == false) {
                el.value = '';
            }
        }
        else {
            el.value = '';
        }

        if (el.value == '') {
            var alertOptions = $reflection.clone(syn.$w.alertOptions);
            alertOptions.stack = '"{0}" 이미지 파일을 선택하세요'.format($this.uploadExtensions);
            syn.$w.alert('선택할 수 없는 파일입니다', '이미지 업로드', alertOptions);
            return;
        }

        if (el.files && el.files[0]) {
            var reader = new FileReader();

            reader.onload = function (evt) {
                $('#imgProfilePicture').attr('src', evt.target.result);
            }

            reader.readAsDataURL(el.files[0]);
        }
    },

    btnUpload_click: function () {
        $this.$fileclient.doUpload($this.managerID, $this.fileUploadOptions, '$this.doUpload_Callback');
    },

    // Chrome 브라우저 보안 이슈로 인해 호출이 안됨. postMessage로 폴백 처리했으며, IE, FF에서 확인 필요
    doUpload_Callback: function (repositoryID, repositoryItems) {
        if ($this.fileUpdateCallback) {
            if (repositoryItems.length > 0) {
                var repositoryItem = repositoryItems[0];
                syn.$l.get('imgProfilePicture').src = $this.fileUploadOptions.fileManagerServer + repositoryItem.RelativePath;
                syn.$l.get('imgProfilePicture').item = repositoryItem;

                $m.setStyle(syn.$l.get('btnUploadFileDelete'), 'display', 'block');
                $m.setStyle(syn.$l.get('btnUploadFileDownload'), 'display', 'block');
            }

            // UI 화면 모듈의 콜백 함수를 호출합니다.
            var clientCallback = null;
            var uploadCallbacks = $this.fileUpdateCallback.split('.');
            for (var i = 0; i < uploadCallbacks.length; i++) {
                try {
                    if (i === 0) {
                        clientCallback = parent.$this[uploadCallbacks[i]];
                    }
                    else {
                        clientCallback = clientCallback[uploadCallbacks[i]];
                    }
                }
                catch (exception) {
                    clientCallback = null;
                    break;
                }
            }

            if (clientCallback) {
                var result = {
                    elID: $this.fileUploadOptions.elementID,
                    repositoryID: repositoryID,
                    items: repositoryItems
                };

                clientCallback('upload', result);
            }
        }
    },

    btnUploadFileDelete_click: function (e) {
        var alertOptions = $reflection.clone(syn.$w.alertOptions);
        alertOptions.dialogIcon = '2';
        alertOptions.dialogButtons = '3';
        syn.$w.alert($res.removeConfirm, syn.$res.delete, alertOptions, function (result) {
            if (result == 'Yes') {
                var itemID = syn.$l.get('imgProfilePicture').item.ItemID;
                if (itemID) {
                    $this.$fileclient.deleteItem($this.managerID, itemID, function (result) {
                        if (result.Result == true) {
                            syn.$l.get('imgProfilePicture').src = '/assets/bundle/img/common/photo_noData.png';
                            $m.setStyle(syn.$l.get('btnUploadFileDelete'), 'display', 'none');
                            $m.setStyle(syn.$l.get('btnUploadFileDownload'), 'display', 'none');
                            $this.initFileUploadUI();

                            if ($this.fileUpdateCallback) {
                                var clientCallback = null;
                                var uploadCallbacks = $this.fileUpdateCallback.split('.');
                                for (var i = 0; i < uploadCallbacks.length; i++) {
                                    try {
                                        if (i === 0) {
                                            clientCallback = parent.$this[uploadCallbacks[i]];
                                        }
                                        else {
                                            clientCallback = clientCallback[uploadCallbacks[i]];
                                        }
                                    }
                                    catch (exception) {
                                        clientCallback = null;
                                        break;
                                    }
                                }

                                if (clientCallback) {
                                    var result = {
                                        elID: $this.fileUploadOptions.elementID,
                                        repositoryID: $this.$fileclient.getRepositoryID($this.managerID),
                                        itemID: itemID
                                    };

                                    if ($this.fileUploadOptions.elementID) {
                                        parent.$l.get($this.fileUploadOptions.elementID).value = '';
                                    }

                                    clientCallback('delete', result);
                                }
                            }
                        }
                        else {
                            syn.$w.alert(result.Message, '경고');
                        }
                    });
                }
            }
        });
    },

    btnUploadFileDownload_click: function () {
        var itemID = syn.$l.get('imgProfilePicture').item.ItemID;
        if (itemID) {
            var downloadRequest = {
                repositoryID: $this.$fileclient.getRepositoryID($this.managerID),
                itemID: itemID
            };
            $this.$fileclient.fileDownload(downloadRequest);
        }
    }
});