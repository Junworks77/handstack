syn.Config.IsViewMappingModel = false;

var isFileBusinessID = false;
if (syn.$r.getCookie('FileBusinessID') == null) {
	$r.setCookie('FileBusinessID', '1');
	isFileBusinessID = true;
}

if (isFileBusinessID == false && syn.$w.getStorage('FileBusinessID') == null) {
	$w.setStorage('FileBusinessID', '1');
}

$w.initializeScript({
	fileClient: null,
	uploadFileCount: 0,
	pageLoad: function () {
		$l.get('txtRepositoryID').value = syn.Config.ApplicationID + syn.Config.ProjectID + syn.Config.FileServerType + syn.$l.get('txtRepositoryID').value.substring(7);

		window.fd.logging = false;
		$this.fileClient = new FileDrop('filedrop');
		$this.fileClient.event('send', function (files) {
			if (files.length >= (parseInt(syn.$l.get('txtUploadCount').value) - $this.uploadFileCount)) {
				$w.alert('최대 업로드 갯수를 초과했습니다');
				return;
			}

			var uploadUrl = $this.$fileclient.getUploadUrl(syn.$l.get('txtRepositoryID').value, syn.$l.get('txtDependencyID').value, true, syn.$l.get('txtItemID').value);
			uploadUrl = uploadUrl + '&userID=1';
			files.each(function (file) {
				file.event('sendXHR', function () {
					fd.byID('progress').style.width = 0;
				})

				file.event('progress', function (current, total) {
					var width = current / total * 100 + '%'
					fd.byID('progress').style.width = width;
				})

				file.event('done', function (xhr) {
					var response = JSON.parse(xhr.responseText);

					if (response.Result == true) {
						$this.uploadFileCount++;
					}

					console.log('업로드 완료 ' + this.name + ', response:\n\n' + xhr.responseText);

					setTimeout(function () {
						fd.byID('progress').style.width = 0;
					}, 1000);
				});

				var fileExtension = file.name.split('.')[1];
				if (fileExtension.toLowerCase() == 'jpg' || fileExtension.toLowerCase() == 'gif' || fileExtension.toLowerCase() == 'png') {
					file.sendTo(uploadUrl);
				}
				else {
					$w.alert('jpg, gif, png 이미지만 업로드 가능');
				}
			})
		});
	},

	btnFileUpload_click: function () {
		$this.fileClient.opt.input.file.click();
	},

	btnFileDownload_click: function () {
		var options = {
			repositoryID: syn.$l.get('txtRepositoryID').value,
			itemID: syn.$l.get('txtItemID').value
		};

		$this.$fileclient.fileDownload(options);

		// window.open(syn.Config.FileManagerServer + '/{0}/{1}'.format(syn.$l.get('txtRepositoryID').value, '2020D051'));
	},

	btnGetItem_click: function () {
		var options = {
			action: 'GetItem',
			repositoryID: syn.$l.get('txtRepositoryID').value,
			itemID: syn.$l.get('txtItemID').value
		};

		$this.$fileclient.getFileAction(options, function (response) {
			$l.eventLog('btnGetItem_click', JSON.stringify(response));
		});
	},

	btnGetItems_click: function () {
		var options = {
			action: 'GetItems',
			repositoryID: syn.$l.get('txtRepositoryID').value,
			dependencyID: syn.$l.get('txtDependencyID').value
		};

		$this.$fileclient.getFileAction(options, function (response) {
			$l.eventLog('btnGetItems_click', JSON.stringify(response));
		});
	},

	btnUpdateDependencyID_click: function () {
		var options = {
			action: 'UpdateDependencyID',
			repositoryID: syn.$l.get('txtRepositoryID').value,
			sourceDependencyID: syn.$l.get('txtDependencyID').value,
			targetDependencyID: syn.$l.get('txtDependencyID').value
		};

		$this.$fileclient.getFileAction(options, function (response) {
			$l.eventLog('btnUpdateDependencyID_click', JSON.stringify(response));
		});
	},

	btnUpdateFileName_click: function () {
		var options = {
			action: 'UpdateFileName',
			repositoryID: syn.$l.get('txtRepositoryID').value,
			itemID: syn.$l.get('txtItemID').value,
			fileName: syn.$l.get('txtFileName').value
		};

		$this.$fileclient.getFileAction(options, function (response) {
			$l.eventLog('btnUpdateFileName_click', JSON.stringify(response));
		});
	},

	btnDeleteItem_click: function () {
		var options = {
			action: 'DeleteItem',
			repositoryID: syn.$l.get('txtRepositoryID').value,
			itemID: syn.$l.get('txtItemID').value
		};

		$this.$fileclient.getFileAction(options, function (response) {
			if (response.Result == true) {
				$this.uploadFileCount--;
			}

			$l.eventLog('btnDeleteItem_click', JSON.stringify(response));
		});
	},

	btnDeleteItems_click: function () {
		var options = {
			action: 'DeleteItems',
			repositoryID: syn.$l.get('txtRepositoryID').value,
			dependencyID: syn.$l.get('txtDependencyID').value
		};

		$this.$fileclient.getFileAction(options, function (response) {
			if (response.Result == true) {
				$this.uploadFileCount = 0;
			}

			$l.eventLog('btnDeleteItems_click', JSON.stringify(response));
		});
	}
});