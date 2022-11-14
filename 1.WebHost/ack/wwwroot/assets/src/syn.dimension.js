/// <reference path='syn.core.js' />
/// <reference path='syn.library.js' />

(function (context) {
    'use strict';
    var $dimension = $dimension || new syn.module();
    var document = context.document;

    $dimension.extend({
        version: '1.0',

        getDocumentSize(el) {
            el = ($ref.isString(el) == true ? syn.$l.get(el) : el) || context;
            var result =
            {
                width: el.scrollMaxX ? el.innerWidth + el.scrollMaxX : document.documentElement.scrollWidth || document.body.scrollWidth || 0,
                height: el.scrollMaxY ? el.innerHeight + el.scrollMaxY : document.documentElement.scrollHeight || document.body.scrollHeight || 0,
                fullWidth: Math.max(
                    document.body.scrollWidth, document.documentElement.scrollWidth,
                    document.body.offsetWidth, document.documentElement.offsetWidth,
                    document.body.clientWidth, document.documentElement.clientWidth
                ),
                fullHeight: Math.max(
                    document.body.scrollHeight, document.documentElement.scrollHeight,
                    document.body.offsetHeight, document.documentElement.offsetHeight,
                    document.body.clientHeight, document.documentElement.clientHeight
                )
            }

            return result;
        },

        getWindowSize(el) {
            el = ($ref.isString(el) == true ? syn.$l.get(el) : el) || context;
            var result =
            {
                width: el.innerWidth ? el.innerWidth : document.documentElement.clientWidth || document.body.clientWidth || 0,
                height: el.innerHeight ? el.innerHeight : document.documentElement.clientHeight || document.body.clientHeight || 0
            };

            return result;
        },


        getScrollPosition(el) {
            el = ($ref.isString(el) == true ? syn.$l.get(el) : el) || context;

            var result =
            {
                left: el.pageXOffset || el.scrollLeft || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
                top: el.pageYOffset || el.scrollTop || document.documentElement.scrollTop || document.body.scrollTop || 0
            };

            return result;
        },

        getMousePosition(e) {
            e = e || context.event || top.context.event;
            var scroll = syn.$d.getScrollSize();
            var result =
            {
                x: e.pageX || e.clientX + scroll.x || 0,
                y: e.pageY || e.clientY + scroll.y || 0,
                relativeX: e.layerX || e.offsetX || 0,
                relativeY: e.layerY || e.offsetY || 0
            };

            return result;
        },

        offset(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            var rect = el.getBoundingClientRect();
            var scrollLeft = context.pageXOffset || document.documentElement.scrollLeft;
            var scrollTop = context.pageYOffset || document.documentElement.scrollTop;
            return {
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft
            }
        },

        offsetLeft(el) {
            var result = 0;
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            while (typeof el !== 'undefined' && el && el.parentNode !== context) {
                if (el.offsetLeft) {
                    result += el.offsetLeft;
                }
                el = el.parentNode;
            }

            return result;
        },

        parentOffsetLeft(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            el = el || top.document.documentElement || top.document.body;
            return el.parentNode === el.offsetParent ? el.offsetLeft : (syn.$d.offsetLeft(el) - syn.$d.offsetLeft(el.parentNode));
        },

        offsetTop(el) {
            var result = 0;

            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            while (typeof el !== 'undefined' && el && el.parentNode !== context) {
                if (el.offsetTop) {
                    result += el.offsetTop;
                }
                el = el.parentNode;
            }

            return result;
        },

        parentOffsetTop(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            el = el || top.document.documentElement || top.document.body;
            return el.parentNode === el.offsetParent ? el.offsetTop : (syn.$d.offsetTop(el) - syn.$d.offsetTop(el.parentNode));
        },

        getBounds(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            var top = syn.$d.offsetTop(el);
            var left = syn.$d.offsetLeft(el);
            var bottom = top + el.offsetHeight;
            var right = left + el.offsetWidth;

            var result =
            {
                top: top,
                left: top,
                parentTop: syn.$d.parentOffsetTop(el),
                parentLeft: syn.$d.parentOffsetLeft(el),
                bottom: bottom,
                right: right,
                center:
                {
                    x: left + (right - left) / 2,
                    y: top + (bottom - top) / 2
                }
            };

            return result;
        },

        getCenter(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            var top = syn.$d.offsetTop(el);
            var left = syn.$d.offsetLeft(el);
            var bottom = top + el.offsetHeight;
            var right = left + el.offsetWidth;

            var result =
            {
                x: left + (right - left) / 2,
                y: top + (bottom - top) / 2
            };

            return result;
        },

        getPosition(el, center) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            var result =
            {
                top: syn.$d.offsetTop(el),
                left: syn.$d.offsetLeft(el)
            };

            var pl = el.offsetParent;

            while (pl) {
                result.left += syn.$d.offsetLeft(pl);
                result.top += syn.$d.offsetTop(pl);
                pl = pl.offsetParent;
            }

            if (center) {
                result.left += el.offsetWidth / 2;
                result.top += el.offsetHeight / 2;
            }

            return result;
        },

        getSize(el) {
            el = $ref.isString(el) == true ? syn.$l.get(el) : el;
            var styles = context.getComputedStyle(el);
            var result =
            {
                width: el.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight),
                height: el.clientHeight - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom),
                clientWidth: el.clientWidth,
                clientHeight: el.clientHeight,
                offsetWidth: el.offsetWidth,
                offsetHeight: el.offsetHeight,
                marginWidth: el.offsetWidth + parseFloat(styles.marginLeft) + parseFloat(styles.marginRight),
                marginHeight: el.offsetHeight + parseFloat(styles.marginTop) + parseFloat(styles.marginBottom),
            };

            return result;
        },

        measureWidth(text, fontSize) {
            var el = document.createElement('div');

            el.style.position = 'absolute';
            el.style.visibility = 'hidden';
            el.style.whiteSpace = 'nowrap';
            el.style.left = '-9999px';

            if (fontSize) {
                el.style.fontSize = fontSize;
            }
            el.innerText = text;

            document.body.appendChild(el);
            var width = context.getComputedStyle(el).width;
            document.body.removeChild(el);
            return width;
        },

        measureHeight(text, width, fontSize) {
            var el = document.createElement('div');

            el.style.position = 'absolute';
            el.style.visibility = 'hidden';
            el.style.width = width;
            el.style.left = '-9999px';

            if (fontSize) {
                el.style.fontSize = fontSize;
            }
            el.innerText = text;

            document.body.appendChild(el);
            var height = context.getComputedStyle(el).height;
            document.body.removeChild(el);
            return height;
        },

        measureSize(text, fontSize) {
            if ($object.isNullOrUndefined(text) == true) {
                return null;
            }

            var width = syn.$d.measureWidth(text, fontSize);
            return {
                width: width,
                height: syn.$d.measureHeight(text, width, fontSize)
            };
        }
    });
    syn.$d = $dimension;
})(globalRoot);
