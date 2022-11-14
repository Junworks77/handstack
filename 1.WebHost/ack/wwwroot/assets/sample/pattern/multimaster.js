$w.initializeScript({
    pageLoad: function () {
        //$w.transactionAction({
        //    functionID: 'L01',
        //    inputs: [{ type: 'Row', dataFieldID: 'MainForm' }],
        //    outputs: [
        //        { type: 'Grid', dataFieldID: 'CodeDetail1' },
        //        { type: 'Grid', dataFieldID: 'CodeDetail2' }
        //    ]
        //});

        // $this.pageResizing();
    },

    pageResizing: function () {
        $this.$grid.setControlSize('grdGrid1', {
            height: (syn.$w.getTabContentHeight() - 322) + 'px'
        });
        $this.$grid.setControlSize('grdGrid2', {
            height: (syn.$w.getTabContentHeight() - 322) + 'px'
        });
    },

    frameEvent: function (eventName, jsonObject) {
        if (eventName == 'buttonCommand') {
            switch (jsonObject.actionID) {
                case 'search':
                    syn.$w.transactionAction({
                        functionID: 'L01',
                        inputs: [{ type: 'Row', dataFieldID: 'MainForm' }],
                        outputs: [
                            { type: 'Grid', dataFieldID: 'CodeDetail1' },
                            { type: 'Grid', dataFieldID: 'CodeDetail2' }
                        ],
                        triggerMessage: syn.$res.retrievePre
                    });
                    break;
                case 'save':
                    syn.$w.transactionAction({
                        functionID: 'M01',
                        inputs: [
                            { type: 'List', dataFieldID: 'CodeDetail1' },
                            { type: 'List', dataFieldID: 'CodeDetail2' },
                        ],
                        outputs: [],
                        triggerMessage: syn.$res.savePre
                    });
                    break;
                case 'add':
                    if ($this.context.focusControl.id) {
                        if ($this.context.focusControl.id == 'grdGrid1') {
                            syn.$l.trigger('btnAddRow1', 'click');
                        }
                        else if ($this.context.focusControl.id == 'grdGrid2') {
                            syn.$l.trigger('btnAddRow2', 'click');
                        }
                    }
                    break;
                case 'remove':
                    if ($this.context.focusControl.id) {
                        if ($this.context.focusControl.id == 'grdGrid1') {
                            syn.$l.trigger('btnRemoveRow1', 'click');
                        }
                        else if ($this.context.focusControl.id == 'grdGrid2') {
                            syn.$l.trigger('btnRemoveRow2', 'click');
                        }
                    }
                    break;
            }
        }
    },

    previousTransactionID: '',
    beforeTransaction: function (transactConfig) {
        var isupdate1 = $this.$grid.isUpdateData('grdGrid1');
        var isupdate2 = $this.$grid.isUpdateData('grdGrid2');
        if (transactConfig.functionID == 'M01' && isupdate1 == false && isupdate2 == false) {
            syn.$w.alert('저장할 자료가 존재하지 않습니다');
            return false;
        }
    },

    selectControlID: null, activeRow: null, activeCol: null,
    afterTransaction: function (error, functionID, responseData, addtionalData) {
        if (functionID == 'M01' && addtionalData) {
            $this.$grid.clear('grdGrid1');
            $this.$grid.clear('grdGrid2');
            syn.$w.transactionAction({
                functionID: 'L01',
                inputs: [{ type: 'Row', dataFieldID: 'MainForm' }],
                outputs: [
                    { type: 'Grid', dataFieldID: 'CodeDetail1' },
                    { type: 'Grid', dataFieldID: 'CodeDetail2' }
                ],
                triggerMessage: syn.$res.savePre
            });
        }

        if (functionID == 'L01') {
            if ($this.previousTransactionID == 'M01') {
                syn.$w.statusMessage($res.save);
                if (($this.activeRow != -1 || $this.activeCol != -1) &&
                    ($this.activeRow != null || $this.activeCol != null)) {

                    $this.$grid.selectCell($this.selectControlID, $this.activeRow, $this.activeCol);

                }
            }
            $this.previousTransactionID = '';
        }
        else {
            syn.$w.statusMessage($res.retrieve);
        }
    },

    grdGrid1_afterSelectionEnd: function (row, column, row2, column2, selectionLayerLevel) {
        $this.selectControlID = 'grdGrid1';
        $this.activeRow = $this.$grid.getActiveRowIndex('grdGrid1');
        $this.activeCol = $this.$grid.getActiveColIndex('grdGrid1');
    },

    grdGrid2_afterSelectionEnd: function (row, column, row2, column2, selectionLayerLevel) {
        $this.selectControlID = 'grdGrid2';
        $this.activeRow = $this.$grid.getActiveRowIndex('grdGrid2');
        $this.activeCol = $this.$grid.getActiveColIndex('grdGrid2');
    },

    AreaTab1_click: function () {
        //areaTab1
        $m.addClass(syn.$l.get('AreaTab1'), 'active');
        $m.removeClass(syn.$l.get('AreaTab2'), 'active');
        //area1
        $m.addClass(syn.$l.get('Area1'), 'block');
        $m.addClass(syn.$l.get('Area2'), 'hidden');
        $m.removeClass(syn.$l.get('Area2'), 'block');

        $this.$grid.getGridControl('grdGrid1').render();
    },

    AreaTab2_click: function () {
        //areaTab2
        $m.addClass(syn.$l.get('AreaTab2'), 'active');
        $m.removeClass(syn.$l.get('AreaTab1'), 'active');
        //area2
        $m.addClass(syn.$l.get('Area2'), 'block');
        $m.addClass(syn.$l.get('Area1'), 'hidden');
        $m.removeClass(syn.$l.get('Area1'), 'block');

        $this.$grid.getGridControl('grdGrid2').render();
    }
});