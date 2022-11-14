syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    pageLoad: function () {
        if (PDFObject.supportsPDFs == true) {
            console.log('this browser supports inline PDFs.');
        } else {
            console.log('PDFs are not supported by this browser');
        }        
    },

    btnPDFViewer_click: function () {
        var options = {
            width: '100%',
            height: '100%',
            pdfOpenParams: {
                navpanes: 0,
                toolbar: 1,
                statusbar: 0,
                view: 'FitH'
            },
            fallbackLink: '<p>이 브라우저는 인라인 PDF를 지원하지 않습니다. 내용을 확인하려면 PDF를 다운로드하세요. <a href="[url]"> PDF 다운로드 </a> </ p>',
        };

        PDFObject.embed('https://pdfobject.com/pdf/sample-3pp.pdf', '#pdfViewer', options);
        // PDFObject.embed('https://pdf.qcnservice.co.kr/pdf/RPT00120210717160032253.pdf', '#pdfViewer', options);
        // PDFObject.embed('https://pdf.qcnservice.co.kr/EPrint.aspx?strQueryID=HDS|RPT|RPT000|RPT00100&strCOMPANY_NO=1&strDOCUMENT_NO=002', '#pdfViewer', options);
    },

    btnPDFExplorerViewer_click: function () {
        var options = {
            width: '100%',
            height: '100%',
            pdfOpenParams: {
                navpanes: 0,
                toolbar: 1,
                statusbar: 0,
                view: 'FitH'
            },
            forcePDFJS: true,
            PDFJS_URL: '/assets/js/pdfjs-2.6.347/web/viewer.html'
        };

        PDFObject.embed('/assets/shared/manual/사용자매뉴얼(거점).pdf', '#pdfViewer', options);
    },

    btnPDFPrint_click: function () {
        if (syn.$b.isIE == true) {
            syn.$l.get('pdfViewer').querySelector('iframe').contentWindow.print();
        }
        else {
            printJS('https://pdfobject.com/pdf/sample-3pp.pdf');
        }
    },

    btnPrintPdfDocument_click: function () {
        syn.$w.printPdfDocument({
            strQueryID: 'HDS|RPT|RPT000|RPT00100',
            strCOMPANY_NO: '1',
            strDOCUMENT_NO: '002',
        });
    },

    btnGetPdfDocumentUrl_click: function () {
        var url = syn.$w.getPdfDocumentUrl({
            strQueryID: 'HDS|RPT|RPT000|RPT00100',
            strCOMPANY_NO: '1',
            strDOCUMENT_NO: '002',
        });

        var options = {
            width: '100%',
            height: '100%',
            pdfOpenParams: {
                navpanes: 0,
                toolbar: 1,
                statusbar: 0,
                view: 'FitH'
            },
            fallbackLink: '<p>이 브라우저는 인라인 PDF를 지원하지 않습니다. 내용을 확인하려면 PDF를 다운로드하세요. <a href="[url]"> PDF 다운로드 </a> </ p>',
        };

        syn.$l.eventLog('btnGetPdfDocumentUrl_click', ' url: ' + url);
        PDFObject.embed(url, '#pdfViewer', options);
    }
});
