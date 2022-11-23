'use strict';
let $browser = {
    extends: [
        'parsehtml'
    ],

    hook: {
        pageLoad() {
            syn.$l.get('txtProperty_appName').value = syn.$b.appName;
            syn.$l.get('txtProperty_appCodeName').value = syn.$b.appCodeName;
            syn.$l.get('txtProperty_appVersion').value = syn.$b.appVersion;
            syn.$l.get('txtProperty_cookieEnabled').value = syn.$b.cookieEnabled;
            syn.$l.get('txtProperty_pdfViewerEnabled').value = syn.$b.pdfViewerEnabled;
            syn.$l.get('txtProperty_platform').value = syn.$b.platform;
            syn.$l.get('txtProperty_devicePlatform').value = syn.$b.devicePlatform;
            syn.$l.get('txtProperty_userAgent').value = syn.$b.userAgent;
            syn.$l.get('txtProperty_devicePixelRatio').value = syn.$b.devicePixelRatio;
            syn.$l.get('txtProperty_screenWidth').value = syn.$b.screenWidth;
            syn.$l.get('txtProperty_screenHeight').value = syn.$b.screenHeight;
            syn.$l.get('txtProperty_language').value = syn.$b.language;
            syn.$l.get('txtProperty_isWebkit').value = syn.$b.isWebkit;
            syn.$l.get('txtProperty_isMac').value = syn.$b.isMac;
            syn.$l.get('txtProperty_isLinux').value = syn.$b.isLinux;
            syn.$l.get('txtProperty_isWindow').value = syn.$b.isWindow;
            syn.$l.get('txtProperty_isOpera').value = syn.$b.isOpera;
            syn.$l.get('txtProperty_isIE').value = syn.$b.isIE;
            syn.$l.get('txtProperty_isChrome').value = syn.$b.isChrome;
            syn.$l.get('txtProperty_isEdge').value = syn.$b.isEdge;
            syn.$l.get('txtProperty_isFF').value = syn.$b.isFF;
            syn.$l.get('txtProperty_isSafari').value = syn.$b.isSafari;
            syn.$l.get('txtProperty_isMobile').value = syn.$b.isMobile;
        }
    },

    event: {
        btnEvent_getSystemFonts_click () {
            syn.$l.get('txtProperty_getSystemFonts').value = syn.$b.getSystemFonts().split(',').map((item) => {
                return item.trim();
            }).join('\n');
        },

        btnEvent_getPlugins_click () {
            syn.$l.get('txtProperty_getPlugins').value = syn.$b.getPlugins().split(',').map((item) => {
                return item.trim();
            }).join('\n');
        },

        async btnEvent_fingerPrint_click () {
            syn.$l.get('txtProperty_fingerPrint').value = await syn.$b.fingerPrint();
        },

        btnEvent_windowWidth_click() {
            syn.$l.get('txtProperty_windowWidth').value = syn.$b.windowWidth();
        },

        btnEvent_windowHeight_click() {
            syn.$l.get('txtProperty_windowHeight').value = syn.$b.windowHeight();
        },

        async btnEvent_getIpAddress_click() {
            syn.$l.get('txtProperty_getIpAddress').value = await syn.$b.getIpAddress();
        }
    },
};
