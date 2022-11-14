$w.initializeScript({
    pageLoad: function () {
        //페이지 로드 시 거래
        //$w.transactionAction({
        //    functionID: 'L01',
        //    inputs: [{ type: 'Row', dataFieldID: 'MainForm' }],
        //    outputs: [{ type: 'Grid', dataFieldID: 'CodeDetail' }]
        //});

        //PageResizing 함수 호출
        //$this.pageResizing();
    },

    pageResizing: function () {
        $this.$grid.setControlSize('grdGrid1', {
            height: (syn.$w.getTabContentHeight() - 200) + 'px'
        });
    },

    frameEvent: function (eventName, jsonObject) {
        if (eventName == 'buttonCommand') {
            switch (jsonObject.actionID) {
                case 'excelexport':
                    $this.$grid.exportFile('grdGrid1', { filename: '교재배본' });
                    break;
                case 'search':
                    $this.$grid.clear('grdGrid1');
                    syn.$w.transactionAction({
                        functionID: 'L01',
                        inputs: [{ type: 'Row', dataFieldID: 'MainForm' }],
                        outputs: [{ type: 'Grid', dataFieldID: 'CodeDetail' }],
                        triggerMessage: syn.$res.retrievePre
                    });
                    break;
                case 'save':
                    syn.$w.transactionAction({
                        functionID: 'M01',
                        inputs: [{ type: 'List', dataFieldID: 'CodeDetail1' }],
                        outputs: [],
                        triggerMessage: syn.$res.savePre
                    });
                    break;
                case 'add':
                    syn.$l.trigger('btnAddRow', 'click');
                    break;
                case 'remove':
                    syn.$l.trigger('btnRemoveRow', 'click');
                    break;
            }
        }
    },

    afterTrigger: function (error, action, response) {
        if (response.elID == 'grdGrid1' && action == '$grid.insertRow') {
            var activeRow = $this.$grid.getActiveRowIndex('grdGrid1');
            var gridValue = [];
            gridValue.push([activeRow, $this.$grid.propToCol('grdGrid1', 'CULUMNID'), VALUE]);
            $this.$grid.setDataAtRow('grdGrid1', gridValue);
        }
    },

    previousTransactionID: '',
    beforeTransaction: function (transactConfig) {
        if (transactConfig.functionID == 'M01' && $this.$grid.isUpdateData('grdGrid1') == false) {
            syn.$w.alert('저장할 자료가 존재하지 않습니다');
            return false;
        }

        if (transactConfig.functionID == 'M01') {
            var gridLength = $this.$grid.countRows('grdGrid1');
            var gridValue = [];
            for (var i = 0; i < gridLength; i++) {
                var getFlag = $this.$grid.getFlag('grdGrid1', i);
                if (getFlag == 'U') {
                    gridValue.push([i, $this.$grid.propToCol('grdGrid1', 'EDTUSER'), syn.$w.SSO.UserID]);
                }
            }

            if (gridValue.length > 0) {
                $this.$grid.setDataAtRow('grdGrid1', gridValue);
            }

            $this.previousTransactionID = 'M01';
        }
    },

    selectRow: null,
    afterTransaction: function (error, functionID, responseData, addtionalData) {
        switch (functionID) {
            case 'M01':
                if (!error) {
                    var selectRange = $this.$grid.getSelected('grdGrid1');
                    if (selectRange) {
                        $this.selectRow = {
                            row: selectRange[0][0],
                            col: selectRange[0][1]
                        }
                    }
                    else {
                        $this.selectRow = null;
                    }

                    $this.$grid.clear('grdGrid1');
                    syn.$w.transaction('L01', function () {
                        if ($this.selectRow == null) {
                            $this.selectRow.row = 0;
                            $this.selectRow.col = 0;
                        }
                        syn.$w.statusMessage($res.save);

                        $this.$grid.selectCell('grdGrid1', $this.selectRow.row, $this.selectRow.col);
                        syn.$l.get('value1').innerHTML = 'value1';
                        syn.$l.get('value2').innerHTML = 'value2';

                    }, syn.$res.savePre);
                }
                break;
        }

        if (functionID == 'L01') {
            if ($this.previousTransactionID == 'M01') {
                syn.$w.statusMessage($res.save);
            }
            else {
                syn.$w.statusMessage($res.retrieve);
            }
        }

        try {
            if (functionID == 'M01') {
                if (addtionalData.AffectedCount && parseInt(addtionalData.AffectedCount) > 0) {
                    syn.$w.statusMessage($res.save);
                }
            }
        }
        catch (error) {
            syn.$w.statusMessage($res.saveException);
        }
    },

    ddlselect1_change: function () {
        $this.$grid.clear('grdGrid1');
        syn.$w.transactionAction({
            functionID: 'L01',
            inputs: [{ type: 'Row', dataFieldID: 'MainForm' }],
            outputs: [{ type: 'Grid', dataFieldID: 'CodeDetail' }],
            triggerMessage: syn.$res.retrievePre
        });
    },

    ddlselect2_change: function () {
        $this.$grid.clear('grdGrid1');
        syn.$w.transactionAction({
            functionID: 'L01',
            inputs: [{ type: 'Row', dataFieldID: 'MainForm' }],
            outputs: [{ type: 'Grid', dataFieldID: 'CodeDetail' }],
            triggerMessage: syn.$res.retrievePre
        });
    }
});