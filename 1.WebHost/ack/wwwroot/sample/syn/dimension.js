syn.Config.IsViewMappingModel = false;

$w.initializeScript({
    btnGetDocumentSize_click: function () {
        syn.$l.get('txtGetDocumentSize').value = JSON.stringify(syn.$d.getDocumentSize());
    },
    btnGetWindowSize_click: function () {
        syn.$l.get('txtGetWindowSize').value = JSON.stringify(syn.$d.getWindowSize());
    },
    btnGetScrollSize_click: function () {
        syn.$l.get('txtGetScrollSize').value = JSON.stringify(syn.$d.getScrollSize());
    },
    btnGetMousePosition_click: function () {
        syn.$l.get('txtGetMousePosition').value = JSON.stringify(syn.$d.getMousePosition());
    },
    btnOffsetLeft_click: function () {
        syn.$l.get('txtOffsetLeft').value = JSON.stringify(syn.$d.offsetLeft(syn.$l.get('txtGetMousePosition')));
    },
    btnParentOffsetLeft_click: function () {
        syn.$l.get('txtParentOffsetLeft').value = JSON.stringify(syn.$d.parentOffsetLeft(syn.$l.get('tdParntOffLeft')));
    },
    btnOffsetTop_click: function () {
        syn.$l.get('txtOffsetTop').value = JSON.stringify(syn.$d.offsetTop(syn.$l.get('txtOffsetTop')));
    },
    btnParentOffsetTop_click: function () {
        syn.$l.get('txtParentOffsetTop').value = JSON.stringify(syn.$d.parentOffsetTop(syn.$l.get('tdParentOffsetTop')));
    },
    btnGetBounds_click: function () {
        syn.$l.get('txtGetBounds').value = JSON.stringify(syn.$d.getBounds(syn.$l.get('tdGetBounds')));
    },
    btnGetPosition_click: function () {
        syn.$l.get('txtGetPosition').value = JSON.stringify(syn.$d.getPosition(syn.$l.get('txtGetPosition'), true));
    },
    btnOffset_click: function () {
        syn.$l.get('txtOffset').value = JSON.stringify(syn.$d.offset(syn.$l.get('txtOffset')));
    }
})
