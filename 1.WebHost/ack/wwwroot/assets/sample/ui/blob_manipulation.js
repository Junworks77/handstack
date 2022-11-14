syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    blobUrl: '',
    pageLoad: function () {
    },

    btnCreateBlobUrl_click: function () {
        var blob = syn.$w.createBlob('helloworld', 'text/plain');
        $this.blobUrl = syn.$r.createBlobUrl(blob);
        syn.$l.eventLog('btnCreateBlobUrl_click', $this.blobUrl);
    },

    btnRevokeBlobUrl_click: function () {
        syn.$r.revokeBlobUrl($this.blobUrl);
        syn.$l.eventLog('btnRevokeBlobUrl_click', $this.blobUrl);
    },

    btnBlobToDataUri_click: function () {
        var blob = syn.$w.createBlob('helloworld', 'text/plain');
        syn.$r.blobToDataUri(blob, function (dataUri) {
            syn.$l.eventLog('btnBlobToDataUri_click', dataUri);
        });
    },

    btnBlobToDownload_click: function () {
        var blob = syn.$w.createBlob('helloworld', 'text/plain');
        syn.$r.blobToDownload(blob, 'helloworld.txt');
    },

    btnBlobUrlToDataUri_click: function () {
        var blob = syn.$w.createBlob('helloworld', 'text/plain');
        $this.blobUrl = syn.$r.createBlobUrl(blob);
        syn.$r.blobUrlToDataUri($this.blobUrl, function (dataUri) {
            syn.$l.eventLog('btnBlobUrlToDataUri_click', dataUri);
        });
    },

    btnBlobUrlToData_click: function () {
        var blob1 = syn.$w.createBlob('helloworld', 'text/plain');
        $this.blobUrl = syn.$r.createBlobUrl(blob1);
        syn.$r.blobUrlToData($this.blobUrl, function (blob2) {
            syn.$l.eventLog('btnBlobUrlToData_click', blob2.size);
        });
    },

    btnCreateBlob_click: function () {
        var blob = syn.$w.createBlob('helloworld', 'text/plain');
        syn.$l.eventLog('btnCreateBlob_click', blob.size);
    },

    btnDataUriToBlob_click: function () {
        var blob1 = syn.$w.createBlob('helloworld', 'text/plain');
        syn.$r.blobToDataUri(blob1, function (dataUri) {
            var blob2 = syn.$w.dataUriToBlob(dataUri);
            syn.$l.eventLog('btnDataUriToBlob_click', blob2.size);
        });
    },

    btnDataUriToText_click: function () {
        var blob = syn.$w.createBlob('helloworld', 'text/plain');
        syn.$r.blobToDataUri(blob, function (dataUri) {
            var data = syn.$w.dataUriToText(dataUri);
            syn.$l.eventLog('btnDataUriToText_click', JSON.stringify(data));
        });
    },

    btnUploadBlob_click: function () {
        var blob = syn.$w.createBlob('helloworld', 'text/plain');

        var options = {
            repositoryID: 'SYNSMP04',
            dependencyID: 'helloworld',
            blobInfo: blob,
            mimeType: 'text/plain',
            fileName: 'helloworld.txt'
        };

        $this.$fileclient.uploadBlob(options, function (result) {
            syn.$l.eventLog('btnUploadBlob_click', JSON.stringify(result));
        });
    },

    btnUploadBlobUri_click: function () {
        var blob = syn.$w.createBlob('helloworld', 'text/plain');
        var blobUrl = syn.$r.createBlobUrl(blob);

        var options = {
            repositoryID: 'SYNSMP04',
            dependencyID: 'helloworld',
            blobUri: blobUrl,
            mimeType: 'text/plain',
            fileName: 'helloworld.txt'
        };

        $this.$fileclient.uploadBlobUri(options, function (result) {
            syn.$l.eventLog('btnUploadBlobUri_click', JSON.stringify(result));
        });
    },

    btnUploadDataUri_click: function () {
        var blob = syn.$w.createBlob('helloworld', 'text/plain');

        var options = {
            repositoryID: 'SYNSMP04',
            dependencyID: 'helloworld',
            mimeType: 'text/plain',
            fileName: 'helloworld.txt'
        };

        syn.$r.blobToDataUri(blob, function (dataUri) {
            options.dataUri = dataUri;
            $this.$fileclient.uploadDataUri(options, function (result) {
                syn.$l.eventLog('btnUploadBlobUri_click', JSON.stringify(result));
            });
        });
    }
});