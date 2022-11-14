$w.initializeScript({
    config: {
        programID: 'HDS',
        businessID: 'RPT',
        transactionID: 'EST010',
        dataSource: {},
        transactions: []
    },

    prop: {
        channelID: 'EST010',
        repositoryID: '02',
        dependencyID: null,

        repositoryFileClient: null,
        maxUploadFileCount: 10,
        uploadFileCount: 0,

        documentFlag: 'C',
        workCompanyName: null,
        documentID: null,
        documentFormID: null,
        documentFormName: null,
        reportID: null,
        approvalFuncID: null,

        doSaveAndApproval: false,
        doSaveAndShare: false
    },

    model: {
        StoreForm1: {
            storeType: 'Form',
            columns: [
                { data: 'COMPANY_NO', dataType: 'string', belongID: 'AD01' },
                { data: 'DOCUMENT_FORM_ID', dataType: 'string', belongID: 'AD01' },
                { data: 'DOCUMENT_NO', dataType: 'string', belongID: 'AD01' }
            ]
        }
    },

    hook: {
        frameEvent: function (eventName, jsonObject) {
            if (eventName == 'buttonCommand') {
                switch (jsonObject.actionID) {
                    case 'save':
                        $this.dataSave();
                        break;
                    case 'print':
                        $this.dataPrint();
                        break;
                }
            }
        },

        afterTransaction: function (error, functionID, responseData, addtionalData) {

        },

        pageLoad: function () {
        }
    },

    event: {
        btnAddAttachFile_click: function () {
            $this.repositoryFileClient.opt.input.file.click();
        },

        btnSaveAndApproval_click: function () {
            $this.doSaveAndApproval = true;
            $this.dataSave();
        },

        btnSaveAndShare_click: function () {
            $this.doSaveAndShare = true;
            $this.dataSave();
        }
    },

    message: {
        saveCallback: function (evt, val) {
            var contentDocument = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document;
            var contentHeight = $this.getContentDocumentHeight(contentDocument);
            syn.$l.get('ifmReportHeight').style.height = (contentHeight + 1).toString() + 'px';
            $m.removeClass(syn.$l.get('form1'), 'invisible');
        }
    },

    transaction: {
        AD01: {
            inputs: [{ type: 'Row', dataFieldID: 'StoreForm1' }],
            outputs: [
                { type: 'Grid', dataFieldID: 'StoreGrid1' }
            ]
        }
    },

    method: {
        dataSearch: function () {
            syn.$w.transactionAction('AD01');
        },

        dataSave: function () {
            syn.$w.executeChannelMessage('call', 'save', $this.store.StoreForm1);
        },

        dataPrint: function () {
            var COMPANY_NO = syn.$w.SSO.WorkCompanyNo;

            syn.$w.printPdfDocument({
                strQueryID: 'HDS|RPT|RPT000|' + $this.reportID + '00',
                strCOMPANY_NO: String(COMPANY_NO),
                strDOCUMENT_NO: $this.documentID
            })
        },

        refreshDocumentFiles: function () {
            var dataSource = {
                document_files: []
            };

            var dtpLength = $this.store.StoreGrid1.length;
            for (var i = 0; i < dtpLength; i++) {
                var dtpItem = $this.store.StoreGrid1[i];
                dataSource.document_files.push(dtpItem);
            }

            $this.drawHtmlTemplate('lstDocumentFiles', 'tplDocumentFileItem', dataSource);
        },

        drawHtmlTemplate: function (elID, templateID, dataSource) {
            var drawEl = syn.$l.get(elID);
            var tplEL = syn.$l.get(templateID);
            if ($object.isNullOrUndefined(drawEl) == false && $object.isNullOrUndefined(tplEL) == false) {
                drawEl.innerHTML = '';

                try {
                    var templateHtml = tplEL.innerHTML;
                    drawEl.innerHTML = Mustache.render(templateHtml, dataSource);
                } catch (error) {
                    syn.$l.eventLog('$this.drawHtmlTemplate', error.message, 'Error');
                }
            }
            else {
                syn.$l.eventLog('$this.drawHtmlTemplate', 'elID, templateID 필수 데이터 확인 필요', 'Warning');
            }
        },

        getContentDocumentHeight: function (doc) {
            doc = doc || document;
            var body = doc.body, html = doc.documentElement;
            var height = Math.max(body.scrollHeight, body.offsetHeight,
                html.clientHeight, html.scrollHeight, html.offsetHeight);
            return (height + 1);
        },

        documentFileDownload: function (itemID) {
            var options = {
                repositoryID: $this.repositoryID,
                itemID: itemID
            };

            $this.$fileclient.fileDownload(options);
            return false;
        }
    }
});
