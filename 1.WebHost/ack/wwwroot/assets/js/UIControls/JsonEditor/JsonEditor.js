/// <reference path="/Scripts/syn.js" />

(function (window) {
    syn.uicontrols = syn.uicontrols || new syn.module();
    var $jsoneditor = syn.uicontrols.$jsoneditor || new syn.module();

    $jsoneditor.extend({
        name: 'syn.uicontrols.$jsoneditor',
        version: '1.0',
        editorControls: [],
        defaultSetting: {
            width: '100%',
            height: '360px',
            mode: 'tree',
            modes: ['code', 'tree', 'view'],
            indentation: 4,
            escapeUnicode: false,
            language: 'ko',
            languages: {
                ko: {
                    array: '배열',
                    auto: '자동',
                    appendText: '추가',
                    appendTitle: '다음 필드에 "자동"필드 추가 (Ctrl + Shift + Ins)',
                    appendSubmenuTitle: '추가 필드 유형을 선택하십시오',
                    appendTitleAuto: ' "자동"필드 추가 (Ctrl + Shift + Ins)',
                    ascending: '오름차순',
                    ascendingTitle: '$ {type}의 하위 요소를 오름차순으로 정렬',
                    actionsMenu: '클릭하여 동작 메뉴 열기 (Ctrl + M)',
                    collapseAll: '모두 접기',
                    descending: '내림차순',
                    descendingTitle: '$ {type}의 하위 요소를 내림차순으로 정렬',
                    drag: '드래그하여 선택한 필드를 이동 (Alt + Shift + Arrows)',
                    duplicateKey: '복제 키',
                    duplicateText: '복제',
                    duplicateTitle: '선택한 필드 유형을 복제 (Ctrl + D)',
                    duplicateField: '선택한 필드 유형을 복제 (Ctrl + D)',
                    duplicateFieldError: '필드 이름이 중복되었습니다.',
                    cannotParseFieldError: 'JSON 필드를 해석 할 수 없습니다.',
                    cannotParseValueError: 'JSON 값을 해석 할 수 없습니다.',
                    empty: 'empty',
                    expandAll: '모두 확장',
                    expandTitle: '클릭하여 필드를 확장 / 축소 (Ctrl + E) \n' + 'Ctrl + Click으로 모든 자식 요소를 확장 / 축소',
                    insert: '삽입',
                    insertTitle: '선택한 필드 앞에 새 필드를 삽입 (Ctrl + Ins)',
                    insertSub: '삽입하는 필드 유형을 선택',
                    object: '객체',
                    ok: '실행',
                    redo: '다시 (Ctrl + Shift + Z)',
                    removeText: '삭제',
                    removeTitle: '선택한 필드를 제거 (Ctrl + Del)',
                    removeField: '선택한 필드를 제거 (Ctrl + Del)',
                    selectNode: '노드를 선택 ...',
                    showAll: '모두보기',
                    showMore: '더보기',
                    showMoreStatus: '$ {totalChilds} 개의 항목 중 $ {visibleChilds} 개를 표시합니다',
                    sort: '정렬',
                    sortTitle: '$ {type} 자식 요소를 정렬',
                    sortTitleShort: '정렬',
                    sortFieldLabel: '필드',
                    sortDirectionLabel: '순서',
                    sortFieldTitle: '배열이나 객체를 정렬하는 필드를 선택',
                    sortAscending: '오름차순',
                    sortAscendingTitle: '선택한 필드를 오름차순으로 정렬',
                    sortDescending: '내림차순',
                    sortDescendingTitle: '선택한 필드를 내림차순으로 정렬',
                    string: '문자열',
                    transform: '변환',
                    transformTitle: '$ {type} 자식 요소를 필터 정렬 · 변환',
                    transformTitleShort: '내용을 필터 정렬 · 변환',
                    extract: '추출',
                    extractTitle: '$ {type}을 추출',
                    transformQueryTitle: 'JMESPath 쿼리를 입력',
                    transformWizardLabel: '마법사',
                    transformWizardFilter: '필터',
                    transformWizardSortBy: '정렬',
                    transformWizardSelectFields: '필드를 선택',
                    transformQueryLabel: '쿼리',
                    transformPreviewLabel: '미리보기',
                    type: '형',
                    typeTitle: '선택한 필드의 형식을 변경',
                    openUrl: 'Ctrl + Click 또는 Ctrl + Enter를 새 창에서 URL 열기',
                    undo: '실행 취소 (Ctrl + Z)',
                    validationCannotMove: '자식 요소로 이동할 수 없습니다.',
                    autoType: '오토 :' + '필드의 형식은 값에서 자동으로 결정됩니다. ' + '(문자열 · 수치 · 부르 null) ',
                    objectType: '개체 :' + '개체는 순서가 정해져 있지 않은 키와 값의 쌍 조합입니다',
                    arrayType: '배열 :' + '배열은 순서가 정해져있는 값의 집합체입니다',
                    stringType: '문자열 :' + '필드 형 값에서 결정되지 않지만' + '항상 문자열로 반환됩니다',
                    modeCodeText: '코드 모드',
                    modeCodeTitle: '하이라이트 모드로 전환',
                    modeFormText: '양식 모드',
                    modeFormTitle: '양식 모드로 전환',
                    modeTextText: '텍스트 모드',
                    modeTextTitle: '텍스트 모드로 전환',
                    modeTreeText: '트리 모드',
                    modeTreeTitle: '트리 모드로 전환',
                    modeViewText: '보기 모드',
                    modeViewTitle: '보기 모드로 전환',
                    modePreviewText: '미리보기',
                    modePreviewTitle: '미리보기로 전환',
                    examples: '예',
                    default: '기본'
                }
            },
            dataType: 'string',
            belongID: null,
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

            setting = syn.$w.argumentsExtend($jsoneditor.defaultSetting, setting);

            var mod = window[syn.$w.pageScript];
            if (mod && mod.hook.controlInit) {
                var moduleSettings = mod.hook.controlInit(elID, setting);
                setting = syn.$w.argumentsExtend(setting, moduleSettings);
            }

            el.setAttribute('id', el.id + '_hidden');
            el.setAttribute('syn-options', JSON.stringify(setting));
            el.style.display = 'none';

            var parent = el.parentNode;
            var container = document.createElement('div');
            container.id = elID;
            container.setAttribute('syn-datafield', el.getAttribute('syn-datafield'));
            container.setAttribute('syn-options', el.getAttribute('syn-options'));
            $m.setStyle(container, 'width', setting.width);
            $m.setStyle(container, 'height', setting.height);
            $m.setStyle(container, 'border', '1px solid #ccc');

            parent.appendChild(container);

            $jsoneditor.editorControls.push({
                id: elID,
                editor: new JSONEditor(container, setting),
                setting: $reflection.clone(setting)
            });

            if (setting.bindingID && syn.uicontrols.$data) {
                syn.uicontrols.$data.bindingSource(elID, setting.bindingID);
            }
        },

        getValue: function (elID, meta) {
            var result = '';
            var el = syn.$l.get(elID);
            if (el) {
                var control = $jsoneditor.getControl(elID);
                if (control) {
                    if (control.editor) {
                        result = control.editor.getText();
                    }
                }
            }

            return result;
        },

        setValue: function (elID, value, meta) {
            var el = syn.$l.get(elID);
            if (el) {
                var control = $jsoneditor.getControl(elID);
                if (control) {
                    if (control.editor) {
                        control.editor.setText(value);
                    }
                }
            }
        },

        clear: function (elID, isControlLoad) {
            var el = syn.$l.get(elID);
            if (el) {
                var control = $jsoneditor.getControl(elID);
                if (control) {
                    if (control.editor) {
                        control.editor.setText('{}');
                    }
                }
            }
        },

        toXml: function (jsonObj) {
            if ($ref.isString(jsonObj) == true) {
                jsonObj = JSON.parse(jsonObj);
            }

            var x2js = new X2JS();
            return x2js.json2xml_str(jsonObj);
        },

        getControl: function (elID) {
            var result = null;
            var length = $jsoneditor.editorControls.length;
            for (var i = 0; i < length; i++) {
                var item = $jsoneditor.editorControls[i];

                if (item.id == elID) {
                    result = item;
                    break;
                }
            }

            return result;
        },

        setLocale: function (elID, translations, control, options) {
        }
    });
    syn.uicontrols.$jsoneditor = $jsoneditor;
})(window);
