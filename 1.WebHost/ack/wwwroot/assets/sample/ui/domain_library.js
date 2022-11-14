syn.Config.IsViewMappingModel = false;

$w.initializeScript({
	childrenChannel: null,

	pageLoad: function () {
		var channelID = syn.$r.query('channelID');
		if (window != window.parent && channelID) {
			$this.childrenChannel = syn.$channel.connect({ window: window.parent, origin: '*', scope: channelID });
			$this.childrenChannel.bind('request', function (evt, params) {
				console.log(params);
			});
		}
	},

	btnLoadingBar_click: function () {
		$progressBar.show('조회 중입니다...');
	},

	btnAlert_click: function () {
		var alertOptions = $reflection.clone(syn.$w.alertOptions);
		alertOptions.dialogIcon = '4'; // 1:Information, 2:Warning, 3:Question, 4:Error (default:1)
		alertOptions.dialogButtons = '3'; // 1:OK, 2:OKCancel, 3:YesNo, 4:YesNoCancel (default:1)
		alertOptions.minWidth = 640;
		alertOptions.minHeight = 240;
		$w.alert('내용', '타이틀', alertOptions, function (result) {
			alert(result);
		});
	},

	btnShowDialog_click: function () {
		var dialogOptions = $reflection.clone(syn.$w.dialogOptions);
		dialogOptions.minWidth = 340;
		dialogOptions.minHeight = 140;

		$w.showDialog(syn.$l.get('htmlTemplete'), dialogOptions);

		setTimeout(function () {
			$l.get('txtChangeDepartmentName').select();
		}, 25);
	},

	btnClose_click: function () {
		$w.closeDialog();
	},

	btnShowUIDialog_click: function () {
		var dialogOptions = $reflection.clone(syn.$w.dialogOptions);
		dialogOptions.minWidth = 480;
		dialogOptions.minHeight = 640;
		dialogOptions.caption = '큐씨엔';
		dialogOptions.scrolling = true;
		$w.showUIDialog('http://www.handstack.kr', dialogOptions);
	},

	btnWindowManager_click: function () {
		var windowID = syn.$l.get('txtWindowManager').value;

		var popupOptions = $reflection.clone(syn.$w.popupOptions);
		popupOptions.debugOutput = true;
		popupOptions.title = '윈도우 팝업 타이틀';
		popupOptions.src = 'domain_library.html';
		popupOptions.channelID = syn.$l.get('txtChannelID').value;
		popupOptions.baseELID = syn.$l.get('txtBaseWindowID').value;
		popupOptions.isModal = syn.$l.get('chkWindowManager').checked;
		popupOptions.notifyActions.push({
			actionID: 'response',
			handler: function (evt, val) {
				$w.windowClose(windowID);
			}
		});
		$w.windowOpen(windowID, popupOptions, function (elID) {
			console.log(elID + ' window Open');
		});
	},

	btnParent2Children_click: function () {
		var channelID = syn.$l.get('txtChannelID').value;
		var length = syn.$w.iframeChannels.length;
		for (var i = 0; i < length; i++) {
			var frameMessage = syn.$w.iframeChannels[i];

			if (channelID == frameMessage.id) {
				frameMessage.channel.call({
					method: 'request',
					params: ['request data'],
					error: function (error, message) {
						console.log('request ERROR: ' + error + ' (' + message + ')');
					},
					success: function (val) {
						console.log('request function returns: ' + val);
					}
				});
			}
		}
	},

	btnChildren2Parent_click: function () {
		if ($this.childrenChannel != null) {
			$this.childrenChannel.notify({
				method: 'response',
				params: ['response data'],
				error: function (error, message) {
					console.log('response ERROR: ' + error + ' (' + message + ')');
				},
				success: function (val) {
					console.log('response function returns: ' + val);
				}
			});
		}
	},

	btnNotifier_click: function () {
		$w.notify('텍스트', '타이틀', 'info');
		$w.notify('텍스트', '타이틀', 'warning');
		$w.notify('텍스트', '타이틀', 'error');
		$w.notify('텍스트', '타이틀', 'question');
	},

	btnOpenReport_click: function () {
		$w.openReport('HDS|SMD|SMP030|RP00700', {
			strSTUDENTID: syn.$w.SSO.UserID
		});
	}
});