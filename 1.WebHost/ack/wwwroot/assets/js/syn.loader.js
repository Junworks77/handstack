﻿(async function () {
    var getCookie = function (id) {
        var start = document.cookie.indexOf(id + '=');
        var len = start + id.length + 1;

        if ((!start) && (id != document.cookie.substring(0, id.length))) {
            start = null;
            len = null;
            return null;
        }

        if (start == -1) {
            start = null;
            len = null;
            return null;
        }

        var end = document.cookie.indexOf(';', len);

        if (end == -1) {
            end = document.cookie.length;
        }

        return unescape(document.cookie.substring(len, end));
    }

    var backgroundColor = '#ed1c23';
    var tokenID = getCookie('ack.TokenID');
    if (tokenID) {
        var roleID = tokenID.substring(27, 29);
        if (roleID == '10') {
            backgroundColor = '#192B80';
        }
        else if (roleID == '20') {
            backgroundColor = '#50417B';
        }
        else if (roleID == '50') {
            backgroundColor = '#530205';
        }
    }

    var style = document.createElement('style');
    style.innerHTML = '.pl-container{position:absolute;top:0;left:0;background-color:#fff;width:100vw;height:100vh;z-index:999}.pl-cube-grid{position:absolute;left:50%;top:50%;margin:-20px 0 0 -20px;width:40px;height:40px}.pl-cube-grid .pl-cube{width:33%;height:33%;background-color:' + backgroundColor + ';float:left;-webkit-animation:pl-cubeGridScaleDelay 1.3s infinite ease-in-out;animation:pl-cubeGridScaleDelay 1.3s infinite ease-in-out}.pl-cube-grid .pl-cube1{-webkit-animation-delay:.2s;animation-delay:.2s}.pl-cube-grid .pl-cube2{-webkit-animation-delay:.3s;animation-delay:.3s}.pl-cube-grid .pl-cube3{-webkit-animation-delay:.4s;animation-delay:.4s}.pl-cube-grid .pl-cube4{-webkit-animation-delay:.1s;animation-delay:.1s}.pl-cube-grid .pl-cube5{-webkit-animation-delay:.2s;animation-delay:.2s}.pl-cube-grid .pl-cube6{-webkit-animation-delay:.3s;animation-delay:.3s}.pl-cube-grid .pl-cube7{-webkit-animation-delay:0s;animation-delay:0s}.pl-cube-grid .pl-cube8{-webkit-animation-delay:.1s;animation-delay:.1s}.pl-cube-grid .pl-cube9{-webkit-animation-delay:.2s;animation-delay:.2s}@-webkit-keyframes pl-cubeGridScaleDelay{0%,100%,70%{-webkit-transform:scale3D(1,1,1);transform:scale3D(1,1,1)}35%{-webkit-transform:scale3D(0,0,1);transform:scale3D(0,0,1)}}@keyframes pl-cubeGridScaleDelay{0%,100%,70%{-webkit-transform:scale3D(1,1,1);transform:scale3D(1,1,1)}35%{-webkit-transform:scale3D(0,0,1);transform:scale3D(0,0,1)}}.wtBorder{background-color:' + backgroundColor + ' !important;}';
    document.head.appendChild(style);

    // var pageBackground = document.createElement('div');
    // pageBackground.id = 'pageLoader';
    // pageBackground.classList.add('pl-container');
    // pageBackground.innerHTML = '<div class="pl-cube-grid"><div class="pl-cube pl-cube1"></div><div class="pl-cube pl-cube2"></div><div class="pl-cube pl-cube3"></div><div class="pl-cube pl-cube4"></div><div class="pl-cube pl-cube5"></div><div class="pl-cube pl-cube6"></div><div class="pl-cube pl-cube7"></div><div class="pl-cube pl-cube8"></div><div class="pl-cube pl-cube9"></div></div>';
    // document.body.appendChild(pageBackground);

    var agent = navigator.userAgent.toLowerCase();
    var isIE = (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1);
    if (isIE == true) {
        var html = 'Internet Explorer 지원이 종료되었습니다.<br /><a href="https://www.google.co.kr/chrome" target="_blank">Chrome</a> 또는 <a href="https://www.microsoft.com/edge" target="_blank">Microsoft Edge</a> 웹 브라우저를 사용하세요.';
        document.body.innerHTML = '';
        var page = document.createElement('div');
        page.innerHTML = html;
        document.body.appendChild(page);
        return;
    }

    document.onkeydown = function (evt) {
        if (evt.ctrlKey == true && evt.altKey == true && evt.shiftKey == true) {
            if (evt.keyCode == '68') {
                if (window.parent && window.parent.$w && window.parent.$w.pageScript == '$MainFrame') {
                    window.parent.$MainFrame.toogleDarkMode();
                }
                else {
                    var isDarkMode = (localStorage.getItem('isDarkMode') == 'true');
                    var urlFlag = '?darkMode=' + (!isDarkMode).toString();
                    if (isDarkMode == false) {
                        localStorage.setItem('isDarkMode', true);

                        syn.$w.loadStyle('/assets/css/dark_mode.css' + urlFlag, 'dark_mode');
                    }
                    else {
                        localStorage.setItem('isDarkMode', false);

                        $m.remove(syn.$l.get('dark_mode'));
                    }
                }
            }
            else if (evt.keyCode == '69') {
                if (window.parent && window.parent.$w && window.parent.$w.pageScript == '$MainFrame') {
                    window.parent.$MainFrame.toogleDeveloperMode();
                }
                else {
                    window.synConfigName = sessionStorage.getItem('synConfigName') || 'syn.config.json';
                    if (window.synConfigName == 'syn.config.json') {
                        sessionStorage.setItem('synConfigName', 'syn.config.dev.json');
                    }
                    else {
                        sessionStorage.setItem('synConfigName', 'syn.config.json');
                    }
                }
            }
        }
    }

    var loader = {
        name: 'syn.loader',
        version: '1.0',
        resources: [],
        htmlFiles: [],
        scriptFiles: [],
        styleFiles: [],
        start: (new Date()).getTime(),
        logTimer: null,
        logCount: 0,
        argArgs: '',
        currentLoadedCount: 0,
        remainLoadedCount: 0,
        isEnableModuleLogging: sessionStorage.getItem('EnableModuleLogging') === 'true', // sessionStorage.setItem('EnableModuleLogging', true)
        isMinify: !(sessionStorage.getItem('DisableMinifyBundle') === 'true'), // sessionStorage.setItem('DisableMinifyBundle', true)
        isForceBundle: sessionStorage.getItem('EnableForceBundle') === 'true', // sessionStorage.setItem('EnableForceBundle', true)

        endsWith(str, suffix) {
            if (str === null || suffix === null) {
                return false;
            }
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        },

        loadFiles: async function () {
            loader.currentLoadedCount = 0;
            loader.remainLoadedCount = loader.htmlFiles.length + loader.scriptFiles.length + loader.styleFiles.length;

            function finishLoad() {
                if (loader.remainLoadedCount === loader.currentLoadedCount) {
                    loader.loadCallback();
                }
            }

            if (loader.htmlFiles.length > 0) {
                for (var i = 0; i < loader.htmlFiles.length; i++) {
                    var htmlFile = loader.htmlFiles[i];
                    var htmlObject = loader.toUrlObject(htmlFile);
                    var id = htmlObject.id || 'id_' + Math.random().toString(8);
                    await loader.loadText(id, htmlFile);
                }
            }

            for (var i = 0; i < loader.styleFiles.length; i++) {
                var styleFile = loader.styleFiles[i];
                loader.eventLog('request', 'loading style ' + styleFile);

                var style = document.createElement('link');
                style.rel = 'stylesheet';
                style.href = styleFile + (styleFile.indexOf('?') > -1 ? '&' : '?') + loader.argArgs;
                style.type = 'text/css';

                if (styleFile.indexOf('dark_mode') > -1) {
                    style.id = 'dark_mode';
                }

                style.onload = function (evt) {
                    loader.eventLog('loaded', 'loaded style: ' + evt.target.href);
                    loader.currentLoadedCount++;
                    finishLoad();
                };
                style.onerror = function (evt) {
                    loader.eventLog('load error', 'loaded fail style: ' + evt.target.href);
                    loader.currentLoadedCount++;
                    finishLoad();
                };

                document.head.appendChild(style);
            }

            if (loader.scriptFiles.length > 0) {
                loader.loadScript(0);
            }
        },

        loadScript(i) {
            loader.eventLog('request', 'loading script ' + loader.scriptFiles[i]);

            var loadNextScript = function () {
                var nextIndex = i + 1;
                if (nextIndex < loader.scriptFiles.length) {
                    loader.loadScript(nextIndex);
                }
            };

            var src = loader.scriptFiles[i];
            src = src + (src.indexOf('?') > -1 ? '&' : '?') + loader.argArgs;

            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            script.async = 'async';
            script.onload = function (evt) {
                loader.eventLog('loaded', 'Loaded script: ' + evt.target.src);
                loader.currentLoadedCount++;

                if (loader.remainLoadedCount === loader.currentLoadedCount) {
                    loader.loadCallback();
                }
                else {
                    loadNextScript();
                }
            };
            script.onerror = function (evt) {
                loader.eventLog('load error', 'Loaded fail script: ' + evt.target.src);
                loader.currentLoadedCount++;

                if (loader.remainLoadedCount === loader.currentLoadedCount) {
                    loader.loadCallback();
                }
                else {
                    loadNextScript();
                }
            };

            document.body.appendChild(script);
        },

        loadText: async function (id, url) {
            url = url + (url.indexOf('?') > -1 ? '&' : '?') + loader.argArgs;
            var response = await fetch(url);
            if (response.status !== 200) {
                if (response.status == 0) {
                    loader.eventLog('$w.loadText', 'X-Requested transfort error');
                }
                else {
                    loader.eventLog('$w.loadText', 'response status - {0}' + response.statusText + await response.text());
                }
                return;
            }

            var script = document.createElement('script');
            script.id = id;
            script.type = 'text/html';
            script.async = 'async';
            script.innerHTML = await response.text();

            var head;
            if (document.getElementsByTagName('head')) {
                head = document.getElementsByTagName('head')[0];
            }
            else {
                document.documentElement.insertBefore(document.createElement('head'), document.documentElement.firstChild);
                head = document.getElementsByTagName('head')[0];
            }

            head.appendChild(script);
        },

        toUrlObject(url) {
            return (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(function (a, v) {
                return a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1), a;
            }, {});
        },

        request: async function (resources) {
            loader.resources = resources;
            var length = resources.length;
            for (var i = 0; i < length; ++i) {
                var resource = resources[i];
                if (loader.endsWith(resource, '.css')) {
                    loader.styleFiles.push(resource);
                }
                else if (loader.endsWith(resource, '.js')) {
                    loader.scriptFiles.push(resource);
                }
                else if (loader.endsWith(resource, '.html') || resource.indexOf('.html?') > -1) {
                    loader.htmlFiles.push(resource);
                }
                else {
                    loader.eventLog('unknown filetype', resource);
                }
            }

            if (synConfig && synConfig.BundlingServer === true) {
                var styleFiles = synConfig.BundlingServer + '?type=css&files=' + JSON.stringify(loader.styleFiles) + (loader.isForceBundle == true ? '&force=1' : '') + '' + (loader.isMinify == true ? '' : '&minify=0');
                loader.eventLog('request', 'styleFiles: ' + styleFiles, 'Debug');
                loader.styleFiles.length = 0;
                loader.styleFiles.push(styleFiles);

                var scriptFiles = synConfig.BundlingServer + '?type=js&files=' + JSON.stringify(loader.scriptFiles) + (loader.isForceBundle == true ? '&force=1' : '') + '' + (loader.isMinify == true ? '' : '&minify=0');
                loader.eventLog('request', 'scriptFiles: ' + scriptFiles, 'Debug');
                loader.scriptFiles.length = 0;
                loader.scriptFiles.push(scriptFiles);
            }

            await loader.loadFiles();
        },

        getDefinedResources() {
            var result = [];
            var synControlList = [];
            var synControls = document.querySelectorAll('[syn-datafield],[syn-options],[syn-events]');
            for (var i = 0; i < synControls.length; i++) {
                var synControl = synControls[i];
                if (synControl.tagName) {
                    var tagName = synControl.tagName.toUpperCase();
                    var controlType = '';
                    var moduleName = null;

                    if (tagName.indexOf('SYN_') > -1) {
                        moduleName = tagName.substring(4).toLowerCase();
                        controlType = moduleName;
                    }
                    else {
                        switch (tagName) {
                            case 'BUTTON':
                                moduleName = 'button';
                                controlType = 'button';
                                break;
                            case 'INPUT':
                                controlType = synControl.getAttribute('type').toLowerCase();
                                switch (controlType) {
                                    case 'hidden':
                                    case 'text':
                                    case 'password':
                                    case 'color':
                                    case 'email':
                                    case 'number':
                                    case 'search':
                                    case 'tel':
                                    case 'url':
                                        moduleName = 'textbox';
                                        break;
                                    case 'submit':
                                    case 'reset':
                                    case 'button':
                                        moduleName = 'button';
                                        break;
                                    case 'radio':
                                        moduleName = 'radio';
                                        break;
                                    case 'checkbox':
                                        moduleName = 'checkbox';
                                        break;
                                }
                                break;
                            case 'TEXTAREA':
                                moduleName = 'textarea';
                                controlType = 'textarea';
                                break;
                            case 'SELECT':
                                if (synControl.getAttribute('multiple') == null) {
                                    moduleName = 'select';
                                    controlType = 'select';
                                }
                                else {
                                    moduleName = 'multiselect';
                                    controlType = 'multiselect';
                                }
                                break;
                            default:
                                break;
                        }
                    }

                    if (moduleName) {
                        synControlList.push({
                            module: moduleName,
                            type: controlType ? controlType : synControl.tagName.toLowerCase()
                        });
                    }
                }
            }

            result = synControlList.filter(function (control, idx, arr) {
                return synControlList.findIndex(function (item) {
                    return item.module === control.module && item.type === control.type;
                }) === idx;
            });

            result.unshift({
                module: 'before-default',
                type: 'before-default',
                css: [
                    '//cdn.jsdelivr.net/npm/@tabler/core@1.0.0-beta12/dist/css/tabler.min.css'
                ],
                js: [
                    '//cdn.jsdelivr.net/npm/@tabler/core@1.0.0-beta12/dist/js/tabler.min.js',
                    '/assets/lib/jquery-3.6.0/jquery-3.6.0.js',
                    '/assets/lib/jquery.alertmodal.js',
                    '/assets/lib/jquery.simplemodal.js',
                    '/assets/lib/jquery.WM.js',
                    '/assets/lib/nanobar-0.4.2/nanobar.js',
                    '/assets/lib/Notifier.js',
                    '/assets/lib/clipboard-2.0.4/clipboard.js',
                    '/assets/js/syn.js',
                    '/assets/js/syn.domain.js'
                ]
            });

            for (var i = 0; i < result.length; i++) {
                var item = result[i];

                switch (item.module) {
                    case 'textbox':
                        item.css = ['/assets/js/UIControls/TextBox/TextBox.css'];
                        item.js = [
                            '/assets/lib/jquery.maskedinput-1.3.js',
                            '/assets/lib/ispin-2.0.1/ispin.js',
                            '/assets/lib/superplaceholder-1.0.0/superplaceholder.js',
                            '/assets/lib/vanilla-masker-1.1.1/vanilla-masker.js',
                            '/assets/js/UIControls/TextBox/TextBox.js'
                        ];
                        break;
                    case 'button':
                        item.css = ['/assets/js/UIControls/TextButton/TextButton.css'];
                        item.js = ['/assets/js/UIControls/TextButton/TextButton.js'];
                        break;
                    case 'radio':
                        item.css = ['/assets/js/UIControls/RadioButton/RadioButton.css'];
                        item.js = ['/assets/js/UIControls/RadioButton/RadioButton.js'];
                        break;
                    case 'checkbox':
                        item.css = [
                            '/assets/lib/css-checkbox-1.0.0/checkboxes.css',
                            '/assets/js/UIControls/CheckBox/CheckBox.css'
                        ];
                        item.js = ['/assets/js/UIControls/CheckBox/CheckBox.js'];
                        break;
                    case 'textarea':
                        item.css = [
                            '/assets/lib/codemirror-5.50.2/codemirror.css',
                            '/assets/js/UIControls/TextArea/TextArea.css'
                        ];
                        item.js = [
                            '/assets/lib/codemirror-5.50.2/codemirror.js',
                            '/assets/js/UIControls/TextArea/TextArea.js'
                        ];
                        break;
                    case 'select':
                        item.css = [
                            '/assets/lib/tail.select-0.5.15/css/default/tail.select-light.css',
                            '/assets/js/UIControls/DropDownList/DropDownList.css'
                        ];
                        item.js = [
                            '/assets/lib/tail.select-0.5.15/js/tail.select.js',
                            '/assets/js/UIControls/DropDownList/DropDownList.js'
                        ];
                        break;
                    case 'multiselect':
                        item.css = [
                            '/assets/lib/tail.select-0.5.15/css/default/tail.select-light.css',
                            '/assets/js/UIControls/DropDownCheckList/DropDownCheckList.css'
                        ];
                        item.js = [
                            '/assets/lib/tail.select-0.5.15/js/tail.select.js',
                            '/assets/js/UIControls/DropDownCheckList/DropDownCheckList.js'
                        ];
                        break;
                    case 'chartjs':
                        item.css = [
                            '/assets/lib/chartjs-2.9.3/Chart.css',
                            '/assets/js/UIControls/Chart/ChartJS.css'
                        ];
                        item.js = [
                            '/assets/lib/chartjs-2.9.3/Chart.bundle.js',
                            '/assets/lib/chartjs-plugin-colorschemes-0.4.0/chartjs-plugin-colorschemes.js',
                            '/assets/js/UIControls/Chart/ChartJS.js'
                        ];
                        break;
                    case 'codepicker':
                        item.css = ['/assets/js/UIControls/CodePicker/CodePicker.css'];
                        item.js = ['/assets/js/UIControls/CodePicker/CodePicker.js'];
                        break;
                    case 'colorpicker':
                        item.css = [
                            '/assets/lib/color-picker-1.0.0/color-picker.css',
                            '/assets/js/UIControls/ColorPicker/ColorPicker.css'
                        ];
                        item.js = [
                            '/assets/lib/color-picker-1.0.0/color-picker.js',
                            '/assets/js/UIControls/ColorPicker/ColorPicker.js'
                        ];
                        break;
                    case 'contextmenu':
                        item.css = [
                            '/assets/lib/jquery-ui-contextmenu-1.18.1/jquery-ui.css',
                            '/assets/js/UIControls/ContextMenu/ContextMenu.css'
                        ];
                        item.js = [
                            '/assets/lib/jquery-ui-contextmenu-1.18.1/jquery-ui.js',
                            '/assets/lib/jquery-ui-contextmenu-1.18.1/jquery.ui-contextmenu.js',
                            '/assets/js/UIControls/ContextMenu/ContextMenu.js'
                        ];
                        break;
                    case 'data':
                        item.css = ['/assets/js/UIControls/DataSource/DataSource.css'];
                        item.js = ['/assets/js/UIControls/DataSource/DataSource.js'];
                        break;
                    case 'datepicker':
                        item.css = [
                            '/assets/lib/pikaday-1.8.0/pikaday.css',
                            '/assets/js/UIControls/TextBox/TextBox.css',
                            '/assets/js/UIControls/DatePicker/DatePicker.css'
                        ];
                        item.js = [
                            '/assets/lib/jquery.maskedinput-1.3.js',
                            '/assets/lib/ispin-2.0.1/ispin.js',
                            '/assets/lib/moment-2.24.0/moment.js',
                            '/assets/lib/pikaday-1.8.0/pikaday.js',
                            '/assets/lib/superplaceholder-1.0.0/superplaceholder.js',
                            '/assets/js/UIControls/TextBox/TextBox.js',
                            '/assets/js/UIControls/DatePicker/DatePicker.js'
                        ];
                        break;
                    case 'fileclient':
                        item.css = ['/assets/js/UIControls/FileClient/FileClient.css'];
                        item.js = ['/assets/js/UIControls/FileClient/FileClient.js'];
                        break;
                    case 'list':
                        item.css = ['/assets/js/UIControls/GridList/GridList.css'];
                        item.js = [
                            '/assets/lib/datatable-1.10.21/datatables.js',
                            '/assets/lib/datatable-1.10.21/dataTables.checkboxes.js',
                            '/assets/js/UIControls/GridList/GridList.js'
                        ];
                        break;
                    case 'htmleditor':
                        item.css = ['/assets/js/UIControls/HtmlEditor/HtmlEditor.css'];
                        item.js = ['/assets/js/UIControls/HtmlEditor/HtmlEditor.js'];
                        break;
                    case 'jsoneditor':
                        item.css = ['/assets/js/UIControls/JsonEditor/JsonEditor.css'];
                        item.js = ['/assets/js/UIControls/JsonEditor/JsonEditor.js'];
                        break;
                    case 'organization':
                        item.css = [
                            '/assets/lib/orgchart-3.1.1/jquery.orgchart.css',
                            '/assets/js/UIControls/OrganizationView/OrganizationView.css'
                        ];
                        item.js = [
                            '/assets/lib/orgchart-3.1.1/jquery.orgchart.js',
                            '/assets/js/UIControls/OrganizationView/OrganizationView.js'
                        ];
                        break;
                    case 'sourceeditor':
                        item.css = ['/assets/js/UIControls/SourceEditor/SourceEditor.css'];
                        item.js = ['/assets/js/UIControls/SourceEditor/SourceEditor.js'];
                        break;
                    case 'editor':
                        item.css = ['/assets/js/UIControls/TextEditor/TextEditor.css'];
                        item.js = ['/assets/js/UIControls/TextEditor/TextEditor.js'];
                        break;
                    case 'tree':
                        item.css = [
                            '/assets/lib/fancytree-2.38.0/skin-win8/ui.fancytree.css',
                            '/assets/js/UIControls/TreeView/TreeView.css'
                        ];
                        item.js = [
                            '/assets/lib/fancytree-2.38.0/modules/jquery.fancytree.ui-deps.js',
                            '/assets/lib/fancytree-2.38.0/modules/jquery.fancytree.js',
                            '/assets/lib/fancytree-2.38.0/modules/jquery.fancytree.persist.js',
                            '/assets/lib/fancytree-2.38.0/modules/jquery.fancytree.multi.js',
                            '/assets/lib/fancytree-2.38.0/modules/jquery.fancytree.dnd5.js',
                            '/assets/lib/fancytree-2.38.0/modules/jquery.fancytree.filter.js',
                            '/assets/js/UIControls/TreeView/TreeView.js'
                        ];
                        break;
                    case 'grid':
                        item.css = [
                            '/assets/js/UIControls/DataSource/DataSource.css',
                            '/assets/js/UIControls/CodePicker/CodePicker.css',
                            '/assets/lib/handsontable-7.4.2/handsontable.full.css',
                            '/assets/js/UIControls/WebGrid/WebGrid.css'
                        ];
                        item.js = [
                            '/assets/js/UIControls/DataSource/DataSource.js',
                            '/assets/js/UIControls/CodePicker/CodePicker.js',
                            '/assets/lib/papaparse-5.3.0/papaparse.js',
                            '/assets/lib/sheetjs-0.16.8/xlsx.core.min.js',
                            '/assets/lib/handsontable-7.4.2/handsontable.full.js',
                            '/assets/lib/handsontable-7.4.2/languages/ko-KR.js',
                            '/assets/js/UIControls/WebGrid/WebGrid.js'
                        ];
                        break;
                }
            }

            result.push({
                module: 'after-default',
                type: 'after-default',
                css: [
                    // syn.domain.js
                    '/assets/css/Layouts/Dialogs.css',
                    '/assets/css/Layouts/LoadingPage.css',
                    '/assets/css/Layouts/ProgressBar.css',
                    '/assets/css/Layouts/Tooltips.css',
                    '/assets/css/Layouts/WindowManager.css',
                    '/assets/css/UIControls/Control.css',

                    // 프로젝트 화면 디자인
                    // '/assets/css/systemFont.css',
                    // '/assets/css/common.css',
                    // '/assets/css/system.css',
                    // '/assets/css/remixicon.css',
                ],
                js: [
                    '//cdn.jsdelivr.net/npm/@master/css@1.37.2/index.js',
                    // '/assets/lib/master-1.17.4/index.js'
                ]
            });

            return result;
        },

        sleep(ms) {
            return new Promise((r) => setTimeout(r, ms));
        },

        loadCallback() {
            var isDarkMode = localStorage.getItem('isDarkMode') === 'true';
            if (location.pathname.startsWith('/views/') == true && isDarkMode == true) {
                syn.$w.loadStyle('/assets/css/dark_mode.css', 'dark_mode');
            }

            // (new Function("try {(function functionX() {function sleep(ms) {return new Promise((r) => setTimeout(r, ms));}try {(function functlon2() {if (Math.floor(Math.random() * 10) % 10 == 0) {(function () { }['constructor']('debugger')());}sleep(100).then(() => functlon2());})();} catch (error) {setTimeout(functionX, /constructor/i.test(window.HTMLElement) || (function (p) {return p.toString() === '[object SafariRemoteNotification]';}));}})();} catch (error) {setTimeout(function () {window.location.reload();}, 3000);}")).call();

            (async function () {
                while (true) {
                    if (window.pageFormReady) {
                        document.dispatchEvent(new CustomEvent('pageReady'));
                        break;
                    }
                    await loader.sleep(25);
                }
            })();
            loader.eventLog('loadCallback', 'done');
        },

        eventLog(event, data) {
            if (loader.isEnableModuleLogging == false) {
                return;
            }

            var now = (new Date()).getTime(),
                diff = now - loader.start,
                value, div, text;

            value = loader.logCount.toString() +
                '@' + (diff / 1000).toString() +
                '[' + event + '] ' + JSON.stringify(data);

            if (window.console) {
                console.log(value);
            }
            else {
                div = document.createElement('DIV');
                text = document.createTextNode(value);

                div.appendChild(text);

                var eventlogs = document.getElementById('eventlogs');
                if (eventlogs) {
                    eventlogs.appendChild(div);

                    clearTimeout(loader.logTimer);
                    loader.logTimer = setTimeout(function () {
                        eventlogs.scrollTop = eventlogs.scrollHeight;
                    }, 10);
                }
                else {
                    document.body.appendChild(div);
                }
            }

            loader.logCount++;
        }
    };

    window.synConfigName = sessionStorage.getItem('synConfigName') || 'syn.config.json';
    var cacheSynConfig = sessionStorage.getItem('synConfig');
    if (window.synConfigName == 'syn.config.json' && cacheSynConfig) {
        window.synConfig = JSON.parse(cacheSynConfig);
    }

    var loaderRequest = async function () {
        var loadFiles = null;
        var htmlFiles = [];
        var styleFiles = [];
        var jsFiles = [];

        if (window.synConfigName == 'syn.config.json' && (window.synLagacyLoadModule === undefined || window.synLagacyLoadModule !== true)) {
            var definedResource = loader.getDefinedResources();
            var cssList = definedResource.map(function (item) { return item.css });
            var jsList = definedResource.map(function (item) { return item.js });

            for (var i = 0; i < cssList.length; i++) {
                styleFiles = styleFiles.concat(cssList[i]);
            }

            for (var i = 0; i < jsList.length; i++) {
                jsFiles = jsFiles.concat(jsList[i]);
            }

            /*
            <script type="text/javascript">
                function pageLoadFiles(styleFiles, jsFiles, htmlFiles) {
                    styleFiles.push('/assets/js/UIControls/GridList/GridList.css');
                    jsFiles.push('/assets/lib/datatable-1.10.21/datatables.js');
                    jsFiles.push('/assets/js/UIControls/GridList/GridList.js');
                }
            </script>
             */
            if (window.pageLoadFiles) {
                pageLoadFiles(jsFiles, styleFiles, htmlFiles);
                loadFiles = styleFiles.concat(jsFiles).concat(htmlFiles);
            }
            else {
                loadFiles = styleFiles.concat(jsFiles);
            }

            var roleID = null;
            var member = JSON.parse(sessionStorage.getItem('member'));;
            if (member != null) {
                result = JSON.parse(decodeURIComponent(atob(member).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join('')));

                roleID = result.Roles[0];
            }

            if (roleID != null) {
                // loadFiles.push('/assets/css/system_' + roleID + '.css');
            }

            if (window.beforeLoadFiles && window.beforeLoadFiles.length > 0) {
                for (var i = window.beforeLoadFiles.length - 1; i >= 0; i--) {
                    loadFiles.unshift(window.beforeLoadFiles[i]);
                }
            }

            if (window.afterLoadFiles && window.afterLoadFiles.length > 0) {
                for (var i = window.afterLoadFiles.length - 1; i >= 0; i--) {
                    loadFiles.push(window.afterLoadFiles[i]);
                }
            }
        }
        else {
            if (synConfig.Environment == 'Development') {
                styleFiles = [
                    // syn.scripts.js
                    '/assets/lib/handsontable-7.4.2/handsontable.full.css',
                    '/assets/lib/datatable-1.10.21/datatables.css',
                    '/assets/lib/datatable-1.10.21/dataTables.checkboxes.css',
                    '/assets/lib/tingle-0.15.2/tingle.css',
                    '/assets/lib/tail.select-0.5.15/css/default/tail.select-light.css',
                    '/assets/lib/ispin-2.0.1/ispin.css',
                    '/assets/lib/flatpickr-4.6.3/flatpickr.css',
                    '/assets/lib/filedrop-1.0.0/filedrop.css',
                    '/assets/lib/css-checkbox-1.0.0/checkboxes.css',
                    '/assets/lib/color-picker-1.0.0/color-picker.css',
                    '/assets/lib/codemirror-5.50.2/codemirror.css',
                    '/assets/lib/chartjs-2.9.3/Chart.css',
                    '/assets/lib/fancytree-2.38.0/skin-win8/ui.fancytree.css',
                    '/assets/lib/jquery-ui-contextmenu-1.18.1/jquery-ui.css',
                    '/assets/lib/orgchart-3.1.1/jquery.orgchart.css',

                    // syn.domain.js
                    '/assets/css/Layouts/Dialogs.css',
                    '/assets/css/Layouts/LoadingPage.css',
                    '/assets/css/Layouts/ProgressBar.css',
                    '/assets/css/Layouts/Tooltips.css',
                    '/assets/css/Layouts/WindowManager.css',
                    '/assets/css/UIControls/Control.css',

                    // syn.controls.js
                    '/assets/js/UIControls/Chart/ChartJS.css',
                    '/assets/js/UIControls/CheckBox/CheckBox.css',
                    '/assets/js/UIControls/ColorPicker/ColorPicker.css',
                    '/assets/js/UIControls/ContextMenu/ContextMenu.css',
                    '/assets/js/UIControls/DataSource/DataSource.css',
                    '/assets/js/UIControls/DatePicker/DatePicker.css',
                    '/assets/js/UIControls/DropDownCheckList/DropDownCheckList.css',
                    '/assets/js/UIControls/DropDownList/DropDownList.css',
                    '/assets/js/UIControls/FileClient/FileClient.css',
                    '/assets/js/UIControls/GridList/GridList.css',
                    '/assets/js/UIControls/OrganizationView/OrganizationView.css',
                    '/assets/js/UIControls/RadioButton/RadioButton.css',
                    '/assets/js/UIControls/TextArea/TextArea.css',
                    '/assets/js/UIControls/TextBox/TextBox.css',
                    '/assets/js/UIControls/TextButton/TextButton.css',
                    '/assets/js/UIControls/TextEditor/TextEditor.css',
                    '/assets/js/UIControls/HtmlEditor/HtmlEditor.css',
                    '/assets/js/UIControls/TreeView/TreeView.css',
                    '/assets/js/UIControls/WebGrid/WebGrid.css',

                    // 프로젝트 화면 디자인
                    '/assets/css/systemFont.css',
                    '/assets/css/common.css',
                    '/assets/css/system.css',
                    '/assets/css/remixicon.css',

                    // syn-utilities 화면 유틸리티
                    '/assets/css/syn-utilities.css'
                ];

                jsFiles = [
                    '/assets/js/syn.scripts.js',
                    '/assets/js/syn.js',
                    '/assets/js/syn.domain.js',
                    '/assets/js/syn.controls.js'
                ];
            }
            else {
                if (synConfig.IsDebugMode == true) {
                    styleFiles = [
                        '/assets/css/syn.bundle.css'
                    ];

                    jsFiles = [
                        '/assets/js/syn.bundle.js'
                    ];
                }
                else {
                    styleFiles = [
                        '/assets/css/syn.bundle.min.css'
                    ];

                    jsFiles = [
                        '/assets/js/syn.bundle.min.js'
                    ];
                }
            }

            /*
            <script type="text/javascript">
                function pageLoadFiles(styleFiles, jsFiles, htmlFiles) {
                    styleFiles.push('/assets/js/UIControls/GridList/GridList.css');
                    jsFiles.push('/assets/lib/datatable-1.10.21/datatables.js');
                    jsFiles.push('/assets/js/UIControls/GridList/GridList.js');
                }
            </script>
             */
            if (window.pageLoadFiles) {
                pageLoadFiles(jsFiles, styleFiles, htmlFiles);
                loadFiles = styleFiles.concat(jsFiles).concat(htmlFiles);
            }
            else {
                loadFiles = styleFiles.concat(jsFiles);
            }

            var roleID = null;
            var member = JSON.parse(sessionStorage.getItem('member'));;
            if (member != null) {
                result = JSON.parse(decodeURIComponent(atob(member).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join('')));

                roleID = result.Roles[0];
            }

            if (roleID != null) {
                // loadFiles.push('/assets/css/system_' + roleID + '.css');
            }

            loadFiles.push('/assets/css/company/system_' + (getCookie('FileBusinessID') || location.hostname) + '.css');
            if (window.beforeLoadFiles && window.beforeLoadFiles.length > 0) {
                for (var i = window.beforeLoadFiles.length - 1; i >= 0; i--) {
                    loadFiles.unshift(window.beforeLoadFiles[i]);
                }
            }

            if (window.afterLoadFiles && window.afterLoadFiles.length > 0) {
                for (var i = window.afterLoadFiles.length - 1; i >= 0; i--) {
                    loadFiles.push(window.afterLoadFiles[i]);
                }
            }
        }

        loader.argArgs = getCookie('syn.iscache') == 'true' ? '' : 'bust=' + new Date().getTime();
        await loader.request(loadFiles);
    }

    if (window.synConfig) {
        loaderRequest();
    }
    else {
        var response = await fetch('/' + window.synConfigName, { cache: 'no-cache' });
        if (response.status === 200) {
            window.synConfig = await response.json();
            sessionStorage.setItem('synConfig', JSON.stringify(window.synConfig));
            loaderRequest();
        }
        else {
            loader.eventLog('loadJson', ' ' + window.synConfigName + ', ' + response.status.toString() + ', ' + await response.text(), 'Error');
        }
    }
}());
