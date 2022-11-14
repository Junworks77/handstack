$w.initializeScript({
    pageLoad: function () {
    },

    uiCommand: function (parameters) {
        syn.$l.get('txtID').value = parameters[0];

        syn.$w.transaction('G01', function () {
            syn.$w.statusMessage($res.retrieve);
        }, syn.$res.retrievePre);
    },

    frameEvent: function (eventName, jsonObject) {
        if (eventName == 'buttonCommand') {
            if (jsonObject.actionID == 'search') {
                syn.$w.transactionAction({
                    functionID: 'G01',
                    inputs: [{ type: 'Row', dataFieldID: 'MainForm' }],
                    outputs: [{ type: 'Form', dataFieldID: 'MainForm' }],
                    triggerMessage: syn.$res.retrievePre
                });
            }
            if (jsonObject.actionID == 'save') {
                syn.$w.transactionAction({
                    functionID: 'M01',
                    inputs: [{ type: 'Row', dataFieldID: 'MainForm' }],
                    outputs: [],
                    triggerMessage: syn.$res.savePre
                });
            }
        }
    },

    beforeTransaction: function (transactConfig) {
        if (transactConfig.functionID == 'M01') {
            if ($this.$select.getSelectedValue('ddlselect1') == '' || $this.$select.getSelectedValue('ddlselect1') == '') {
                syn.$w.statusMessage('소속본부와 소속총판은 필수 선택 항목 입니다.');
            }
            else if ($this.$select.getSelectedValue('txttextBox1') == '') {
                syn.$w.statusMessage('원장명은 필수 입력 항목 입니다.');
            }
        }
    },

    afterTransaction: function (error, functionID, responseData, addtionalData) {
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

    btnSetInput_click: function () {
        //$l.get('txttextBox1').value = ''
        //$l.get('txttextBox2').value = ''
        //$l.get('txttextBox3').value = ''
        //$l.get('txttextBox4').value = ''
        //$l.get('txttextBox5').value = ''
        //$l.get('txttextBox6').value = ''
        //$l.get('txttextBox7').value = ''
        //$l.get('txttextBox8').value = ''
        //$l.get('txttextBox9').value = ''
        //$l.get('txttextBox10').value = ''
        //$l.get('txttextBox11').value = ''
        //$l.get('txttextBox12').value = ''
        //$l.get('txttextBox13').value = ''
        //$l.get('txttextBox14').value = ''
        //$l.get('txttextBox15').value = ''
        //$l.get('txttextBox16').value = ''
        //$l.get('txttextBox17').value = ''
        //$l.get('txttextBox18').value = ''
        //$l.get('txttextBox19').value = ''
        //$l.get('txttextBox20').value = ''
        //$l.get('txttextBox21').value = ''
        //$l.get('txttextBox22').value = ''
        //$l.get('txttextBox23').value = ''
        //$this.$select.clear('ddlSCREENINGCD');
    },

    btnZIPCD_click: function () {
        new daum.Postcode({
            oncomplete: function (data) {
                var fullAddr = '';
                var extraAddr = '';

                if (data.userSelectedType == 'R') {
                    fullAddr = data.roadAddress;
                } else {
                    fullAddr = data.jibunAddress;
                }

                if (data.userSelectedType === 'R') {
                    if (data.bname !== '') {
                        extraAddr += data.bname;
                    }
                    if (data.buildingName !== '') {
                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    fullAddr += (extraAddr !== '' ? ' (' + extraAddr + ')' : '');
                }

                syn.$l.get('txttextBox14').value = data.zonecode;
                syn.$l.get('txttextBox15').value = fullAddr;

                document.getElementById("txttextBox16").focus();
            }
        }).open();
    }
});