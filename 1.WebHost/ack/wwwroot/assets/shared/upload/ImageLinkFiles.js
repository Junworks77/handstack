syn.Config.IsViewMappingModel = false;

$w.initializeFormScript({
    managerID: 'ImageLinkFileUpload',
    fileUploadOptions: null,
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
        $this.uploadDependencyID = $this.fileUploadOptions.dependencyID;
        $this.fileUpdateCallback = $this.fileUploadOptions.fileUpdateCallback;

        $this.$fileclient.init('ImageLinkFileUpload', syn.$l.get('divEditorImageFiles'), $this.fileUploadOptions, $this.fileChangeHandler);
        $this.initFileUploadUI();
    },

    initFileUploadUI: function () {
        var fileManager = $this.$fileclient.getFileManager($this.managerID);
        var uploadSetting = fileManager.datas;

        $this.$fileclient.setDependencyID($this.managerID, $this.uploadDependencyID);

        $this.$fileclient.getItems($this.managerID, $this.uploadDependencyID, function (repositoryItems) {
            $this.uploadExtensions = uploadSetting.uploadExtensions;
            $this.uploadCount = uploadSetting.uploadCount;

            syn.$l.get('spnMaxUploadCount').textContent = $this.uploadCount.toString();
            syn.$l.get('spnRemainUploadCount').textContent = ($this.uploadCount - repositoryItems.length).toString();

            // 업로드된 아이템의 갯수만큼 FileDownload UI 항목를 화면에 추가합니다.
            if (repositoryItems.length > 0) {
                for (var i = 0; i < repositoryItems.length; i++) {
                    repositoryItem = repositoryItems[i];

                    var li = syn.$m.append(syn.$l.get('divFileInfos'), 'li', repositoryItem.ItemID);
                    var image = syn.$m.append(li, 'img', repositoryItem.ItemID + '_image');
                    image.src = repositoryItem.AbsolutePath + (repositoryItem.AbsolutePath.indexOf('?') == -1 ? '?' : '&') + 'ext=' + repositoryItem.Extension;
                    image.style.width = '64px';
                    image.style.height = '64px';

                    var link = syn.$m.append(li, 'a', repositoryItem.ItemID + '_link');
                    link.href = 'javascript: void(0)';
                    link.downloadPath = repositoryItem.AbsolutePath + (repositoryItem.AbsolutePath.indexOf('?') == -1 ? '?' : '&') + 'ext=' + repositoryItem.Extension;
                    link.download = repositoryItem.FileName;
                    syn.$l.addEvent(link, 'click', function () {
                        var downloadPath = this.downloadPath;
                        var download = this.download;
                        syn.$r.blobUrlToData(downloadPath, function (blob) {
                            syn.$r.blobToDownload(blob, download);
                        });
                        return false;
                    });
                    link.textContent = repositoryItem.FileName;

                    var span = syn.$m.append(li, 'span', repositoryItem.ItemID + '_span');
                    syn.$l.addEvent(span, 'click', $this.btnAttachFileDelete_click);
                    span.innerText = '삭제';
                    span.item = repositoryItem;
                }
            }
        });
    },

    fileChangeHandler: function (el, fileItem) {
        // syn.$l.get('divFileInfos').innerText = unescape(fileName);
    },

    btnAttachFileDelete_click: function (e) {
        var alertOptions = $reflection.clone(syn.$w.alertOptions);
        alertOptions.dialogIcon = '2';
        alertOptions.dialogButtons = '3';
        syn.$w.alert($res.removeConfirm, syn.$res.delete, alertOptions, function (result) {
            if (result == 'Yes') {
                var elButton = e.target || e;
                var el = syn.$l.get(elButton.item.ItemID);
                var itemID = elButton.item.ItemID;
                if (itemID) {
                    $this.$fileclient.deleteItem($this.managerID, itemID, function (result) {
                        if (result.Result == true) {
                            $m.remove(el);

                            var uploadCount = parseInt(syn.$l.get('spnRemainUploadCount').textContent);
                            syn.$l.get('spnRemainUploadCount').textContent = uploadCount + 1;

                            if ($this.fileUpdateCallback) {
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
    }
});