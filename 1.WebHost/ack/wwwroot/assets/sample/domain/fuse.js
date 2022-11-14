syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    dataSources: [],

    pageLoad: function () {
        $this.dataSources = [
            {
                documentTypeID: "HDSDWPLA1",
                documentTypeName: "EmailAttachFiles",
                documents: [
                    {
                        documentID: "DD9D8A31D1A045638794815D409DDAEA",
                        documentName: "김용현_Dasp.pdf",
                        documentComments: "2021-06-16 14:20:58.310"
                    }
                ]
            },
            {
                documentTypeID: "HDSDWPLE1",
                documentTypeName: "EditorImageFiles",
                documents: [
                    {
                        documentID: "F044C57E339347B09B536DFFFC4E0E29",
                        documentName: "GitHubDesktopSetup-x64.exe",
                        documentComments: "2021-06-16 14:30:20.353"
                    }
                ]
            },
            {
                documentTypeID: "HDSDWPLM1",
                documentTypeName: "AttachFiles",
                documents: [
                    {
                        documentID: "3E944B9F3052465681757E18CB58CC5C",
                        documentName: "아이유.jpg",
                        documentComments: "2021-06-16 14:15:10.437"
                    },
                    {
                        documentID: "56285CA05CD04828BD41F66D7E07C517",
                        documentName: "이노비즈 평가지표.pdf",
                        documentComments: "2021-06-16 14:14:42.017"
                    },
                    {
                        documentID: "C14006CEC477402594262A65F0D2C231",
                        documentName: "한소희.jpg",
                        documentComments: "2021-06-16 14:24:13.327"
                    }
                ]
            },
            {
                documentTypeID: "HDSDWPLP1",
                documentTypeName: "PersonPictures",
                documents: [
                    {
                        documentID: "2021D051",
                        documentName: "2021D051",
                        documentComments: "2021-06-16 14:47:52.533"
                    }
                ]
            },
            {
                documentTypeID: "HDSDWPLS1",
                documentTypeName: "AttachFile",
                documents: [
                    {
                        documentID: "9FF66C78033B4486AA8B925B8661644E",
                        documentName: "아이유.jpg",
                        documentComments: "2021-06-16 14:24:16.597"
                    }
                ]
            }
        ];
    },

    txtDocument_keydown: function (evt) {
        if (evt.keyCode == 13) {
            $this.btnSearch_click();
        }
    },

    btnSearch_click: function () {
        var options = {
            // isCaseSensitive: false,
            // includeScore: false,
            // shouldSort: true,
            // includeMatches: false,
            // findAllMatches: false,
            // minMatchCharLength: 1,
            // location: 0,
            // threshold: 0.6,
            // distance: 100,
            // useExtendedSearch: false,
            // ignoreLocation: false,
            // ignoreFieldNorm: false,
            keys: [
                'documentTypeName',
                'documents.documentName',
                'documents.documentComments'
            ]
        };

        var searchText = syn.$l.get('txtDocument').value.trim();
        if (searchText.length > 0) {
            var fuse = new Fuse($this.dataSources, options);

            var items = fuse.search(searchText);
            var length = items.length;
            if (length > 0) {
                var fuseSources = [];
                for (var i = 0; i < length; i++) {
                    var item = items[i];
                    fuseSources.push(item.item);
                }

                $this.drawDocumentTemplate(fuseSources);
            }
        }
        else {
            $this.drawDocumentTemplate($this.dataSources);
        }
    },

    drawDocumentTemplate: function (dataSources) {
        debugger;
    }
});
