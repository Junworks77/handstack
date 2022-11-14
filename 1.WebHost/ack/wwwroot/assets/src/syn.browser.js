/// <reference path='syn.core.js' />

(function (context) {
    'use strict';
    var $browser = $browser || new syn.module();
    var document = context.document;

    $browser.extend({
        version: '1.0',

        appName: navigator.appName,
        appCodeName: navigator.appCodeName,
        appMajorVersion: navigator.appVersion.substring(0, 4),
        appVersion: navigator.appVersion,
        platform: navigator.platform,
        javaEnabled: navigator.javaEnabled(),
        screenWidth: screen.width,
        screenHeight: screen.height,
        language: (navigator.appName == 'Netscape') ? navigator.language : navigator.browserLanguage,
        isWebkit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
        isGecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1,
        isKHTML: navigator.userAgent.indexOf('KHTML') != -1,
        isPresto: navigator.appName == 'Opera',
        isMac: navigator.appVersion.indexOf("Mac") != -1 || navigator.userAgent.indexOf('Macintosh') != -1,
        isLinux: navigator.appVersion.indexOf("Linux") != -1 || navigator.appVersion.indexOf("X11") != -1,
        isWin: navigator.appVersion.indexOf("Win") != -1 || navigator.userAgent.indexOf('Windows') != -1,
        isIE: !!document.documentMode || (navigator.appName == 'Netscape' && navigator.userAgent.indexOf('trident') != -1) || (navigator.userAgent.indexOf("msie") != -1),
        isChrome: !!context.chrome && (!!context.chrome.webstore || !!context.chrome.runtime),
        isEdge: (!!context.chrome && (!!context.chrome.webstore || !!context.chrome.runtime)) && (navigator.userAgent.indexOf("Edg") != -1),
        isFF: typeof InstallTrigger !== 'undefined' || navigator.userAgent.indexOf('Firefox') !== -1,
        isSafari: /constructor/i.test(context.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!context['safari'] || (typeof safari !== 'undefined' && context['safari'].pushNotification)),

        windowWidth() {
            var ret = null;

            if (context.innerWidth) {
                ret = context.innerWidth;
            }
            else if (document.documentElement && document.documentElement.clientWidth) {
                ret = document.documentElement.clientWidth;
            }
            else if (document.body) {
                ret = document.body.offsetWidth;
            }

            return ret;
        },

        windowHeight() {
            var ret = null;

            if (context.innerHeight) {
                ret = context.innerHeight;
            }
            else if (document.documentElement && document.documentElement.clientHeight) {
                ret = document.documentElement.clientHeight;
            }
            else if (document.body) {
                ret = document.body.clientHeight;
            }

            return ret;
        }
    });
    syn.$b = $browser;
})(globalRoot);
