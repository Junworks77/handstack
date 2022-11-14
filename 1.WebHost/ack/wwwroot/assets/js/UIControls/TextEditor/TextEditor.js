/// <reference path="/Scripts/syn.js" />

(function (window) {
    'use strict';
    syn.uicontrols = syn.uicontrols || new syn.module();
    var $editor = syn.uicontrols.$editor || new syn.module();

    $editor.extend({
        name: 'syn.uicontrols.$editor',
        version: '1.0',
        contentHtmlUrl: syn.Config.SharedAssetUrl + 'html/content.html',
        defaultSetting: {
            width: '100%',
            height: '240px',
            contents: '',
            dataType: 'string',
            belongID: null,
            getter: false,
            setter: false,
            controlText: null,
            validators: null,
            transactConfig: null,
            triggerConfig: null
        },

        addModuleList: function (el, moduleList, setting, controlType) {
            var elementID = el.getAttribute('id');
            var dataField = el.getAttribute('syn-datafield');
            var formDataField = el.closest('form') ? el.closest('form').getAttribute('syn-datafield') : '';

            moduleList.push({
                id: elementID,
                formDataFieldID: formDataField,
                field: dataField,
                module: this.name,
                type: controlType
            });
        },

        controlLoad: function (elID, setting) {
            var el = syn.$l.get(elID);

            setting = syn.$w.argumentsExtend($editor.defaultSetting, setting);

            var mod = window[syn.$w.pageScript];
            if (mod && mod.hook.controlInit) {
                var moduleSettings = mod.hook.controlInit(elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            el.setAttribute('id', elID + '_hidden');
            el.setAttribute('syn-options', JSON.stringify(setting));

            if (syn.$l.get('htmlEditorOption') == null) {
                var popups = [];
                popups.push('<div id="textEditor_fontFamily" class="editorPop">');
                popups.push('<ul class="textEditor_fontFamily" elID="{0}">'.format(elID));
                popups.push('<li style="font-family: 굴림;" role="한국어" value="굴림">굴림</li>');
                popups.push('<li style="font-family: 돋움;" role="한국어" value="돋움">돋움</li>');
                popups.push('<li style="font-family: 맑은 고딕;" role="한국어" value="맑은 고딕">맑은 고딕</li>');
                popups.push('<li style="font-family: 궁서;" role="한국어" value="궁서">궁서</li>');
                popups.push('<li style="font-family: Arial;" role="영어" value="Arial">Arial</li>');
                popups.push('<li style="font-family: Verdana;" role="영어" value="Verdana">Verdana</li>');
                popups.push('<li style="font-family: Meiryo;" role="일본어" value="Meiryo">Meiryo</li>');
                popups.push('<li style="font-family: MS Song;" role="일본어" value="MS Song">MS Song</li>');
                popups.push('<li style="font-family: Simplified Arabic;" role="중국어" value="Simplified Arabic">Simplified Arabic</li>');
                popups.push('<li style="font-family: Mingliu;" role="중국어" value="Mingliu">Mingliu</li>');
                popups.push('</ul>');
                popups.push('</div>');
                popups.push('<div id="textEditor_fontSize" class="editorPop">');
                popups.push('<ul class="textEditor_fontSize" elID="{0}">'.format(elID));
                popups.push('<li style="font-size: 12px;" value="1">가나다라 (12px)</li>');
                popups.push('<li style="font-size: 13px;" value="2">가나다라 (13px)</li>');
                popups.push('<li style="font-size: 16px;" value="3">가나다라 (16px)</li>');
                popups.push('<li style="font-size: 18px;" value="4">가나다라 (18px)</li>');
                popups.push('<li style="font-size: 24px;" value="5">가나다라 (24px)</li>');
                popups.push('<li style="font-size: 32px;" value="6">가나다라 (32px)</li>');
                popups.push('<li style="font-size: 36px;" value="7">가나다라 (36px)</li>');
                popups.push('</ul>');
                popups.push('</div>');
                popups.push('<div id="textEditor_colorScheme" class="editorPop">');
                popups.push('<ul class="textEditor_colorScheme" elID="{0}">'.format(elID));
                popups.push('<li style="background: #000000;" value="#000000">#000000</li>');
                popups.push('<li style="background: #008ace;" value="#008ace">#008ace</li>');
                popups.push('<li style="background: #ff7700;" value="#ff7700">#ff7700</li>');
                popups.push('<li style="background: #64b41a;" value="#64b41a">#64b41a</li>');
                popups.push('<li style="background: #fee100;" value="#fee100">#fee100</li>');
                popups.push('<li style="background: #cc0000;" value="#cc0000">#cc0000</li>');
                popups.push('<li style="background: #ef4423;" value="#ef4423">#ef4423</li>');
                popups.push('<li style="background: #34526f;" value="#34526f">#34526f</li>');
                popups.push('<li style="background: #00a0d1;" value="#00a0d1">#00a0d1</li>');
                popups.push('<li style="background: #21759b;" value="#21759b">#21759b</li>');
                popups.push('<li style="background: #d54e21;" value="#d54e21">#d54e21</li>');
                popups.push('<li style="background: #464646;" value="#464646">#464646</li>');
                popups.push('<li style="background: #5e8b1d;" value="#5e8b1d">#5e8b1d</li>');
                popups.push('<li style="background: #0060a3;" value="#0060a3">#0060a3</li>');
                popups.push('<li style="background: #f7f7f7;" value="#f7f7f7">#f7f7f7</li>');
                popups.push('</ul>');
                popups.push('</div>');

                syn.$m.append(document.body, 'div', 'htmlEditorOption', { display: 'none' });
                syn.$l.get('htmlEditorOption').innerHTML = popups.join('');
            }

            var elButtonID = 'btn_qafeditor_{0}'.format(elID);
            var data =
                '<div>' +
                '<div class="buttonGroup">' +
                '<button type="button" class="txtBtn icon-save" id="{0}_fontfamily" value="font-family" command="fontname" option="fontFamily" class="textEditorIcon font" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_fontsize" value="font-size" command="fontsize" option="fontSize" class="textEditorIcon size" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_cut" value="Cut" command="cut" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_copy" value="Copy" command="copy" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_paste" value="Paste" command="paste" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_bold" value="Bold" command="bold" class="textEditorIcon bold" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_italic" value="Italic" command="italic" class="textEditorIcon italic" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_underline" value="Underline" command="underline" class="textEditorIcon underline" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_strike" value="&lt;s&gt;" command="strikethrough" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_hr" value="&lt;hr /&gt;" command="inserthorizontalrule" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_undo" value="Undo" command="undo" class="textEditorIcon undo" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_redo" value="Redo" command="redo" class="textEditorIcon redo" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_bgcolor" value="bgcolor" command="backcolor" option="colorScheme" class="textEditorIcon forecolor" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_fgcolor" value="fgcolor" command="forecolor" option="colorScheme" class="textEditorIcon backcolor" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_left" value="left" command="justifyleft" class="textEditorIcon jleft" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_right" value="right" command="justifyright" class="textEditorIcon jright" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_center" value="center" command="justifycenter" class="textEditorIcon jcenter" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_justify" value="justify" command="justifyfull" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_ol" value="&lt;ol&gt;" command="insertorderedlist" class="textEditorIcon ol" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_ul" value="&lt;ul&gt;" command="insertunorderedlist" class="textEditorIcon ul" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_p" value="&lt;p&gt;" command="insertparagraph" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_indent" value="indent" command="indent" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_outdent" value="outdent" command="outdent" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_del" value="del" command="delete" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_image" value="&lt;img /&gt;" command="insertimage" class="textEditorIcon image" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_link" value="&lt;a&gt;" command="createLink" />'.format(elButtonID) +
                '<button type="button" class="txtBtn icon-save" id="{0}_unlink" value="unlink" command="unlink" />'.format(elButtonID) +
                '</div>' +
                '<div class="qaf__texteditor__form">' +
                '<iframe id="{0}" class="ui_editor" style="overflow:auto; width:{1}; height: {2}" src="{3}" syn-options="{dataType: \'string\', belongID: \'{4}\'}" scrolling="yes">'.format(elID, setting.width, setting.height, $editor.contentHtmlUrl, setting.belongID) +
                '{0}'.format(setting.contents) +
                '</iframe>' +
                '</div>' +
                '</div>';
            el.innerHTML = data;

            var buttons = syn.$l.querySelectorAll('[id*=\'' + elID + '_editbutton\']');
            for (var i = 0; i < buttons.length; i++) {
                syn.$l.addEvent(buttons[i], 'click', function (e) {
                    var el = e.target || e.srcElement || e;
                    var iframe = syn.$l.get(el.id.replace('_editbutton', ''));
                    var command = el.getAttribute('command');
                    var bool = false;
                    var option = el.getAttribute('option') || null;

                    $editor.execCommand(iframe.id, command, option);

                    el = null;
                    iframe = null;
                    command = null;
                    bool = null;
                    option = null;
                });
            }

            var list = syn.$l.querySelectorAll('#textEditor_fontFamily li', '#textEditor_fontSize li', '#textEditor_colorScheme li');
            for (var i = 0; i < list.length; i++) {
                syn.$l.addEvent(list[i], 'click', function (e) {
                    var el = e.target || e.srcElement || e;
                    var value = {};
                    value.elID = el.parentElement.getAttribute('elID');
                    value.option = el.getAttribute('value');

                    syn.$w.closeDialog(value);
                });
            }

            var el = syn.$l.get(elID);
            el.onload = () => {
                $editor.setValue(elID, setting.contents);
            }

            if (setting.bindingID && syn.uicontrols.$data) {
                syn.uicontrols.$data.bindingSource(elID, setting.bindingID);
            }
        },

        // execCommand 명령어입니다. command는 http://www.quirksmode.org/dom/execCommand.html 참조
        execCommand: function (el, command, option) {
            if ($ref.isString(el) == true) {
                el = syn.$l.get(el);
            }
            var bool = false;

            el.contentWindow.focus();
            if (command.toLowerCase() == 'insertimage') {
                if (option) {
                    $editor.insertImage(el, option);
                } else {

                }
            } else {
                if (option) {
                    var dialogOptions = $ref.clone(syn.$w.dialogOptions);

                    var isPopupOpen = true;
                    switch (option) {
                        case 'fontFamily':
                            dialogOptions.minWidth = 160;
                            dialogOptions.minHeight = 240;
                            break;
                        case 'fontSize':
                            dialogOptions.minWidth = 280;
                            dialogOptions.minHeight = 200;
                            break;
                        case 'colorScheme':
                            dialogOptions.minWidth = 160;
                            dialogOptions.minHeight = 81;
                            break;
                        default:
                            isPopupOpen = false;
                            break;
                    }

                    if (isPopupOpen == true) {
                        $editor.selection = el.contentWindow.getSelection();
                        if ($editor.selection) {
                            $editor.range = $editor.selection.getRangeAt(0);
                        } else {
                            $editor.range = el.contentDocument.createRange();
                        }

                        syn.$w.showDialog(syn.$l.get('textEditor_' + option), dialogOptions, function (value) {
                            if (value) {
                                if ($editor.range && syn.$b.isIE) {
                                    if ($editor.selection) {
                                        $editor.selection.removeAllRanges();
                                        $editor.selection.addRange($editor.range);
                                    }
                                }

                                var el = syn.$l.get(value.elID);
                                el.contentDocument.execCommand(command, false, value.option);
                                if (command.toLowerCase() == 'fontsize') {
                                    var fontSize = { 1: 12, 2: 13, 3: 16, 4: 18, 5: 24, 6: 32, 7: 36 };
                                    var fontArray = el.contentDocument.getElementsByTagName('font');
                                    var size = '';
                                    for (var i = 0; i < fontArray.length; i++) {
                                        size = fontArray[i].getAttribute('size');
                                        if (size) {
                                            fontArray[i].removeAttribute('size');
                                            fontArray[i].style.fontSize = fontSize[size] + 'px';
                                        }
                                    }
                                }
                            }
                        });
                    } else {
                        if (command.toLowerCase() == 'backcolor') {
                            if (syn.$b.isIE == true) {
                                el.contentDocument.execCommand("hilitecolor", false, option);
                            } else {
                                el.contentDocument.execCommand("backcolor", false, option);
                            }

                        } else {
                            el.contentDocument.execCommand(command, bool, option);
                        }
                    }

                } else {
                    el.contentDocument.execCommand(command, bool, option);
                }
            }
        },

        insertImage: function (el, imageUrl) {
            if ($ref.isString(el) == true) {
                el = syn.$l.get(el);
            }

            el.focus();
            var sel = el.contentDocument.selection;
            if (sel) {
                var textRange = sel.createRange();
                el.contentDocument.execCommand('insertImage', false, imageUrl);
                textRange.collapse(false);
                textRange.select();
                textRange = null;
            } else {
                el.contentDocument.execCommand('insertImage', false, imageUrl);
            }
        },

        insertHTML: function (el, html) {
            if ($ref.isString(el) == true) {
                el = syn.$l.get(el);
            }

            el.focus();
            var sel = el.contentDocument.selection;
            if (sel) {
                var textRange = sel.createRange();
                el.contentDocument.execCommand('insertHTML', false, html);
                textRange.collapse(false);
                textRange.select();
                textRange = null;
            } else {
                el.contentDocument.execCommand('insertHTML', false, html);
            }
        },

        stripScripts: function (html) {
            var div = document.createElement('div');
            div.innerHTML = html;
            var scripts = div.getElementsByTagName('script');
            var i = scripts.length;
            while (i--) {
                scripts[i].parentNode.removeChild(scripts[i]);
            }

            return div.innerHTML;
        },

        getValue: function (elID) {
            var el = syn.$l.get(elID);
            return $editor.stripScripts(el.contentDocument.body.innerHTML);
        },

        setValue: function (elID, value) {
            var el = syn.$l.get(elID);

            el.contentDocument.body.innerHTML = value;
        },

        clear: function (elID, isControlLoad) {
            var el = syn.$l.get(elID);

            el.contentDocument.body.innerHTML = '';
        },

        setLocale: function (elID, translations, control, options) {
        }
    });
    syn.uicontrols.$editor = $editor;
})(window);
