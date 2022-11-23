﻿/// <reference path='syn.core.js' />
/// <reference path='syn.library.js' />

(function (context) {
    'use strict';
    var $keyboard = context.$keyboard || new syn.module();

    $keyboard.extend({
        version: '1.0',

        keyCodes: {
            'backspace': 8,
            'tab': 9,
            'enter': 13,
            'shift': 16,
            'control': 17,
            'alt': 18,
            'capslock': 20,
            'escape': 27,
            'space': 32,
            'pageup': 33,
            'pagedown': 34,
            'end': 35,
            'home': 36,
            'left': 37,
            'up': 38,
            'right': 39,
            'down': 40,
            'delete': 46,
            'semicolon': 186,
            'colon': 186,
            'equal': 187,
            'plus': 187,
            'comma': 188,
            'less': 188,
            'minus': 189,
            'underscore': 189,
            'period': 190,
            'greater': 190,
            'slash': 191,
            'questionmark': 191,
            'backtick': 192,
            'tilde': 192,
            'openingsquarebracket': 219,
            'openingcurlybracket': 219,
            'backslash': 220,
            'pipe': 220,
            'closingsquarebracket': 221,
            'closingcurlybracket': 221,
            'singlequote': 222,
            'doublequote': 222,
            'clear': 12,
            'meta': 91,
            'contextmenu': 93,
            'numpad0': 96,
            'numpad1': 97,
            'numpad2': 98,
            'numpad3': 99,
            'numpad4': 100,
            'numpad5': 101,
            'numpad6': 102,
            'numpad7': 103,
            'numpad8': 104,
            'numpad9': 105,
            'multiply': 106,
            'add': 107,
            'subtract': 109,
            'decimal': 110,
            'divide': 111,
            '0': 48,
            '1': 49,
            '2': 50,
            '3': 51,
            '4': 52,
            '5': 53,
            '6': 54,
            '7': 55,
            '8': 56,
            '9': 57,
            'a': 65,
            'b': 66,
            'c': 67,
            'd': 68,
            'e': 69,
            'f': 70,
            'g': 71,
            'h': 72,
            'i': 73,
            'j': 74,
            'k': 75,
            'l': 76,
            'm': 77,
            'n': 78,
            'o': 79,
            'p': 80,
            'q': 81,
            'r': 82,
            's': 83,
            't': 84,
            'u': 85,
            'v': 86,
            'w': 87,
            'x': 88,
            'y': 89,
            'z': 90,
            'f1': 112,
            'f2': 113,
            'f3': 114,
            'f4': 115,
            'f5': 116,
            'f6': 117,
            'f7': 118,
            'f8': 119,
            'f9': 120,
            'f10': 121,
            'f11': 122,
            'f12': 123
        },

        keyboardEL: null,

        setElement(el) {
            this.keyboardEL = context.keyboardEL = el;
            keyboardEL.keyObject = [];
            keyboardEL.keyObject['keydown'] = [];
            keyboardEL.keyObject['keyup'] = [];
            keyboardEL.keyObject['keypress'] = [];

            function handler(evt) {
                var eventType = evt.type;
                var keyCode = evt.keyCode;
                context.keyboardEvent = arguments[0];
                context.documentEvent = evt;

                if (keyboardEL.keyObject[eventType][keyCode] != null) {
                    var val = keyboardEL.keyObject[eventType][keyCode](evt);
                    if (val === false) {
                        evt.returnValue = false;
                        evt.cancel = true;
                        if (evt.preventDefault) {
                            evt.preventDefault();
                        }

                        if (evt.stopPropagation) {
                            evt.stopPropagation();
                        }
                        return false;
                    }
                }
            };

            syn.$l.addEvent(keyboardEL, 'keypress', handler);
            syn.$l.addEvent(keyboardEL, 'keydown', handler);
            syn.$l.addEvent(keyboardEL, 'keyup', handler);
            return this;
        },

        addKeyDown(keyCode, func) {
            keyboardEL.keyObject['keydown'][keyCode] = func;
            return this;
        },

        removeKeyDown(keyCode) {
            keyboardEL.keyObject['keydown'][keyCode] = null;
            return this;
        },

        addKeyUp(keyCode, func) {
            keyboardEL.keyObject['keyup'][keyCode] = func;
            return this;
        },

        removeKeyUp(keyCode) {
            keyboardEL.keyObject['keyup'][keyCode] = null;
            return this;
        },

        addKeyPress(keyCode, func) {
            keyboardEL.keyObject['keypress'][keyCode] = func;
            return this;
        },

        removeKeyPress(keyCode) {
            keyboardEL.keyObject['keypress'][keyCode] = null;
            return this;
        }
    });
    syn.$k = $keyboard;
})(globalRoot);
