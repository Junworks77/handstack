'use strict';
let $parsehtml = {
    prop: {
        converter: null
    },
    hook: {
        extendLoad($this) {
            $this.prop.converter = new showdown.Converter({
                tables: true,
                tasklists: true,
                underline: true,
                strikethrough: true,
                simplifiedAutoLink: true,
                simpleLineBreaks: true,
                emoji: true
            });

            let codes = syn.$l.querySelectorAll('pre code');
            if (codes) {
                syn.$m.each(codes, (item) => {
                    item.outerHTML = hljs.highlight(item.innerHTML, { language: item.getAttribute('language') }).value;
                });
            }

            let texts = syn.$l.getName('text');
            if (texts) {
                syn.$m.each(texts, (item) => {
                    item.outerHTML = $this.prop.converter.makeHtml(item.innerHTML);
                });
            }
        }
    }
};
