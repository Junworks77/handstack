/// <reference path='syn.core.js' />

(function (context) {
    'use strict';
    var $manipulation = $manipulation || new syn.module();
    var document = context.document;

    $manipulation.extend({
        version: "1.0",

        body() {
            return document;
        },

        documentElement() {
            return document.documentElement;
        },

        childNodes(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.childNodes;
        },

        firstChild(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.firstChild;
        },

        lastChild(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.lastChild;
        },

        nextSibling(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.nextSibling;
        },

        previousSibling(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.previousSibling;
        },

        siblings(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return [].slice.call(parent.children).filter(function (child) {
                return child !== el;
            });
        },

        parentNode(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.parentNode;
        },

        innerText(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.innerText;
        },

        nodeName(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.nodeName;
        },

        nodeType(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.nodeType;
        },

        nodeValue(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.nodeValue;
        },

        className(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.className;
        },

        removeAttribute(el, prop) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.removeAttribute(prop);
        },

        getAttribute(el, prop) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.getAttribute(prop);
        },

        setAttribute(el, prop, val) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.setAttribute(prop, val);
        },

        appendChild(el, node) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.appendChild(node);
        },

        cloneNode(el, isClone) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.cloneNode(isClone);
        },

        createElement(tagName) {
            return document.createElement(tagName);
        },

        createTextNode(data) {
            return document.createTextNode(data);
        },

        innerHTML(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.innerHTML;
        },

        outerHTML(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.outerHTML;
        },

        setStyle(el, prop, val) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            el.style[prop] = val;
            return this;
        },

        // syn.$w.addCssText(el, 'background:red;width:200px;height:200px;');
        addCssText(el, cssText) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el.style.cssText != undefined) {
                el.style.cssText = cssText;
            }
            return this;
        },

        // syn.$w.addStyle(el, { backgroundColor:'blue', color:'white', border:'2px solid red' });
        addStyle(el, objects) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            for (var prop in objects) {
                this.setStyle(el, prop, objects[prop]);
            }
            return this;
        },

        getStyle(el, prop) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.style[prop];
        },

        hasHidden(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return (el == null || el.offsetParent == null || context.getComputedStyle(el)['display'] == 'none');
        },

        getComputedStyle(el, prop) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return context.getComputedStyle(el)[prop];
        },

        addClass(el, css) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (this.hasClass(el, css) == false) {
                if (el.classList && el.classList.add) {
                    el.classList.add(css);
                }
                else {
                    el.className = (el.className + ' ' + css).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                }
            }
            return this;
        },

        hasClass(el, css) {
            var result = false;
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el) {
                if (el.classList && el.classList.contains) {
                    result = el.classList.contains(css);
                }
                else {
                    result = syn.$m.getClassRegEx(css).test(el.className);
                }
            }

            return result;
        },

        toggleClass(el, css) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el) {
                if (el.classList && el.classList.toggle) {
                    el.classList.toggle(css);
                }
            }

            return this;
        },

        removeClass(el, css) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el) {
                if (css === undefined) {
                    el.className = '';
                }
                else {
                    if (el.classList && el.classList.remove) {
                        el.classList.remove(css);
                    }
                    else {
                        var re = syn.$m.getClassRegEx(css);
                        el.className = el.className.replace(re, '');
                        re = null;
                    }

                }
            }

            return this;
        },

        append(el, tag, eid, styles, html) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            var cl = document.createElement(tag);

            if (eid) {
                cl.id = eid;
            }

            if (styles) {
                this.addStyle(cl, styles);
            }

            if (html) {
                this.innerHTML(html);
            }

            el.appendChild(cl);
            return cl;
        },

        prepend(el, baseEl) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            baseEl.insertBefore(el, baseEl.firstChild);
        },

        copy(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.cloneNode(true);
        },

        empty(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el) {
                while (el.firstChild) {
                    syn.$w.purge(el.firstChild);

                    el.removeChild(node.firstChild);
                }
            }

            return this;
        },

        remove(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el) {
                syn.$w.purge(el);

                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            }

            return this;
        },

        hasChild(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            return el.hasChildNodes();
        },

        addControlStyles(els, css) {
            if (!css) {
                return;
            }

            var el = null;
            for (var i = 0; i < els.length; i++) {
                el = els[i];

                if (el != null) {
                    if (this.hasClass(el, css) == false) {
                        this.addClass(el, css);
                    }
                }
            }

            return this;
        },

        removeControlStyles(els, css) {
            if (!css) {
                return;
            }

            var el = null;

            for (var i = 0; i < els.length; i++) {
                el = els[i];

                if (el != null) {
                    if (this.hasClass(el, css) == true) {
                        this.removeClass(el, css);
                    }
                }
            }

            return this;
        },

        removeNode(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el) {
                el.parentNode.removeChild(el);
            }
        },

        insertAfter(item, target) {
            var parent = target.parentNode;
            if (target.nextElementSibling) {
                parent.insertBefore(item, target.nextElementSibling);
            } else {
                parent.appendChild(item);
            }
        },

        hide(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el) {
                el.style.display = 'none';
            }
        },

        hideAll(array) {
            for (var i = 0; i < array.length; i++) {
                this.hide(array[i]);
            }
        },

        show(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el) {
                el.style.display = 'block';
            }
        },

        showAll(array) {
            for (var i = 0; i < array.length; i++) {
                this.show(array[i]);
            }
        },

        toggle(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (context.getComputedStyle(el).display === 'block') {
                this.hide(el);
                return;
            }

            this.show(el);
        },

        parent(el, id) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            var parent = el.parentElement;
            while (parent && parent.tagName != 'BODY') {
                if (parent.id == id) {
                    return parent;
                }

                parent = parent.parentElement;
            }

            return null;
        },

        //data : { tag, id, className, attributes : { key : value }, data : { key : value } }
        create(data) {
            var el = document.createElement(data.tag);
            if (data.id) {
                el.id = data.id;
            }

            if (data.className) {
                el.className = data.className;
            }

            if (data.style) {
                for (var prop in data.style) {
                    el.style[prop] = data.style[prop];
                }
            }

            if (data.attributes) {
                for (var prop in data.attributes) {
                    el.setAttribute(prop, data.attributes[prop]);
                }
            }

            if (data.data) {
                el.dataset = el.dataset ? result.dataset : {};
                for (var prop in data.data) {
                    el.dataset[prop] = data.data[prop];
                }
            }

            if (data.html) {
                el.innerHTML = data.html;
            }

            return el;
        },

        div(data) {
            if (!data) {
                data = new Object();
            }

            data.tag = 'div';
            return this.create(data);
        },

        label(data) {
            if (!data) {
                data = new Object();
            }

            data.tag = 'label';
            return this.create(data);
        },

        textField(data) {
            if (!data) {
                data = new Object();
            }

            data.tag = 'input';
            if (!data.attributes)
                data.attributes = new Object();

            data.attributes.type = 'text';

            return this.create(data);
        },

        checkbox(data) {
            if (!data) {
                data = new Object();
            }

            data.tag = 'input';
            if (!data.attributes)
                data.attributes = new Object();

            data.attributes.type = 'checkbox';

            return this.create(data);
        },

        each(array, handler) {
            for (var i = 0; i < array.length; i++) {
                handler(array[i], i);
            }
        },

        setActive(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            el.classList.add('active');
        },

        setUnactive(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            el.classList.remove('active');
        },

        select(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            el.selected = true;
            el.setAttribute('selected', 'selected');
        },

        deselect(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            el.selected = false;
            el.removeAttribute('selected');
        },

        check(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            el.checked = true;
        },

        uncheck(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            el.checked = false;
        },

        click(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            if (el.fireEvent) {
                el.fireEvent('onclick');
            } else {
                var evObj = document.createEvent('Events');
                evObj.initEvent('click', true, false);
                el.dispatchEvent(evObj);
            }
        },

        getClassRegEx(css) {
            return new RegExp('(^|\\s)' + css + '(\\s|$)');
        },
    });
    syn.$m = $manipulation;
})(globalRoot);
