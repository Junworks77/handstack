/*!
 * SmartMenus jQuery Plugin - v1.1.0 - September 17, 2017
 * http://www.smartmenus.org/
 *
 * Copyright Vasil Dinkov, Vadikom Web Ltd.
 * http://vadikom.com
 *
 * Licensed MIT
 */

(function(factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof module === 'object' && typeof module.exports === 'object') {
		// CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Global jQuery
		factory(jQuery);
	}
} (function($) {

	var menuTrees = [],
		mouse = false, // optimize for touch by default - we will detect for mouse input
		touchEvents = 'ontouchstart' in window, // we use this just to choose between toucn and pointer events, not for touch screen detection
		mouseDetectionEnabled = false,
		requestAnimationFrame = window.requestAnimationFrame || function (callback) { return setTimeout(callback, 1000 / 60); },
		cancelAnimationFrame = window.cancelAnimationFrame || function (id) { clearTimeout(id); },
		canAnimate = null;//!!$.fn.animate;

	// Handle detection for mouse input (i.e. desktop browsers, tablets with a mouse, etc.)
	function initMouseDetection(disable) {
		var eNS = '.smartmenus_mouse';
		if (!mouseDetectionEnabled && !disable) {
			// if we get two consecutive mousemoves within 2 pixels from each other and within 300ms, we assume a real mouse/cursor is present
			// in practice, this seems like impossible to trick unintentianally with a real mouse and a pretty safe detection on touch devices (even with older browsers that do not support touch events)
			var firstTime = true,
				lastMove = null,
				events = {
					'mousemove': function(e) {
						var thisMove = { x: e.pageX, y: e.pageY, timeStamp: new Date().getTime() };
						if (lastMove) {
							var deltaX = Math.abs(lastMove.x - thisMove.x),
								deltaY = Math.abs(lastMove.y - thisMove.y);
		 					if ((deltaX > 0 || deltaY > 0) && deltaX <= 2 && deltaY <= 2 && thisMove.timeStamp - lastMove.timeStamp <= 300) {
								mouse = true;
								// if this is the first check after page load, check if we are not over some item by chance and call the mouseenter handler if yes
								if (firstTime) {
									var $a = $(e.target).closest('a');
									if ($a.is('a')) {
										$.each(menuTrees, function() {
											if ($.contains(this.$root[0], $a[0])) {
												this.itemEnter({ currentTarget: $a[0] });
												return false;
											}
										});
									}
									firstTime = false;
								}
							}
						}
						lastMove = thisMove;
					}
				};
			events[touchEvents ? 'touchstart' : 'pointerover pointermove pointerout MSPointerOver MSPointerMove MSPointerOut'] = function(e) {
				if (isTouchEvent(e.originalEvent)) {
					mouse = false;
				}
			};
			$(document).on(getEventsNS(events, eNS));
			mouseDetectionEnabled = true;
		} else if (mouseDetectionEnabled && disable) {
			$(document).off(eNS);
			mouseDetectionEnabled = false;
		}
	}

	function isTouchEvent(e) {
		return !/^(4|mouse)$/.test(e.pointerType);
	}

	// returns a jQuery on() ready object
	function getEventsNS(events, eNS) {
		if (!eNS) {
			eNS = '';
		}
		var eventsNS = {};
		for (var i in events) {
			eventsNS[i.split(' ').join(eNS + ' ') + eNS] = events[i];
		}
		return eventsNS;
	}

	$.SmartMenus = function(elm, options) {
		this.$root = $(elm);
		this.opts = options;
		this.rootId = ''; // internal
		this.accessIdPrefix = '';
		this.$subArrow = null;
		this.activatedItems = []; // stores last activated A's for each level
		this.visibleSubMenus = []; // stores visible sub menus UL's (might be in no particular order)
		this.showTimeout = 0;
		this.hideTimeout = 0;
		this.scrollTimeout = 0;
		this.clickActivated = false;
		this.focusActivated = false;
		this.zIndexInc = 0;
		this.idInc = 0;
		this.$firstLink = null; // we'll use these for some tests
		this.$firstSub = null; // at runtime so we'll cache them
		this.disabled = false;
		this.$disableOverlay = null;
		this.$touchScrollingSub = null;
		this.cssTransforms3d = 'perspective' in elm.style || 'webkitPerspective' in elm.style;
		this.wasCollapsible = false;
		this.init();
	};

	$.extend($.SmartMenus, {
		hideAll: function() {
			$.each(menuTrees, function() {
				this.menuHideAll();
			});
		},
		destroy: function() {
			while (menuTrees.length) {
				menuTrees[0].destroy();
			}
			initMouseDetection(true);
		},
		prototype: {
			init: function(refresh) {
				var self = this;

				if (!refresh) {
					menuTrees.push(this);

					this.rootId = (new Date().getTime() + Math.random() + '').replace(/\D/g, '');
					this.accessIdPrefix = 'sm-' + this.rootId + '-';

					if (this.$root.hasClass('sm-rtl')) {
						this.opts.rightToLeftSubMenus = true;
					}

					// init root (main menu)
					var eNS = '.smartmenus';
					this.$root
						.data('smartmenus', this)
						.attr('data-smartmenus-id', this.rootId)
						.dataSM('level', 1)
						.on(getEventsNS({
							'mouseover focusin': $.proxy(this.rootOver, this),
							'mouseout focusout': $.proxy(this.rootOut, this),
							'keydown': $.proxy(this.rootKeyDown, this)
						}, eNS))
						.on(getEventsNS({
							'mouseenter': $.proxy(this.itemEnter, this),
							'mouseleave': $.proxy(this.itemLeave, this),
							'mousedown': $.proxy(this.itemDown, this),
							'focus': $.proxy(this.itemFocus, this),
							'blur': $.proxy(this.itemBlur, this),
							'click': $.proxy(this.itemClick, this)
						}, eNS), 'a');

					// hide menus on tap or click outside the root UL
					eNS += this.rootId;
					if (this.opts.hideOnClick) {
						$(document).on(getEventsNS({
							'touchstart': $.proxy(this.docTouchStart, this),
							'touchmove': $.proxy(this.docTouchMove, this),
							'touchend': $.proxy(this.docTouchEnd, this),
							// for Opera Mobile < 11.5, webOS browser, etc. we'll check click too
							'click': $.proxy(this.docClick, this)
						}, eNS));
					}
					// hide sub menus on resize
					$(window).on(getEventsNS({ 'resize orientationchange': $.proxy(this.winResize, this) }, eNS));

					if (this.opts.subIndicators) {
						this.$subArrow = $('<span/>').addClass('sub-arrow');
						if (this.opts.subIndicatorsText) {
							this.$subArrow.html(this.opts.subIndicatorsText);
						}
					}

					// make sure mouse detection is enabled
					initMouseDetection();
				}

				// init sub menus
				this.$firstSub = this.$root.find('ul').each(function() { self.menuInit($(this)); }).eq(0);

				this.$firstLink = this.$root.find('a').eq(0);

				// find current item
				if (this.opts.markCurrentItem) {
					var reDefaultDoc = /(index|default)\.[^#\?\/]*/i,
						reHash = /#.*/,
						locHref = window.location.href.replace(reDefaultDoc, ''),
						locHrefNoHash = locHref.replace(reHash, '');
					this.$root.find('a').each(function() {
						var href = this.href.replace(reDefaultDoc, ''),
							$this = $(this);
						if (href == locHref || href == locHrefNoHash) {
							$this.addClass('current');
							if (self.opts.markCurrentTree) {
								$this.parentsUntil('[data-smartmenus-id]', 'ul').each(function() {
									$(this).dataSM('parent-a').addClass('current');
								});
							}
						}
					});
				}

				// save initial state
				this.wasCollapsible = this.isCollapsible();
			},
			destroy: function(refresh) {
				if (!refresh) {
					var eNS = '.smartmenus';
					this.$root
						.removeData('smartmenus')
						.removeAttr('data-smartmenus-id')
						.removeDataSM('level')
						.off(eNS);
					eNS += this.rootId;
					$(document).off(eNS);
					$(window).off(eNS);
					if (this.opts.subIndicators) {
						this.$subArrow = null;
					}
				}
				this.menuHideAll();
				var self = this;
				this.$root.find('ul').each(function() {
						var $this = $(this);
						if ($this.dataSM('scroll-arrows')) {
							$this.dataSM('scroll-arrows').remove();
						}
						if ($this.dataSM('shown-before')) {
							if (self.opts.subMenusMinWidth || self.opts.subMenusMaxWidth) {
								$this.css({ width: '', minWidth: '', maxWidth: '' }).removeClass('sm-nowrap');
							}
							if ($this.dataSM('scroll-arrows')) {
								$this.dataSM('scroll-arrows').remove();
							}
							$this.css({ zIndex: '', top: '', left: '', marginLeft: '', marginTop: '', display: '' });
						}
						if (($this.attr('id') || '').indexOf(self.accessIdPrefix) == 0) {
							$this.removeAttr('id');
						}
					})
					.removeDataSM('in-mega')
					.removeDataSM('shown-before')
					.removeDataSM('scroll-arrows')
					.removeDataSM('parent-a')
					.removeDataSM('level')
					.removeDataSM('beforefirstshowfired')
					.removeAttr('role')
					.removeAttr('aria-hidden')
					.removeAttr('aria-labelledby')
					.removeAttr('aria-expanded');
				this.$root.find('a.has-submenu').each(function() {
						var $this = $(this);
						if ($this.attr('id').indexOf(self.accessIdPrefix) == 0) {
							$this.removeAttr('id');
						}
					})
					.removeClass('has-submenu')
					.removeDataSM('sub')
					.removeAttr('aria-haspopup')
					.removeAttr('aria-controls')
					.removeAttr('aria-expanded')
					.closest('li').removeDataSM('sub');
				if (this.opts.subIndicators) {
					this.$root.find('span.sub-arrow').remove();
				}
				if (this.opts.markCurrentItem) {
					this.$root.find('a.current').removeClass('current');
				}
				if (!refresh) {
					this.$root = null;
					this.$firstLink = null;
					this.$firstSub = null;
					if (this.$disableOverlay) {
						this.$disableOverlay.remove();
						this.$disableOverlay = null;
					}
					menuTrees.splice($.inArray(this, menuTrees), 1);
				}
			},
			disable: function(noOverlay) {
				if (!this.disabled) {
					this.menuHideAll();
					// display overlay over the menu to prevent interaction
					if (!noOverlay && !this.opts.isPopup && this.$root.is(':visible')) {
						var pos = this.$root.offset();
						this.$disableOverlay = $('<div class="sm-jquery-disable-overlay"/>').css({
							position: 'absolute',
							top: pos.top,
							left: pos.left,
							width: this.$root.outerWidth(),
							height: this.$root.outerHeight(),
							zIndex: this.getStartZIndex(true),
							opacity: 0
						}).appendTo(document.body);
					}
					this.disabled = true;
				}
			},
			docClick: function(e) {
				if (this.$touchScrollingSub) {
					this.$touchScrollingSub = null;
					return;
				}
				// hide on any click outside the menu or on a menu link
				if (this.visibleSubMenus.length && !$.contains(this.$root[0], e.target) || $(e.target).closest('a').length) {
					this.menuHideAll();
				}
			},
			docTouchEnd: function(e) {
				if (!this.lastTouch) {
					return;
				}
				if (this.visibleSubMenus.length && (this.lastTouch.x2 === undefined || this.lastTouch.x1 == this.lastTouch.x2) && (this.lastTouch.y2 === undefined || this.lastTouch.y1 == this.lastTouch.y2) && (!this.lastTouch.target || !$.contains(this.$root[0], this.lastTouch.target))) {
					if (this.hideTimeout) {
						clearTimeout(this.hideTimeout);
						this.hideTimeout = 0;
					}
					// hide with a delay to prevent triggering accidental unwanted click on some page element
					var self = this;
					this.hideTimeout = setTimeout(function() { self.menuHideAll(); }, 350);
				}
				this.lastTouch = null;
			},
			docTouchMove: function(e) {
				if (!this.lastTouch) {
					return;
				}
				var touchPoint = e.originalEvent.touches[0];
				this.lastTouch.x2 = touchPoint.pageX;
				this.lastTouch.y2 = touchPoint.pageY;
			},
			docTouchStart: function(e) {
				var touchPoint = e.originalEvent.touches[0];
				this.lastTouch = { x1: touchPoint.pageX, y1: touchPoint.pageY, target: touchPoint.target };
			},
			enable: function() {
				if (this.disabled) {
					if (this.$disableOverlay) {
						this.$disableOverlay.remove();
						this.$disableOverlay = null;
					}
					this.disabled = false;
				}
			},
			getClosestMenu: function(elm) {
				var $closestMenu = $(elm).closest('ul');
				while ($closestMenu.dataSM('in-mega')) {
					$closestMenu = $closestMenu.parent().closest('ul');
				}
				return $closestMenu[0] || null;
			},
			getHeight: function($elm) {
				return this.getOffset($elm, true);
			},
			// returns precise width/height float values
			getOffset: function($elm, height) {
				var old;
				if ($elm.css('display') == 'none') {
					old = { position: $elm[0].style.position, visibility: $elm[0].style.visibility };
					$elm.css({ position: 'absolute', visibility: 'hidden' }).show();
				}
				var box = $elm[0].getBoundingClientRect && $elm[0].getBoundingClientRect(),
					val = box && (height ? box.height || box.bottom - box.top : box.width || box.right - box.left);
				if (!val && val !== 0) {
					val = height ? $elm[0].offsetHeight : $elm[0].offsetWidth;
				}
				if (old) {
					$elm.hide().css(old);
				}
				return val;
			},
			getStartZIndex: function(root) {
				var zIndex = parseInt(this[root ? '$root' : '$firstSub'].css('z-index'));
				if (!root && isNaN(zIndex)) {
					zIndex = parseInt(this.$root.css('z-index'));
				}
				return !isNaN(zIndex) ? zIndex : 1;
			},
			getTouchPoint: function(e) {
				return e.touches && e.touches[0] || e.changedTouches && e.changedTouches[0] || e;
			},
			getViewport: function(height) {
				var name = height ? 'Height' : 'Width',
					val = document.documentElement['client' + name],
					val2 = window['inner' + name];
				if (val2) {
					val = Math.min(val, val2);
				}
				return val;
			},
			getViewportHeight: function() {
				return this.getViewport(true);
			},
			getViewportWidth: function() {
				return this.getViewport();
			},
			getWidth: function($elm) {
				return this.getOffset($elm);
			},
			handleEvents: function() {
				return !this.disabled && this.isCSSOn();
			},
			handleItemEvents: function($a) {
				return this.handleEvents() && !this.isLinkInMegaMenu($a);
			},
			isCollapsible: function() {
				return this.$firstSub.css('position') == 'static';
			},
			isCSSOn: function() {
				return this.$firstLink.css('display') != 'inline';
			},
			isFixed: function() {
				var isFixed = this.$root.css('position') == 'fixed';
				if (!isFixed) {
					this.$root.parentsUntil('body').each(function() {
						if ($(this).css('position') == 'fixed') {
							isFixed = true;
							return false;
						}
					});
				}
				return isFixed;
			},
			isLinkInMegaMenu: function($a) {
				return $(this.getClosestMenu($a[0])).hasClass('mega-menu');
			},
			isTouchMode: function() {
				return !mouse || this.opts.noMouseOver || this.isCollapsible();
			},
			itemActivate: function($a, hideDeeperSubs) {
				var $ul = $a.closest('ul'),
					level = $ul.dataSM('level');
				// if for some reason the parent item is not activated (e.g. this is an API call to activate the item), activate all parent items first
				if (level > 1 && (!this.activatedItems[level - 2] || this.activatedItems[level - 2][0] != $ul.dataSM('parent-a')[0])) {
					var self = this;
					$($ul.parentsUntil('[data-smartmenus-id]', 'ul').get().reverse()).add($ul).each(function() {
						self.itemActivate($(this).dataSM('parent-a'));
					});
				}
				// hide any visible deeper level sub menus
				if (!this.isCollapsible() || hideDeeperSubs) {
					this.menuHideSubMenus(!this.activatedItems[level - 1] || this.activatedItems[level - 1][0] != $a[0] ? level - 1 : level);
				}
				// save new active item for this level
				this.activatedItems[level - 1] = $a;
				if (this.$root.triggerHandler('activate.smapi', $a[0]) === false) {
					return;
				}
				// show the sub menu if this item has one
				var $sub = $a.dataSM('sub');
				if ($sub && (this.isTouchMode() || (!this.opts.showOnClick || this.clickActivated))) {
					this.menuShow($sub);
				}
			},
			itemBlur: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				this.$root.triggerHandler('blur.smapi', $a[0]);
			},
			itemClick: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				if (this.$touchScrollingSub && this.$touchScrollingSub[0] == $a.closest('ul')[0]) {
					this.$touchScrollingSub = null;
					e.stopPropagation();
					return false;
				}
				if (this.$root.triggerHandler('click.smapi', $a[0]) === false) {
					return false;
				}
				var subArrowClicked = $(e.target).is('.sub-arrow'),
					$sub = $a.dataSM('sub'),
					firstLevelSub = $sub ? $sub.dataSM('level') == 2 : false,
					collapsible = this.isCollapsible(),
					behaviorToggle = /toggle$/.test(this.opts.collapsibleBehavior),
					behaviorLink = /link$/.test(this.opts.collapsibleBehavior),
					behaviorAccordion = /^accordion/.test(this.opts.collapsibleBehavior);
				// if the sub is hidden, try to show it
				if ($sub && !$sub.is(':visible')) {
					if (!behaviorLink || !collapsible || subArrowClicked) {
						if (this.opts.showOnClick && firstLevelSub) {
							this.clickActivated = true;
						}
						// try to activate the item and show the sub
						this.itemActivate($a, behaviorAccordion);
						// if "itemActivate" showed the sub, prevent the click so that the link is not loaded
						// if it couldn't show it, then the sub menus are disabled with an !important declaration (e.g. via mobile styles) so let the link get loaded
						if ($sub.is(':visible')) {
							this.focusActivated = true;
							return false;
						}
					}
				// if the sub is visible and we are in collapsible mode
				} else if (collapsible && (behaviorToggle || subArrowClicked)) {
					this.itemActivate($a, behaviorAccordion);
					this.menuHide($sub);
					if (behaviorToggle) {
						this.focusActivated = false;
					}
					return false;
				}
				if (this.opts.showOnClick && firstLevelSub || $a.hasClass('disabled') || this.$root.triggerHandler('select.smapi', $a[0]) === false) {
					return false;
				}
			},
			itemDown: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				$a.dataSM('mousedown', true);
			},
			itemEnter: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				if (!this.isTouchMode()) {
					if (this.showTimeout) {
						clearTimeout(this.showTimeout);
						this.showTimeout = 0;
					}
					var self = this;
					this.showTimeout = setTimeout(function() { self.itemActivate($a); }, this.opts.showOnClick && $a.closest('ul').dataSM('level') == 1 ? 1 : this.opts.showTimeout);
				}
				this.$root.triggerHandler('mouseenter.smapi', $a[0]);
			},
			itemFocus: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				// fix (the mousedown check): in some browsers a tap/click produces consecutive focus + click events so we don't need to activate the item on focus
				if (this.focusActivated && (!this.isTouchMode() || !$a.dataSM('mousedown')) && (!this.activatedItems.length || this.activatedItems[this.activatedItems.length - 1][0] != $a[0])) {
					this.itemActivate($a, true);
				}
				this.$root.triggerHandler('focus.smapi', $a[0]);
			},
			itemLeave: function(e) {
				var $a = $(e.currentTarget);
				if (!this.handleItemEvents($a)) {
					return;
				}
				if (!this.isTouchMode()) {
					$a[0].blur();
					if (this.showTimeout) {
						clearTimeout(this.showTimeout);
						this.showTimeout = 0;
					}
				}
				$a.removeDataSM('mousedown');
				this.$root.triggerHandler('mouseleave.smapi', $a[0]);
			},
			menuHide: function($sub) {
				if (this.$root.triggerHandler('beforehide.smapi', $sub[0]) === false) {
					return;
				}
				if (canAnimate) {
					$sub.stop(true, true);
				}
				if ($sub.css('display') != 'none') {
					var complete = function() {
						// unset z-index
						$sub.css('z-index', '');
					};
					// if sub is collapsible (mobile view)
					if (this.isCollapsible()) {
						if (canAnimate && this.opts.collapsibleHideFunction) {
							this.opts.collapsibleHideFunction.call(this, $sub, complete);
						} else {
							$sub.hide(this.opts.collapsibleHideDuration, complete);
						}
					} else {
						if (canAnimate && this.opts.hideFunction) {
							this.opts.hideFunction.call(this, $sub, complete);
						} else {
							$sub.hide(this.opts.hideDuration, complete);
						}
					}
					// deactivate scrolling if it is activated for this sub
					if ($sub.dataSM('scroll')) {
						this.menuScrollStop($sub);
						$sub.css({ 'touch-action': '', '-ms-touch-action': '', '-webkit-transform': '', transform: '' })
							.off('.smartmenus_scroll').removeDataSM('scroll').dataSM('scroll-arrows').hide();
					}
					// unhighlight parent item + accessibility
					$sub.dataSM('parent-a').removeClass('highlighted').attr('aria-expanded', 'false');
					$sub.attr({
						'aria-expanded': 'false',
						'aria-hidden': 'true'
					});
					var level = $sub.dataSM('level');
					this.activatedItems.splice(level - 1, 1);
					this.visibleSubMenus.splice($.inArray($sub, this.visibleSubMenus), 1);
					this.$root.triggerHandler('hide.smapi', $sub[0]);
				}
			},
			menuHideAll: function() {
				if (this.showTimeout) {
					clearTimeout(this.showTimeout);
					this.showTimeout = 0;
				}
				// hide all subs
				// if it's a popup, this.visibleSubMenus[0] is the root UL
				var level = this.opts.isPopup ? 1 : 0;
				for (var i = this.visibleSubMenus.length - 1; i >= level; i--) {
					this.menuHide(this.visibleSubMenus[i]);
				}
				// hide root if it's popup
				if (this.opts.isPopup) {
					if (canAnimate) {
						this.$root.stop(true, true);
					}
					if (this.$root.is(':visible')) {
						if (canAnimate && this.opts.hideFunction) {
							this.opts.hideFunction.call(this, this.$root);
						} else {
							this.$root.hide(this.opts.hideDuration);
						}
					}
				}
				this.activatedItems = [];
				this.visibleSubMenus = [];
				this.clickActivated = false;
				this.focusActivated = false;
				// reset z-index increment
				this.zIndexInc = 0;
				this.$root.triggerHandler('hideAll.smapi');
			},
			menuHideSubMenus: function(level) {
				for (var i = this.activatedItems.length - 1; i >= level; i--) {
					var $sub = this.activatedItems[i].dataSM('sub');
					if ($sub) {
						this.menuHide($sub);
					}
				}
			},
			menuInit: function($ul) {
				if (!$ul.dataSM('in-mega')) {
					// mark UL's in mega drop downs (if any) so we can neglect them
					if ($ul.hasClass('mega-menu')) {
						$ul.find('ul').dataSM('in-mega', true);
					}
					// get level (much faster than, for example, using parentsUntil)
					var level = 2,
						par = $ul[0];
					while ((par = par.parentNode.parentNode) != this.$root[0]) {
						level++;
					}
					// cache stuff for quick access
					var $a = $ul.prevAll('a').eq(-1);
					// if the link is nested (e.g. in a heading)
					if (!$a.length) {
						$a = $ul.prevAll().find('a').eq(-1);
					}

					// $a.addClass('has-submenu').dataSM('sub', $ul);
					$a.dataSM('sub', $ul);

					$ul.dataSM('parent-a', $a)
						.dataSM('level', level)
						.parent().dataSM('sub', $ul);
					// accessibility
					var aId = $a.attr('id') || this.accessIdPrefix + (++this.idInc),
						ulId = $ul.attr('id') || this.accessIdPrefix + (++this.idInc);
					$a.attr({
						id: aId,
						'aria-haspopup': 'true',
						'aria-controls': ulId,
						'aria-expanded': 'false'
					});
					$ul.attr({
						id: ulId,
						'role': 'group',
						'aria-hidden': 'true',
						'aria-labelledby': aId,
						'aria-expanded': 'false'
					});
					// add sub indicator to parent item
					if (this.opts.subIndicators) {
						$a[this.opts.subIndicatorsPos](this.$subArrow.clone());
					}
				}
			},
			menuPosition: function($sub) {
				var $a = $sub.dataSM('parent-a'),
					$li = $a.closest('li'),
					$ul = $li.parent(),
					level = $sub.dataSM('level'),
					subW = this.getWidth($sub),
					subH = this.getHeight($sub),
					itemOffset = $a.offset(),
					itemX = itemOffset.left,
					itemY = itemOffset.top,
					itemW = this.getWidth($a),
					itemH = this.getHeight($a),
					$win = $(window),
					winX = $win.scrollLeft(),
					winY = $win.scrollTop(),
					winW = this.getViewportWidth(),
					winH = this.getViewportHeight(),
					horizontalParent = $ul.parent().is('[data-sm-horizontal-sub]') || level == 2 && !$ul.hasClass('sm-vertical'),
					rightToLeft = this.opts.rightToLeftSubMenus && !$li.is('[data-sm-reverse]') || !this.opts.rightToLeftSubMenus && $li.is('[data-sm-reverse]'),
					subOffsetX = level == 2 ? this.opts.mainMenuSubOffsetX : this.opts.subMenusSubOffsetX,
					subOffsetY = level == 2 ? this.opts.mainMenuSubOffsetY : this.opts.subMenusSubOffsetY,
					x, y;
				if (horizontalParent) {
					x = rightToLeft ? itemW - subW - subOffsetX : subOffsetX;
					y = this.opts.bottomToTopSubMenus ? -subH - subOffsetY : itemH + subOffsetY;
				} else {
					x = rightToLeft ? subOffsetX - subW : itemW - subOffsetX;
					y = this.opts.bottomToTopSubMenus ? itemH - subOffsetY - subH : subOffsetY;
				}
				if (this.opts.keepInViewport) {
					var absX = itemX + x,
						absY = itemY + y;
					if (rightToLeft && absX < winX) {
						x = horizontalParent ? winX - absX + x : itemW - subOffsetX;
					} else if (!rightToLeft && absX + subW > winX + winW) {
						x = horizontalParent ? winX + winW - subW - absX + x : subOffsetX - subW;
					}
					if (!horizontalParent) {
						if (subH < winH && absY + subH > winY + winH) {
							y += winY + winH - subH - absY;
						} else if (subH >= winH || absY < winY) {
							y += winY - absY;
						}
					}
					// do we need scrolling?
					// 0.49 used for better precision when dealing with float values
					if (horizontalParent && (absY + subH > winY + winH + 0.49 || absY < winY) || !horizontalParent && subH > winH + 0.49) {
						var self = this;
						if (!$sub.dataSM('scroll-arrows')) {
							$sub.dataSM('scroll-arrows', $([$('<span class="scroll-up"><span class="scroll-up-arrow"></span></span>')[0], $('<span class="scroll-down"><span class="scroll-down-arrow"></span></span>')[0]])
								.on({
									mouseenter: function() {
										$sub.dataSM('scroll').up = $(this).hasClass('scroll-up');
										self.menuScroll($sub);
									},
									mouseleave: function(e) {
										self.menuScrollStop($sub);
										self.menuScrollOut($sub, e);
									},
									'mousewheel DOMMouseScroll': function(e) { e.preventDefault(); }
								})
								.insertAfter($sub)
							);
						}
						// bind scroll events and save scroll data for this sub
						var eNS = '.smartmenus_scroll';
						$sub.dataSM('scroll', {
								y: this.cssTransforms3d ? 0 : y - itemH,
								step: 1,
								// cache stuff for faster recalcs later
								itemH: itemH,
								subH: subH,
								arrowDownH: this.getHeight($sub.dataSM('scroll-arrows').eq(1))
							})
							.on(getEventsNS({
								'mouseover': function(e) { self.menuScrollOver($sub, e); },
								'mouseout': function(e) { self.menuScrollOut($sub, e); },
								'mousewheel DOMMouseScroll': function(e) { self.menuScrollMousewheel($sub, e); }
							}, eNS))
							.dataSM('scroll-arrows').css({ top: 'auto', left: '0', marginLeft: x + (parseInt($sub.css('border-left-width')) || 0), width: subW - (parseInt($sub.css('border-left-width')) || 0) - (parseInt($sub.css('border-right-width')) || 0), zIndex: $sub.css('z-index') })
								.eq(horizontalParent && this.opts.bottomToTopSubMenus ? 0 : 1).show();
						// when a menu tree is fixed positioned we allow scrolling via touch too
						// since there is no other way to access such long sub menus if no mouse is present
						if (this.isFixed()) {
							var events = {};
							events[touchEvents ? 'touchstart touchmove touchend' : 'pointerdown pointermove pointerup MSPointerDown MSPointerMove MSPointerUp'] = function(e) {
								self.menuScrollTouch($sub, e);
							};
							$sub.css({ 'touch-action': 'none', '-ms-touch-action': 'none' }).on(getEventsNS(events, eNS));
						}
					}
				}
				$sub.css({ top: 'auto', left: '0', marginLeft: x, marginTop: y - itemH });
			},
			menuScroll: function($sub, once, step) {
				var data = $sub.dataSM('scroll'),
					$arrows = $sub.dataSM('scroll-arrows'),
					end = data.up ? data.upEnd : data.downEnd,
					diff;
				if (!once && data.momentum) {
					data.momentum *= 0.92;
					diff = data.momentum;
					if (diff < 0.5) {
						this.menuScrollStop($sub);
						return;
					}
				} else {
					diff = step || (once || !this.opts.scrollAccelerate ? this.opts.scrollStep : Math.floor(data.step));
				}
				// hide any visible deeper level sub menus
				var level = $sub.dataSM('level');
				if (this.activatedItems[level - 1] && this.activatedItems[level - 1].dataSM('sub') && this.activatedItems[level - 1].dataSM('sub').is(':visible')) {
					this.menuHideSubMenus(level - 1);
				}
				data.y = data.up && end <= data.y || !data.up && end >= data.y ? data.y : (Math.abs(end - data.y) > diff ? data.y + (data.up ? diff : -diff) : end);
				$sub.css(this.cssTransforms3d ? { '-webkit-transform': 'translate3d(0, ' + data.y + 'px, 0)', transform: 'translate3d(0, ' + data.y + 'px, 0)' } : { marginTop: data.y });
				// show opposite arrow if appropriate
				if (mouse && (data.up && data.y > data.downEnd || !data.up && data.y < data.upEnd)) {
					$arrows.eq(data.up ? 1 : 0).show();
				}
				// if we've reached the end
				if (data.y == end) {
					if (mouse) {
						$arrows.eq(data.up ? 0 : 1).hide();
					}
					this.menuScrollStop($sub);
				} else if (!once) {
					if (this.opts.scrollAccelerate && data.step < this.opts.scrollStep) {
						data.step += 0.2;
					}
					var self = this;
					this.scrollTimeout = requestAnimationFrame(function() { self.menuScroll($sub); });
				}
			},
			menuScrollMousewheel: function($sub, e) {
				if (this.getClosestMenu(e.target) == $sub[0]) {
					e = e.originalEvent;
					var up = (e.wheelDelta || -e.detail) > 0;
					if ($sub.dataSM('scroll-arrows').eq(up ? 0 : 1).is(':visible')) {
						$sub.dataSM('scroll').up = up;
						this.menuScroll($sub, true);
					}
				}
				e.preventDefault();
			},
			menuScrollOut: function($sub, e) {
				if (mouse) {
					if (!/^scroll-(up|down)/.test((e.relatedTarget || '').className) && ($sub[0] != e.relatedTarget && !$.contains($sub[0], e.relatedTarget) || this.getClosestMenu(e.relatedTarget) != $sub[0])) {
						$sub.dataSM('scroll-arrows').css('visibility', 'hidden');
					}
				}
			},
			menuScrollOver: function($sub, e) {
				if (mouse) {
					if (!/^scroll-(up|down)/.test(e.target.className) && this.getClosestMenu(e.target) == $sub[0]) {
						this.menuScrollRefreshData($sub);
						var data = $sub.dataSM('scroll'),
							upEnd = $(window).scrollTop() - $sub.dataSM('parent-a').offset().top - data.itemH;
						$sub.dataSM('scroll-arrows').eq(0).css('margin-top', upEnd).end()
							.eq(1).css('margin-top', upEnd + this.getViewportHeight() - data.arrowDownH).end()
							.css('visibility', 'visible');
					}
				}
			},
			menuScrollRefreshData: function($sub) {
				var data = $sub.dataSM('scroll'),
					upEnd = $(window).scrollTop() - $sub.dataSM('parent-a').offset().top - data.itemH;
				if (this.cssTransforms3d) {
					upEnd = -(parseFloat($sub.css('margin-top')) - upEnd);
				}
				$.extend(data, {
					upEnd: upEnd,
					downEnd: upEnd + this.getViewportHeight() - data.subH
				});
			},
			menuScrollStop: function($sub) {
				if (this.scrollTimeout) {
					cancelAnimationFrame(this.scrollTimeout);
					this.scrollTimeout = 0;
					$sub.dataSM('scroll').step = 1;
					return true;
				}
			},
			menuScrollTouch: function($sub, e) {
				e = e.originalEvent;
				if (isTouchEvent(e)) {
					var touchPoint = this.getTouchPoint(e);
					// neglect event if we touched a visible deeper level sub menu
					if (this.getClosestMenu(touchPoint.target) == $sub[0]) {
						var data = $sub.dataSM('scroll');
						if (/(start|down)$/i.test(e.type)) {
							if (this.menuScrollStop($sub)) {
								// if we were scrolling, just stop and don't activate any link on the first touch
								e.preventDefault();
								this.$touchScrollingSub = $sub;
							} else {
								this.$touchScrollingSub = null;
							}
							// update scroll data since the user might have zoomed, etc.
							this.menuScrollRefreshData($sub);
							// extend it with the touch properties
							$.extend(data, {
								touchStartY: touchPoint.pageY,
								touchStartTime: e.timeStamp
							});
						} else if (/move$/i.test(e.type)) {
							var prevY = data.touchY !== undefined ? data.touchY : data.touchStartY;
							if (prevY !== undefined && prevY != touchPoint.pageY) {
								this.$touchScrollingSub = $sub;
								var up = prevY < touchPoint.pageY;
								// changed direction? reset...
								if (data.up !== undefined && data.up != up) {
									$.extend(data, {
										touchStartY: touchPoint.pageY,
										touchStartTime: e.timeStamp
									});
								}
								$.extend(data, {
									up: up,
									touchY: touchPoint.pageY
								});
								this.menuScroll($sub, true, Math.abs(touchPoint.pageY - prevY));
							}
							e.preventDefault();
						} else { // touchend/pointerup
							if (data.touchY !== undefined) {
								if (data.momentum = Math.pow(Math.abs(touchPoint.pageY - data.touchStartY) / (e.timeStamp - data.touchStartTime), 2) * 15) {
									this.menuScrollStop($sub);
									this.menuScroll($sub);
									e.preventDefault();
								}
								delete data.touchY;
							}
						}
					}
				}
			},
			menuShow: function($sub) {
				if (!$sub.dataSM('beforefirstshowfired')) {
					$sub.dataSM('beforefirstshowfired', true);
					if (this.$root.triggerHandler('beforefirstshow.smapi', $sub[0]) === false) {
						return;
					}
				}
				if (this.$root.triggerHandler('beforeshow.smapi', $sub[0]) === false) {
					return;
				}
				$sub.dataSM('shown-before', true);
				if (canAnimate) {
					$sub.stop(true, true);
				}
				if (!$sub.is(':visible')) {
					// highlight parent item
					var $a = $sub.dataSM('parent-a'),
						collapsible = this.isCollapsible();
					if (this.opts.keepHighlighted || collapsible) {
						$a.addClass('highlighted');
					}
					if (collapsible) {
						$sub.removeClass('sm-nowrap').css({ zIndex: '', width: 'auto', minWidth: '', maxWidth: '', top: '', left: '', marginLeft: '', marginTop: '' });
					} else {
						// set z-index
						$sub.css('z-index', this.zIndexInc = (this.zIndexInc || this.getStartZIndex()) + 1);
						// min/max-width fix - no way to rely purely on CSS as all UL's are nested
						if (this.opts.subMenusMinWidth || this.opts.subMenusMaxWidth) {
							$sub.css({ width: 'auto', minWidth: '', maxWidth: '' }).addClass('sm-nowrap');
							if (this.opts.subMenusMinWidth) {
							 	$sub.css('min-width', this.opts.subMenusMinWidth);
							}
							if (this.opts.subMenusMaxWidth) {
							 	var noMaxWidth = this.getWidth($sub);
							 	$sub.css('max-width', this.opts.subMenusMaxWidth);
								if (noMaxWidth > this.getWidth($sub)) {
									$sub.removeClass('sm-nowrap').css('width', this.opts.subMenusMaxWidth);
								}
							}
						}
						this.menuPosition($sub);
					}
					var complete = function() {
						// fix: "overflow: hidden;" is not reset on animation complete in jQuery < 1.9.0 in Chrome when global "box-sizing: border-box;" is used
						$sub.css('overflow', '');
					};
					// if sub is collapsible (mobile view)
					if (collapsible) {
						if (canAnimate && this.opts.collapsibleShowFunction) {
							this.opts.collapsibleShowFunction.call(this, $sub, complete);
						} else {
							$sub.show(this.opts.collapsibleShowDuration, complete);
						}
					} else {
						if (canAnimate && this.opts.showFunction) {
							this.opts.showFunction.call(this, $sub, complete);
						} else {
							$sub.show(this.opts.showDuration, complete);
						}
					}
					// accessibility
					$a.attr('aria-expanded', 'true');
					$sub.attr({
						'aria-expanded': 'true',
						'aria-hidden': 'false'
					});
					// store sub menu in visible array
					this.visibleSubMenus.push($sub);
					this.$root.triggerHandler('show.smapi', $sub[0]);
				}
			},
			popupHide: function(noHideTimeout) {
				if (this.hideTimeout) {
					clearTimeout(this.hideTimeout);
					this.hideTimeout = 0;
				}
				var self = this;
				this.hideTimeout = setTimeout(function() {
					self.menuHideAll();
				}, noHideTimeout ? 1 : this.opts.hideTimeout);
			},
			popupShow: function(left, top) {
				if (!this.opts.isPopup) {
					alert('SmartMenus jQuery Error:\n\nIf you want to show this menu via the "popupShow" method, set the isPopup:true option.');
					return;
				}
				if (this.hideTimeout) {
					clearTimeout(this.hideTimeout);
					this.hideTimeout = 0;
				}
				this.$root.dataSM('shown-before', true);
				if (canAnimate) {
					this.$root.stop(true, true);
				}
				if (!this.$root.is(':visible')) {
					this.$root.css({ left: left, top: top });
					// show menu
					var self = this,
						complete = function() {
							self.$root.css('overflow', '');
						};
					if (canAnimate && this.opts.showFunction) {
						this.opts.showFunction.call(this, this.$root, complete);
					} else {
						this.$root.show(this.opts.showDuration, complete);
					}
					this.visibleSubMenus[0] = this.$root;
				}
			},
			refresh: function() {
				this.destroy(true);
				this.init(true);
			},
			rootKeyDown: function(e) {
				if (!this.handleEvents()) {
					return;
				}
				switch (e.keyCode) {
					case 27: // reset on Esc
						var $activeTopItem = this.activatedItems[0];
						if ($activeTopItem) {
							this.menuHideAll();
							$activeTopItem[0].focus();
							var $sub = $activeTopItem.dataSM('sub');
							if ($sub) {
								this.menuHide($sub);
							}
						}
						break;
					case 32: // activate item's sub on Space
						var $target = $(e.target);
						if ($target.is('a') && this.handleItemEvents($target)) {
							var $sub = $target.dataSM('sub');
							if ($sub && !$sub.is(':visible')) {
								this.itemClick({ currentTarget: e.target });
								e.preventDefault();
							}
						}
						break;
				}
			},
			rootOut: function(e) {
				if (!this.handleEvents() || this.isTouchMode() || e.target == this.$root[0]) {
					return;
				}
				if (this.hideTimeout) {
					clearTimeout(this.hideTimeout);
					this.hideTimeout = 0;
				}
				if (!this.opts.showOnClick || !this.opts.hideOnClick) {
					var self = this;
					this.hideTimeout = setTimeout(function() { self.menuHideAll(); }, this.opts.hideTimeout);
				}
			},
			rootOver: function(e) {
				if (!this.handleEvents() || this.isTouchMode() || e.target == this.$root[0]) {
					return;
				}
				if (this.hideTimeout) {
					clearTimeout(this.hideTimeout);
					this.hideTimeout = 0;
				}
			},
			winResize: function(e) {
				if (!this.handleEvents()) {
					// we still need to resize the disable overlay if it's visible
					if (this.$disableOverlay) {
						var pos = this.$root.offset();
	 					this.$disableOverlay.css({
							top: pos.top,
							left: pos.left,
							width: this.$root.outerWidth(),
							height: this.$root.outerHeight()
						});
					}
					return;
				}
				// hide sub menus on resize - on mobile do it only on orientation change
				if (!('onorientationchange' in window) || e.type == 'orientationchange') {
					var collapsible = this.isCollapsible();
					// if it was collapsible before resize and still is, don't do it
					if (!(this.wasCollapsible && collapsible)) { 
						if (this.activatedItems.length) {
							this.activatedItems[this.activatedItems.length - 1][0].blur();
						}
						this.menuHideAll();
					}
					this.wasCollapsible = collapsible;
				}
			}
		}
	});

	$.fn.dataSM = function(key, val) {
		if (val) {
			return this.data(key + '_smartmenus', val);
		}
		return this.data(key + '_smartmenus');
	};

	$.fn.removeDataSM = function(key) {
		return this.removeData(key + '_smartmenus');
	};

	$.fn.smartmenus = function(options) {
		if (typeof options == 'string') {
			var args = arguments,
				method = options;
			Array.prototype.shift.call(args);
			return this.each(function() {
				var smartmenus = $(this).data('smartmenus');
				if (smartmenus && smartmenus[method]) {
					smartmenus[method].apply(smartmenus, args);
				}
			});
		}
		return this.each(function() {
			// [data-sm-options] attribute on the root UL
			var dataOpts = $(this).data('sm-options') || null;
			if (dataOpts) {
				try {
					dataOpts = eval('(' + dataOpts + ')');
				} catch(e) {
					dataOpts = null;
					alert('ERROR\n\nSmartMenus jQuery init:\nInvalid "data-sm-options" attribute value syntax.');
				};
			}
			new $.SmartMenus(this, $.extend({}, $.fn.smartmenus.defaults, options, dataOpts));
		});
	};

	// default settings
	$.fn.smartmenus.defaults = {
		isPopup:		false,		// is this a popup menu (can be shown via the popupShow/popupHide methods) or a permanent menu bar
		mainMenuSubOffsetX:	0,		// pixels offset from default position
		mainMenuSubOffsetY:	0,		// pixels offset from default position
		subMenusSubOffsetX:	0,		// pixels offset from default position
		subMenusSubOffsetY:	0,		// pixels offset from default position
		subMenusMinWidth:	'10em',		// min-width for the sub menus (any CSS unit) - if set, the fixed width set in CSS will be ignored
		subMenusMaxWidth:	'20em',		// max-width for the sub menus (any CSS unit) - if set, the fixed width set in CSS will be ignored
		subIndicators: 		true,		// create sub menu indicators - creates a SPAN and inserts it in the A
		subIndicatorsPos: 	'append',	// position of the SPAN relative to the menu item content ('append', 'prepend')
		subIndicatorsText:	'',		// [optionally] add text in the SPAN (e.g. '+') (you may want to check the CSS for the sub indicators too)
		scrollStep: 		30,		// pixels step when scrolling long sub menus that do not fit in the viewport height
		scrollAccelerate:	true,		// accelerate scrolling or use a fixed step
		showTimeout:		250,		// timeout before showing the sub menus
		hideTimeout:		500,		// timeout before hiding the sub menus
		showDuration:		0,		// duration for show animation - set to 0 for no animation - matters only if showFunction:null
		showFunction:		null,		// custom function to use when showing a sub menu (the default is the jQuery 'show')
							// don't forget to call complete() at the end of whatever you do
							// e.g.: function($ul, complete) { $ul.fadeIn(250, complete); }
		hideDuration:		0,		// duration for hide animation - set to 0 for no animation - matters only if hideFunction:null
		hideFunction:		function($ul, complete) { $ul.fadeOut(200, complete); },	// custom function to use when hiding a sub menu (the default is the jQuery 'hide')
							// don't forget to call complete() at the end of whatever you do
							// e.g.: function($ul, complete) { $ul.fadeOut(250, complete); }
		collapsibleShowDuration:0,		// duration for show animation for collapsible sub menus - matters only if collapsibleShowFunction:null
		collapsibleShowFunction:function($ul, complete) { $ul.slideDown(200, complete); },	// custom function to use when showing a collapsible sub menu
							// (i.e. when mobile styles are used to make the sub menus collapsible)
		collapsibleHideDuration:0,		// duration for hide animation for collapsible sub menus - matters only if collapsibleHideFunction:null
		collapsibleHideFunction:function($ul, complete) { $ul.slideUp(200, complete); },	// custom function to use when hiding a collapsible sub menu
							// (i.e. when mobile styles are used to make the sub menus collapsible)
		showOnClick:		false,		// show the first-level sub menus onclick instead of onmouseover (i.e. mimic desktop app menus) (matters only for mouse input)
		hideOnClick:		true,		// hide the sub menus on click/tap anywhere on the page
		noMouseOver:		false,		// disable sub menus activation onmouseover (i.e. behave like in touch mode - use just mouse clicks) (matters only for mouse input)
		keepInViewport:		true,		// reposition the sub menus if needed to make sure they always appear inside the viewport
		keepHighlighted:	true,		// keep all ancestor items of the current sub menu highlighted (adds the 'highlighted' class to the A's)
		markCurrentItem:	false,		// automatically add the 'current' class to the A element of the item linking to the current URL
		markCurrentTree:	true,		// add the 'current' class also to the A elements of all ancestor items of the current item
		rightToLeftSubMenus:	false,		// right to left display of the sub menus (check the CSS for the sub indicators' position)
		bottomToTopSubMenus:	false,		// bottom to top display of the sub menus
		collapsibleBehavior:	'default'	// parent items behavior in collapsible (mobile) view ('default', 'toggle', 'link', 'accordion', 'accordion-toggle', 'accordion-link')
							// 'default' - first tap on parent item expands sub, second tap loads its link
							// 'toggle' - the whole parent item acts just as a toggle button for its sub menu (expands/collapses on each tap)
							// 'link' - the parent item acts as a regular item (first tap loads its link), the sub menu can be expanded only via the +/- button
							// 'accordion' - like 'default' but on expand also resets any visible sub menus from deeper levels or other branches
							// 'accordion-toggle' - like 'toggle' but on expand also resets any visible sub menus from deeper levels or other branches
							// 'accordion-link' - like 'link' but on expand also resets any visible sub menus from deeper levels or other branches
	};

	return $;
}));
/*
    JavaScript autoComplete v1.0.4
    Copyright (c) 2014 Simon Steinberger / Pixabay
    GitHub: https://github.com/Pixabay/JavaScript-autoComplete
    License: http://www.opensource.org/licenses/mit-license.php
*/

var autoComplete = (function(){
    // "use strict";
    function autoComplete(options){
        if (!document.querySelector) return;

        // helpers
        function hasClass(el, className){ return el.classList ? el.classList.contains(className) : new RegExp('\\b'+ className+'\\b').test(el.className); }

        function addEvent(el, type, handler){
            if (el.attachEvent) el.attachEvent('on'+type, handler); else el.addEventListener(type, handler);
        }
        function removeEvent(el, type, handler){
            // if (el.removeEventListener) not working in IE11
            if (el.detachEvent) el.detachEvent('on'+type, handler); else el.removeEventListener(type, handler);
        }
        function live(elClass, event, cb, context){
            addEvent(context || document, event, function(e){
                var found, el = e.target || e.srcElement;
                while (el && !(found = hasClass(el, elClass))) el = el.parentElement;
                if (found) cb.call(el, e);
            });
        }

        var o = {
            selector: 0,
            source: 0,
            minChars: 3,
            delay: 150,
            offsetLeft: 0,
            offsetTop: 1,
            cache: 1,
            menuClass: '',
            renderItem: function (item, search){
                // escape special characters
                search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
                return '<div class="autocomplete-suggestion" data-val="' + item + '">' + item.replace(re, "<b>$1</b>") + '</div>';
            },
            onSelect: function(e, term, item){}
        };
        for (var k in options) { if (options.hasOwnProperty(k)) o[k] = options[k]; }

        // init
        var elems = typeof o.selector == 'object' ? [o.selector] : document.querySelectorAll(o.selector);
        for (var i=0; i<elems.length; i++) {
            var that = elems[i];

            // create suggestions container "sc"
            that.sc = document.createElement('div');
            that.sc.className = 'autocomplete-suggestions '+o.menuClass;

            that.autocompleteAttr = that.getAttribute('autocomplete');
            that.setAttribute('autocomplete', 'off');
            that.cache = {};
            that.last_val = '';

            that.updateSC = function(resize, next){
                var rect = that.getBoundingClientRect();
                that.sc.style.left = Math.round(rect.left + (window.pageXOffset || document.documentElement.scrollLeft) + o.offsetLeft) + 'px';
                that.sc.style.top = Math.round(rect.bottom + (window.pageYOffset || document.documentElement.scrollTop) + o.offsetTop) + 'px';
                that.sc.style.width = Math.round(rect.right - rect.left) + 'px'; // outerWidth
                if (!resize) {
                    that.sc.style.display = 'block';
                    if (!that.sc.maxHeight) { that.sc.maxHeight = parseInt((window.getComputedStyle ? getComputedStyle(that.sc, null) : that.sc.currentStyle).maxHeight); }
                    if (!that.sc.suggestionHeight) that.sc.suggestionHeight = that.sc.querySelector('.autocomplete-suggestion').offsetHeight;
                    if (that.sc.suggestionHeight)
                        if (!next) that.sc.scrollTop = 0;
                        else {
                            var scrTop = that.sc.scrollTop, selTop = next.getBoundingClientRect().top - that.sc.getBoundingClientRect().top;
                            if (selTop + that.sc.suggestionHeight - that.sc.maxHeight > 0)
                                that.sc.scrollTop = selTop + that.sc.suggestionHeight + scrTop - that.sc.maxHeight;
                            else if (selTop < 0)
                                that.sc.scrollTop = selTop + scrTop;
                        }
                }
            }
            addEvent(window, 'resize', that.updateSC);
            document.body.appendChild(that.sc);

            live('autocomplete-suggestion', 'mouseleave', function(e){
                var sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) setTimeout(function(){ sel.className = sel.className.replace('selected', ''); }, 20);
            }, that.sc);

            live('autocomplete-suggestion', 'mouseover', function(e){
                var sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                if (sel) sel.className = sel.className.replace('selected', '');
                this.className += ' selected';
            }, that.sc);

            live('autocomplete-suggestion', 'mousedown', function(e){
                if (hasClass(this, 'autocomplete-suggestion')) { // else outside click
                    var v = this.getAttribute('data-val');
                    that.value = v;
                    o.onSelect(e, v, this);
                    that.sc.style.display = 'none';
                }
            }, that.sc);

            that.blurHandler = function(){
                try { var over_sb = document.querySelector('.autocomplete-suggestions:hover'); } catch(e){ var over_sb = 0; }
                if (!over_sb) {
                    that.last_val = that.value;
                    that.sc.style.display = 'none';
                    setTimeout(function(){ that.sc.style.display = 'none'; }, 350); // hide suggestions on fast input
                } else if (that !== document.activeElement) setTimeout(function(){ that.focus(); }, 20);
            };
            addEvent(that, 'blur', that.blurHandler);

            var suggest = function(data){
                var val = that.value;
                that.cache[val] = data;
                if (data.length && val.length >= o.minChars) {
                    var s = '';
                    for (var i=0;i<data.length;i++) s += o.renderItem(data[i], val);
                    that.sc.innerHTML = s;
                    that.updateSC(0);
                }
                else
                    that.sc.style.display = 'none';
            }

            that.keydownHandler = function(e){
                var key = window.event ? e.keyCode : e.which;
                // down (40), up (38)
                if ((key == 40 || key == 38) && that.sc.innerHTML) {
                    var next, sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                    if (!sel) {
                        next = (key == 40) ? that.sc.querySelector('.autocomplete-suggestion') : that.sc.childNodes[that.sc.childNodes.length - 1]; // first : last
                        next.className += ' selected';
                        that.value = next.getAttribute('data-val');
                    } else {
                        next = (key == 40) ? sel.nextSibling : sel.previousSibling;
                        if (next) {
                            sel.className = sel.className.replace('selected', '');
                            next.className += ' selected';
                            that.value = next.getAttribute('data-val');
                        }
                        else { sel.className = sel.className.replace('selected', ''); that.value = that.last_val; next = 0; }
                    }
                    that.updateSC(0, next);
                    return false;
                }
                // esc
                else if (key == 27) { that.value = that.last_val; that.sc.style.display = 'none'; }
                // backspace
                else if (key == 8) { return true; }
                // enter
                else if (key == 13 || key == 9) {
                    var sel = that.sc.querySelector('.autocomplete-suggestion.selected');
                    if (sel && that.sc.style.display != 'none') { o.onSelect(e, sel.getAttribute('data-val'), sel); setTimeout(function(){ that.sc.style.display = 'none'; }, 20); }
                }
            };
            addEvent(that, 'keydown', that.keydownHandler);

            that.keyupHandler = function(e){
                var key = window.event ? e.keyCode : e.which;
                if (!key || (key < 35 || key > 40) && key != 13 && key != 27) {
                    var val = that.value;
                    if (val.length >= o.minChars) {
                        if (val != that.last_val) {
                            that.last_val = val;
                            clearTimeout(that.timer);
                            if (o.cache) {
                                if (val in that.cache) { suggest(that.cache[val]); return; }
                                // no requests if previous suggestions were empty
                                for (var i=1; i<val.length-o.minChars; i++) {
                                    var part = val.slice(0, val.length-i);
                                    if (part in that.cache && !that.cache[part].length) { suggest([]); return; }
                                }
                            }
                            that.timer = setTimeout(function(){ o.source(val, suggest) }, o.delay);
                        }
                    } else {
                        that.last_val = val;
                        that.sc.style.display = 'none';
                    }
                }
            };
            addEvent(that, 'keyup', that.keyupHandler);

            that.focusHandler = function(e){
                that.last_val = '\n';
                that.keyupHandler(e)
            };
            if (!o.minChars) addEvent(that, 'focus', that.focusHandler);
        }

        // public destroy method
        this.destroy = function(){
            for (var i=0; i<elems.length; i++) {
                var that = elems[i];
                removeEvent(window, 'resize', that.updateSC);
                removeEvent(that, 'blur', that.blurHandler);
                removeEvent(that, 'focus', that.focusHandler);
                removeEvent(that, 'keydown', that.keydownHandler);
                removeEvent(that, 'keyup', that.keyupHandler);
                if (that.autocompleteAttr)
                    that.setAttribute('autocomplete', that.autocompleteAttr);
                else
                    that.removeAttribute('autocomplete');
                document.body.removeChild(that.sc);
                that = null;
            }
        };
    }
    return autoComplete;
})();

(function(){
    if (typeof define === 'function' && define.amd)
        define('autoComplete', function () { return autoComplete; });
    else if (typeof module !== 'undefined' && module.exports)
        module.exports = autoComplete;
    else
        window.autoComplete = autoComplete;
})();

function createTree(p_div, p_backColor, p_contextMenu) {
	var tree = {
		name: 'tree',
		div: p_div,
		ulElement: null,
		childNodes: [],
		backcolor: p_backColor,
		contextMenu: p_contextMenu,
		selectedNode: null,
		nodeCounter: 0,
		contextMenuDiv: null,
		rendered: false,
		createNode: function (p_text, p_expanded, p_icon, p_parentNode, p_tag, p_contextmenu) {
			v_tree = this;
			node = {
				id: 'node_' + this.nodeCounter,
				text: p_text,
				icon: p_icon,
				parent: p_parentNode,
				expanded: p_expanded,
				childNodes: [],
				tag: p_tag,
				contextMenu: p_contextmenu,
				elementLi: null,
				removeNode: function () { v_tree.removeNode(this); },
				toggleNode: function (p_event) { v_tree.toggleNode(this); },
				expandNode: function (p_event) { v_tree.expandNode(this); },
				expandSubtree: function () { v_tree.expandSubtree(this); },
				setText: function (p_text) { v_tree.setText(this, p_text); },
				collapseNode: function () { v_tree.collapseNode(this); },
				collapseSubtree: function () { v_tree.collapseSubtree(this); },
				removeChildNodes: function () { v_tree.removeChildNodes(this); },
				createChildNode: function (p_text, p_expanded, p_icon, p_tag, p_contextmenu) { return v_tree.createNode(p_text, p_expanded, p_icon, this, p_tag, p_contextmenu); }
			}

			this.nodeCounter++;

			if (this.rendered) {
				if (p_parentNode == undefined) {
					this.drawNode(this.ulElement, node);
					this.adjustLines(this.ulElement, false);
				}
				else {
					var v_ul = p_parentNode.elementLi.getElementsByTagName("ul")[0];
					if (p_parentNode.childNodes.length == 0) {
						if (p_parentNode.expanded) {
							p_parentNode.elementLi.getElementsByTagName("ul")[0].style.display = 'block';
						}
						else {
							p_parentNode.elementLi.getElementsByTagName("ul")[0].style.display = 'none';
						}
					}
					this.drawNode(v_ul, node);
					this.adjustLines(v_ul, false);
				}
			}

			if (p_parentNode == undefined) {
				this.childNodes.push(node);
				node.parent = this;
			}
			else
				p_parentNode.childNodes.push(node);

			return node;
		},

		drawTree: function () {
			this.rendered = true;
			var div_tree = document.getElementById(this.div);
			div_tree.innerHTML = '';

			ulElement = createSimpleElement('ul', this.name, 'lnbArea');
			this.ulElement = ulElement;

			for (var i = 0; i < this.childNodes.length; i++) {
				this.drawNode(ulElement, this.childNodes[i]);
			}

			div_tree.appendChild(ulElement);

			this.adjustLines(document.getElementById(this.name), true);
		},

		drawNode: function (p_ulElement, p_node) {
			v_tree = this;
			var v_icon = null;
			if (p_node.icon != null) {
				v_icon = createImgElement(null, 'icon_tree', p_node.icon);
			}

			var v_li = document.createElement('li');
			p_node.elementLi = v_li;

			var v_span = null;

			if (p_ulElement.id == 'tree') {
				v_span = createSimpleElement('a', null, 'lnb-' + p_node.tag.PROGRAMNAME);
			}
			else {
				v_span = createSimpleElement('a', null);
			}

			v_li.onclick = () => {
				if (p_node.parent.name == 'tree') {
					if (arguments[0].target.tagName.toLowerCase() == 'li') {
						v_tree.doubleClickNode(p_node);

						if (p_node.expanded == true) {
							$m.addClass(p_node.elementLi, 'active');
						}
						else {
							$m.removeClass(p_node.elementLi, 'active');
						}
					}
					else if (arguments[0].target.tagName.toLowerCase() == 'a') {
						var elLI = arguments[0].target.parentElement;

						if (p_node.expanded == true) {
							$m.addClass(elLI, 'active');
						}
						else {
							$m.removeClass(elLI, 'active');
						}
					}
				}
			};

			// v_span.ondblclick = () => {
			// 	v_tree.doubleClickNode(p_node);
			// };

			v_span.onclick = () => {
				v_tree.selectNode(p_node);

				if (p_node.parent.name == 'tree') {
					v_tree.doubleClickNode(p_node);
				}

				if (p_node.childNodes.length == 0) {
					if (v_tree.nodeSelectEvent != undefined) {
						v_tree.nodeSelectEvent(p_node);
					}
				}
			};

			// v_a = createSimpleElement('a', null, null);
			// v_a.innerHTML = p_node.text;
			// v_span.appendChild(v_a);
			v_span.textContent = p_node.text;
			v_li.appendChild(v_span);

			p_ulElement.appendChild(v_li);

			var v_ul = createSimpleElement('ul', 'ul_' + p_node.id, 'subMenuList');
			v_li.appendChild(v_ul);

			if (p_node.childNodes.length > 0) {

				if (!p_node.expanded) {
					v_ul.style.display = 'none';
				}

				for (var i = 0; i < p_node.childNodes.length; i++) {
					this.drawNode(v_ul, p_node.childNodes[i]);
				}
			}
		},

		setText: function (p_node, p_text) {
			p_node.elementLi.getElementsByTagName('a')[0].lastChild.innerHTML = p_text;
			p_node.text = p_text;
		},

		expandTree: function () {
			for (var i = 0; i < this.childNodes.length; i++) {
				if (this.childNodes[i].childNodes.length > 0) {
					this.expandSubtree(this.childNodes[i]);
				}
			}
		},

		expandSubtree: function (p_node) {
			this.expandNode(p_node);
			for (var i = 0; i < p_node.childNodes.length; i++) {
				if (p_node.childNodes[i].childNodes.length > 0) {
					this.expandSubtree(p_node.childNodes[i]);
				}
			}
		},

		collapseTree: function () {
			for (var i = 0; i < this.childNodes.length; i++) {
				if (this.childNodes[i].childNodes.length > 0) {
					this.collapseSubtree(this.childNodes[i]);
				}
			}
		},

		collapseSubtree: function (p_node) {
			this.collapseNode(p_node);
			for (var i = 0; i < p_node.childNodes.length; i++) {
				if (p_node.childNodes[i].childNodes.length > 0) {
					this.collapseSubtree(p_node.childNodes[i]);
				}
			}
		},

		expandNode: function (p_node) {
			if (p_node.childNodes.length > 0 && p_node.expanded == false) {
				if (this.nodeBeforeOpenEvent != undefined) {
					this.nodeBeforeOpenEvent(p_node);
				}

				p_node.expanded = true;

				elem_ul = p_node.elementLi.getElementsByTagName('a')[0].parentElement.getElementsByTagName('ul')[0];
				elem_ul.style.display = 'block';

				if (this.nodeAfterOpenEvent != undefined) {
					this.nodeAfterOpenEvent(p_node);
				}
			}
		},

		collapseNode: function (p_node) {
			if (p_node.childNodes.length > 0 && p_node.expanded == true) {
				p_node.expanded = false;
				if (this.nodeBeforeCloseEvent != undefined) {
					this.nodeBeforeCloseEvent(p_node);
				}
				elem_ul = p_node.elementLi.getElementsByTagName('a')[0].parentElement.getElementsByTagName('ul')[0];
				elem_ul.style.display = 'none';
			}
		},

		toggleNode: function (p_node) {
			if (p_node.childNodes.length > 0) {
				if (p_node.expanded) {
					p_node.collapseNode();
				}
				else {
					p_node.expandNode();
				}
			}
		},

		doubleClickNode: function (p_node) {
			this.toggleNode(p_node);

			if (p_node.childNodes.length == 0) {
				if (this.nodeSelectEvent != undefined) {
					this.nodeSelectEvent(p_node);
				}
			}
		},

		selectNode: function (p_node) {
			var nodes = syn.$l.querySelectorAll('ul.subMenuList > li');
			var length = nodes.length;
			for (var i = 0; i < length; i++) {
				var node = nodes[i];
				$m.removeClass(node, 'active');
			}
			$m.addClass(p_node.elementLi, 'active');
			this.selectedNode = p_node;
		},

		removeNode: function (p_node) {
			var index = p_node.parent.childNodes.indexOf(p_node);

			if (p_node.elementLi.className == "last" && index != 0) {
				p_node.parent.childNodes[index - 1].elementLi.className += "last";
				p_node.parent.childNodes[index - 1].elementLi.style.backgroundColor = this.backcolor;
			}

			p_node.elementLi.parentNode.removeChild(p_node.elementLi);
			p_node.parent.childNodes.splice(index, 1);
		},

		removeChildNodes: function (p_node) {
			if (p_node.childNodes.length > 0) {
				var v_ul = p_node.elementLi.getElementsByTagName("ul")[0];
				v_ul.innerHTML = "";
				p_node.childNodes = [];
			}
		},

		adjustLines: function (p_ul, p_recursive) {
			var tree = p_ul;
			var lists = [];
			if (tree.childNodes.length > 0) {
				lists = [tree];

				if (p_recursive) {
					for (var i = 0; i < tree.getElementsByTagName("ul").length; i++) {
						var check_ul = tree.getElementsByTagName("ul")[i];
						if (check_ul.childNodes.length != 0) {
							lists[lists.length] = check_ul;
						}
					}
				}
			}

			for (var i = 0; i < lists.length; i++) {
				var item = lists[i].lastChild;

				while (!item.tagName || item.tagName.toLowerCase() != "li") {
					item = item.previousSibling;
				}

				item.className += "last";
				item.style.backgroundColor = this.backcolor;

				item = item.previousSibling;

				if (item != null) {
					if (item.tagName.toLowerCase() == "li") {
						item.className = "";
						item.style.backgroundColor = 'transparent';
					}
				}
			}
		}
	}

	return tree;
}

function createSimpleElement(p_type, p_id, p_class) {
	var element = document.createElement(p_type);
	if (p_id != undefined) {
		element.id = p_id;
	}

	if (p_class != undefined) {
		element.className = p_class;
	}

	return element;
}

function createImgElement(p_id, p_class, p_src) {
	element = document.createElement('img');
	if (p_id != undefined) {
		element.id = p_id;
	}

	if (p_class != undefined) {
		element.className = p_class;
	}

	if (p_src != undefined) {
		element.src = p_src;
	}

	return element;
}

(function (window) {
	var $layout = window.$layout || new syn.module();

	$layout.extend({
		localeID: 'ko-KR',
		buttonAction: false,
		isUILog: false,
		recentMenus: [],

		firstGnbLi: null,
		autocomplete_nodes: [],
		gnb_nodes: [],
		treeView: null,
		treeViews: [],
		menus: [],
		treemenus: [],

		gnbCurrentPageIndex: 0,
		gnbCurrentIndex: 0,
		gnbItemCount: 0,
		gnbPageCount: 0,
		gnbTotalPages: 0,

		tabUICurrentPageIndex: 0,
		tabUICurrentIndex: 0,
		tabUIItemCount: 0,
		tabUIPageCount: 0,
		tabUITotalPages: 0,

		limitTabCount: 100,

		popupOptions: {
			isHidden: true,
			src: '',
			titletext: null,
			top: 50,
			left: 50,
			width: 640,
			height: 480
		},

		windowOpen: function (eid, options) {
			$.fn.WM_minimize = $layout.windowHide;
			$.fn.WM_maximize = $layout.windowClose;

			if (syn.$l.get(eid)) {
				$w.alert(eid + ' Identifier already exists.');
				return;
			}

			var windows = $.WM_open(eid, options.src, undefined, options);

			if (options.titletext) {
				windows.find('.titlebartext').text(options.titletext);
			}

			try {
				return windows;
			}
			finally {
				windows = null;
			}
		},

		windowShow: function (eid) {
			var windows = syn.$l.get(eid);

			if (windows) {
				var frame = $(windows).find('iframe')[0];
				var pageWindow = frame.contentWindow;
				var pageScript = pageWindow[pageWindow['$w'].pageScript];
				if (pageScript && pageScript['dataLoad']) {
					pageScript.dataLoad();
				}

				$m.setStyle(windows, 'display', 'block');
				frame = null;
				dataLoad = null;
			}

			$('#' + eid).WM_raise();
			windows = null;
		},

		windowHide: function (eid) {
			if (eid) {
				if (syn.$l.get(eid)) {
					$m.setStyle(syn.$l.get(eid), 'display', 'none');
				}
			}
			else {
				if (this.filter('.window').length > 0) {
					$m.setStyle(this.filter('.window')[0], 'display', 'none');
				}
			}
		},

		windowClose: function (eid) {
			if (eid) {
				if (syn.$l.get(eid)) {
					$('#' + eid).WM_close();
				}
			}
			else {
				if (this.filter('.window').length > 0) {
					this.filter('.window').WM_close();
				}
			}
		},

		windowCallback: function (eid, result) {
			var tabInfo = $layout.getActiveTab();
			var pageScript = null;

			if (tabInfo) {
				var pageWindow = $layout.getActiveTabContent(tabInfo.tabID);
				if (pageWindow) {
					$w.setStorage(tabInfo.menuID + '~' + eid, result);

					var pageScript = pageWindow[pageWindow['$w'].pageScript];
					$layout.layout_UIStoregeChanging(pageScript, tabInfo.tabID, eid);
				}
			}
		},

		getWindowHeight: function () {
			var result = 600;
			if (document.body && document.body.offsetHeight) {
				result = document.body.offsetHeight;
			}
			if (document.compatMode == 'CSS1Compat' && document.documentElement && document.documentElement.offsetHeight) {
				result = document.documentElement.offsetHeight;
			}
			if (window.innerHeight) {
				result = window.innerHeight;
			}

			return result;
		},

		getWindowWidth: function () {
			var result = 1024;
			if (document.body && document.body.offsetWidth) {
				result = document.body.offsetWidth;
			}
			if (document.compatMode == 'CSS1Compat' && document.documentElement && document.documentElement.offsetWidth) {
				result = document.documentElement.offsetWidth;
			}
			if (window.innerWidth) {
				result = window.innerWidth;
			}

			return result;
		},

		setActiveTabHeight: function (tabID, val) {
			var currentTab = syn.$l.get(tabID + '$i');

			if (currentTab.offsetHeight < val) {
				currentTab.height = val + 18;
			}
		},

		setStatusMessage: function (tabID, val) {
			$l.querySelector('.statusSection .status').innerText = val;
		},

		setTimeMessage: function (val) {
			$l.querySelector('.statusSection .time').innerText = val;
		},

		getActiveTab: function () {
			var currentTab = syn.$l.querySelector('ul[class="mainTabUI"] [class*="active"]');
			var result = null;
			if (currentTab) {
				var tabHeaderInfos = currentTab.id.split('$');
				result = {
					tabID: currentTab.id,
					projectID: tabHeaderInfos[0],
					itemID: tabHeaderInfos[1],
					menuID: tabHeaderInfos[2],
					parentMenuID: tabHeaderInfos[3],
					menuText: currentTab.innerText
				}
			}

			return result;
		},

		getTabInfo: function (projectID, itemID) {
			var result = null;
			var findNodes = $layout.menus.filter(function (item) { return item.ASSEMBLYNAME == projectID && item.CLASSNAME == itemID });
			if (findNodes.length > 0) {
				result = findNodes[0];
			}

			return result;
		},

		getActiveTabID: function (projectID, itemID) {
			var tabID = '';
			var tab = syn.$l.querySelector('ul[class="mainTabUI"] [id*="' + projectID + '$' + itemID + '"]');

			if (tab) {
				tabID = tab.id;
			}

			return tabID;
		},

		getActiveTabContent: function (tabID) {
			var currentTab = syn.$l.get(tabID + '$i');
			var contentWindow = null;

			if (currentTab) {
				contentWindow = currentTab.contentWindow;
			}

			return contentWindow;
		},

		focusTabUI: function (tabKey) {
			var tabLI = null;

			if ($string.isNullOrEmpty(tabKey) == true) {
				return;
			}

			if ($reflection.isNumber(tabKey) == true) {
				tabLI = syn.$l.querySelectorAll('ul[class="mainTabUI"] > li')[tabKey];
			}
			else {
				tabLI = syn.$l.querySelector('ul[class="mainTabUI"] > li[id="' + tabKey + '"]');
			}

			var tabFrames = syn.$l.querySelectorAll('div.mainFrame iframe');
			var tabHeaderInfos = tabLI.id.split('$');
			var projectID = tabHeaderInfos[0];
			var itemID = tabHeaderInfos[1];
			var menuID = tabHeaderInfos[2];
			var parentMenuID = tabHeaderInfos[3];
			var activeTabID = '';
			var tabInfo = null;
			var tabFrame = null;
			for (var i = 0, l = tabFrames.length; i < l; i++) {
				tabFrame = tabFrames[i];
				if (syn.$m.getStyle(tabFrame, 'display') === 'block') {
					activeTabID = tabFrame.id;
					break;
				}
			}

			var recentMenu = {};
			recentMenu.menuNav = '';
			recentMenu.tabID = tabLI.id;
			recentMenu.tabInfo =
			{
				tabID: tabLI.id,
				projectID: projectID,
				itemID: itemID,
				menuID: menuID,
				parentMenuID: parentMenuID,
				menuText: tabLI.innerText
			};

			$layout.addRecentMenus(recentMenu);

			$m.removeClass(syn.$l.querySelector('ul[class="mainTabUI"] [class*="active"]'), 'active');

			$m.addClass(tabLI, 'active');

			var pageWindow = $layout.getActiveTabContent(tabLI.id);
			if (pageWindow) {
				if (pageWindow['$progressBar']) {
					if (pageWindow.$progressBar.isProgress == true) {
						$layout.buttonAction = false;
					}
					else {
						$layout.buttonAction = true;
					}
				}
			}

			$layout.refreshUIButtons(tabLI.buttons);
			$layout.focusTreeMenu(projectID, itemID, menuID, parentMenuID);

			var focusTabID = tabLI.id + '$i';
			if (activeTabID != focusTabID) {
				if (activeTabID) {
					$m.setStyle(syn.$l.get(activeTabID), 'display', 'none');
				}

				if (focusTabID) {
					$m.setStyle(syn.$l.get(focusTabID), 'display', 'block');
				}
			}

			window.focus();
			tabInfo = $layout.getActiveTab();

			if (tabInfo) {
				try {
					var pageWindow = $layout.getActiveTabContent(tabInfo.tabID);
					if (pageWindow['$w']) {
						var pageScript = pageWindow[pageWindow['$w'].pageScript];

						if (pageScript && pageScript.$grid) {
							for (var i = 0; i < pageScript.$grid.gridControls.length; i++) {
								pageScript.$grid.gridControls[i].hot.render();
							}
						}

						$layout.layout_VisibleChanged(pageScript, true);
					}
				}
				catch (error) {
					$l.eventLog('focusTabUI', error.toString());
				}
			}
		},

		refreshUIButtons: function (buttons) {
			if (buttons) {
				var uiButtons = buttons.split("|");

				$l.get('btnUISearch').disabled = !$string.toBoolean(uiButtons[0]);
				$l.get('btnUISave').disabled = !$string.toBoolean(uiButtons[1]);
				$l.get('btnUIDelete').disabled = !$string.toBoolean(uiButtons[2]);
				$l.get('btnUIPrint').disabled = !$string.toBoolean(uiButtons[3]);
				$l.get('btnUIExport').disabled = !$string.toBoolean(uiButtons[4]);
			}
		},

		resizeTabUI: function () {
			var currentTab = syn.$l.querySelector('ul[class="mainTabUI"] [class*="active"]');
			var tabFrames = syn.$l.querySelectorAll('div.mainFrame iframe');

			for (var i = 0, l = tabFrames.length; i < l; i++) {
				tabFrames[i].resizeReady = true;
			}

			if (currentTab) {
				try {
					var pageWindow = $layout.getActiveTabContent(currentTab.id);
					var pageScript = pageWindow[pageWindow['$w'].pageScript];

					$layout.layout_UIResizing(pageScript);

					$l.get(currentTab.id + '$i').resizeReady = false;
				}
				catch (error) {
				}
			}
		},

		addRecentMenus: function (recentMenu) {
			if ($layout.recentMenus.length > 0) {
				var lastRecentMenu = $layout.recentMenus[$layout.recentMenus.length - 1];

				if (lastRecentMenu.tabID !== recentMenu.tabID) {
					$layout.recentMenus.push(recentMenu);
				}

				lastRecentMenu = null;
			}
			else {
				$layout.recentMenus.push(recentMenu);
			}
		},

		getRecentMenus: function () {
			return $layout.recentMenus;
		},

		setMoveButtonStatus: function (useFirst, usePrev, useNext, useEnd) {
			return;
			var firstButton = syn.$l.get('btnTabMoveFirst');
			var prevButton = syn.$l.get('btnTabMovePrev');
			var nextButton = syn.$l.get('btnTabMoveNext');
			var endButton = syn.$l.get('btnTabMoveLast');

			if (useFirst == false) {
				if (syn.$m.hasClass(firstButton, 'off') == false) {
					$m.addClass(firstButton, 'off');
				}
			}
			else {
				$m.removeClass(firstButton, 'off');
			}

			if (usePrev == false) {
				if (syn.$m.hasClass(prevButton, 'off') == false) {
					$m.addClass(prevButton, 'off');
				}
			}
			else {
				$m.removeClass(prevButton, 'off');
			}

			if (useNext == false) {
				if (syn.$m.hasClass(nextButton, 'off') == false) {
					$m.addClass(nextButton, 'off');
				}
			}
			else {
				$m.removeClass(nextButton, 'off');
			}

			if (useEnd == false) {
				if (syn.$m.hasClass(endButton, 'off') == false) {
					$m.addClass(endButton, 'off');
				}
			}
			else {
				$m.removeClass(endButton, 'off');
			}
		},

		refreshTabUI: function (currentPageIndex) {
			return;
			var tabUI = syn.$l.querySelector('div [class="mainTabUI"]');
			var tabUIItemCount = tabUI.childNodes.length;
			var tabUIPageCount = Math.floor($(tabUI).width() / 150);
			var tabUITotalPages = tabUIItemCount % tabUIPageCount > 0 ? Math.floor(tabUIItemCount / tabUIPageCount) + 1 : Math.floor(tabUIItemCount / tabUIPageCount); // 총 페이지 수
			var tabUICurrentPageIndex = $layout.tabUICurrentPageIndex;
			var tabUICurrentIndex = $layout.tabUICurrentIndex;

			var tabUICurrentLI = syn.$l.querySelector('div [class="mainTabUI"] .active');
			if (tabUICurrentLI) {
				for (var i = 0, l = tabUI.childNodes.length; i < l; i++) {
					if (tabUICurrentLI.id == tabUI.childNodes[i].id) {
						tabUICurrentIndex = i + 1;
						break;
					}
				}
			}

			if (currentPageIndex == undefined) {
				for (var i = 0; i < tabUITotalPages; i++) {
					if (tabUICurrentIndex <= (tabUIPageCount * (i + 1))) {
						tabUICurrentPageIndex = i;
						break;
					}
				}
			}
			else {
				tabUICurrentPageIndex = currentPageIndex;
			}

			$layout.tabUICurrentPageIndex = tabUICurrentPageIndex;
			$layout.tabUICurrentIndex = tabUICurrentIndex;
			$layout.tabUIItemCount = tabUIItemCount;
			$layout.tabUIPageCount = tabUIPageCount;
			$layout.tabUITotalPages = tabUITotalPages <= 0 ? 0 : tabUITotalPages - 1;

			var li = null;
			for (var i = 0, l = tabUI.childNodes.length; i < l; i++) {
				li = tabUI.childNodes[i];
				if (li && li.nodeType == 1) {
					$m.setStyle(li, 'display', 'none');
				}
			}

			var startIndex = $layout.tabUICurrentPageIndex * $layout.tabUIPageCount;
			for (var i = startIndex; i < (startIndex + $layout.tabUIPageCount); i++) {
				li = tabUI.childNodes[i];

				if (li && li.nodeType == 1) {
					$m.setStyle(li, 'display', 'block');
				}
				else {
					// break;
				}
			}
		},

		moveTabUI: function (direction) {
			var tabInfo = $layout.getActiveTab();
			if (tabInfo) {
				var tabParent = syn.$l.querySelector('ul[class="mainTabUI"]');
				var tabHeaders = tabParent.children;
				var tabHeaderEL = null;

				var from = null;
				var to = null;
				var tabLength = tabHeaders.length;
				for (var i = 0, l = tabLength; i < l; i++) {
					tabHeaderEL = tabHeaders[i];
					if (tabInfo.tabID === tabHeaderEL.id) {
						from = i;
						break;
					}
				}

				if (from != null && direction) {
					if (direction == 'first') {
						to = 0;
					}
					else if (direction == 'prev') {
						if (from > 0) {
							to = (from - 1);
						}
					}
					else if (direction == 'next') {
						if (from < (tabLength - 1)) {
							to = (from + 1);
						}
					}
					else if (direction == 'last') {
						to = tabLength - 1;
					}

					if (to != null) {
						var mainTabWrap = syn.$l.querySelector('.mainTabWrap');
						if (direction == 'first') {
							tabParent.insertBefore(tabHeaderEL, tabHeaders[0]);
						}
						else if (direction == 'prev') {
							tabParent.insertBefore(tabHeaderEL, tabHeaderEL.previousElementSibling);
						}
						else if (direction == 'next') {
							tabParent.insertBefore(tabHeaderEL, tabHeaderEL.nextElementSibling.nextElementSibling);
						}
						else if (direction == 'last') {
							tabParent.insertBefore(tabHeaderEL, tabHeaders[tabLength]);
						}

						setTimeout(function () {
							var tabHeaderWidth = (tabLength * 150) + ((tabLength - 1) * 3);
							var tabAvailableCount = Math.floor(mainTabWrap.offsetWidth / 153);
							var tabPageCount = Math.ceil(tabHeaderWidth / mainTabWrap.offsetWidth);

							var scrollLeft = 0;
							for (var i = 0; i < tabPageCount; i++) {
								tabAvailableCount = tabAvailableCount * (i + 1);
								if (to < tabAvailableCount) {
									scrollLeft = mainTabWrap.offsetWidth * i;
									break;
								}
							}

							if (mainTabWrap.scrollLeft != scrollLeft) {
								mainTabWrap.scrollLeft = scrollLeft;
							}
						});
					}
				}
			}
		},

		closeTabID: function (tabID) {
			var tabHeaders = syn.$l.querySelectorAll('ul[class="mainTabUI"] > li');

			for (var i = 0, l = tabHeaders.length; i < l; i++) {
				if (tabID === tabHeaders[i].id) {
					$layout.closeTabUI(i);
					break;
				}
			}
		},

		closeTabUI: function (tabIndex, isForce) {
			var tabHeaders = syn.$l.querySelectorAll('ul[class="mainTabUI"] > li');
			var tabHeader = tabHeaders[tabIndex];
			var tabIFrame = syn.$l.get(tabHeader.id + '$i');
			var isClose = true;

			if (isForce) {
			}
			else {
				try {
					var tabContent = $layout.getActiveTabContent(tabHeader.id);
					var pageScript = tabContent[tabContent['$w'].pageScript];

					isClose = $layout.layout_UIClosed(pageScript);
				}
				catch (error) {
					$l.eventLog('closeTabUI', error.toString());
				}
			}

			if (isClose == true) {
				$m.remove(tabHeader);
				$m.remove(tabIFrame);

				var tabHeaderEL = syn.$l.querySelector('ul[class="mainTabUI"]');
				var tabCount = tabHeaderEL.childNodes.length;
				if (tabCount > 0) {
					tabHeaderEL.style.width = ((tabCount) * 153 - 3).toString() + 'px';

					if (tabCount == tabIndex) {
						$layout.focusTabUI(--tabIndex);
					}
					else if (tabCount > tabIndex) {
						$layout.focusTabUI(tabIndex);
					}
					else if (tabCount < tabIndex) {
						$layout.focusTabUI(tabCount - 1);
					}
				}
				else {
					tabHeaderEL.style.width = '0px';
				}
			}

			$layout.refreshTabUI();
			$layout.setMoveButtonStatus($layout.tabUICurrentPageIndex > 0, $layout.tabUICurrentPageIndex > 0, $layout.tabUICurrentPageIndex < $layout.tabUITotalPages, $layout.tabUICurrentPageIndex < $layout.tabUITotalPages);
		},

		closeAllTabUI: function () {
			var tabHeaders = syn.$l.querySelectorAll('ul[class="mainTabUI"] > li');

			for (var i = tabHeaders.length; i > 0; i--) {
				$layout.closeTabUI(i - 1, true);
			}
		},

		sessionDestroyedAllTabUI: function () {
			var tabHeaders = syn.$l.querySelectorAll('ul[class="mainTabUI"] > li');
			var tabHeader = null;
			var pageScript = null;
			var menuID = '';
			for (var i = 0, l = tabHeaders.length; i < l; i++) {
				tabHeader = tabHeaders[i];
				menuID = tabHeader.id.split('$')[0];

				var pageWindow = $layout.getActiveTabContent(tabHeader.id);
				var webform = pageWindow['$w'];
				if (webform) {
					var mod = pageWindow[webform.pageScript];
					if (mod) {
						$layout.layout_SessionDestroyed(mod);
					}
				}
			}
		},

		concreateMenuControl: function () {
			var orderSortFunction = function (a, b) {
				if (a.SORTNUM > b.SORTNUM) {
					return 1;
				}
				if (a.SORTNUM < b.SORTNUM) {
					return -1;
				}
				return 0;
			};

			var nameSortFunction = function (a, b) {
				if (a.PROGRAMNAME > b.PROGRAMNAME) {
					return 1;
				}
				if (a.PROGRAMNAME < b.PROGRAMNAME) {
					return -1;
				}
				return 0;
			};

			var root_node = $layout.menus.filter(function (item) { return item.PARENTID == null })[0];
			$layout.gnb_nodes = $layout.menus.filter(function (item) { return item.PARENTID == root_node.PROGRAMID }).sort(orderSortFunction);
			$layout.autocomplete_nodes = $layout.menus.filter(function (item) { return item.FOLDERYN == 'N' }).sort(nameSortFunction);

			$layout.firstGnbLi = null;
			// gnb 설정
			var ul_toolbar = syn.$l.get('topToolbarMenu');
			for (var i = 0, l = $layout.gnb_nodes.length; i < l; i++) {
				var depth1_node = $layout.gnb_nodes[i];

				var li = document.createElement('li');
				li.id = 'M' + depth1_node.PROGRAMID;
				li.parentMenuID = 'P' + depth1_node.PARENTID;
				li.folderYN = depth1_node.FOLDERYN;

				if (depth1_node.VIEWYN == 'N') {
					$m.addClass(li, 'hidden');
				}
				else {
					if ($layout.firstGnbLi == null) {
						$layout.firstGnbLi = li;
					}
				}

				ul_toolbar.appendChild(li);

				var a = document.createElement('a');
				a.href = '#';
				a.innerText = depth1_node.PROGRAMNAME;
				li.appendChild(a);

				var ul_depth1 = document.createElement('ul');
				li.appendChild(ul_depth1);

				$l.addEvent(li, 'click', function (evt) {
					var el = this;
					var folderYN = el.folderYN;
					var menuID = el.id.substring(1, el.id.length);
					var parentMenuID = el.parentMenuID.substring(1, el.parentMenuID.length);

					var gnbMenu = syn.$l.querySelector('ul#topToolbarMenu > li.active');
					if (gnbMenu) {
						$m.removeClass(gnbMenu, 'active');
					}

					$m.addClass(el, 'active');

					if (folderYN == 'Y') {
						var menus = $layout.gnb_nodes.filter(function (item) {
							return item.PROGRAMID == menuID
								&& item.PARENTID == parentMenuID
						});

						if (menus.length > 0) {
							var menu = menus[0];

							var hiddenLnbTreeMenus = syn.$l.querySelectorAll('nav[lnbTreeMenu]');
							for (var i = 0; i < hiddenLnbTreeMenus.length; i++) {
								var hiddenLnbTreeMenu = hiddenLnbTreeMenus[i];
								$m.addClass(hiddenLnbTreeMenu, 'hidden');
								hiddenLnbTreeMenu.setAttribute('lnbTreeMenu', 'none');
							}

							var activeLnbTreeMenu = syn.$l.get('lnbTreeMenu_' + menu.PROGRAMID);
							if (activeLnbTreeMenu) {
								$m.removeClass(activeLnbTreeMenu, 'hidden');
								hiddenLnbTreeMenu.setAttribute('lnbTreeMenu', 'display');
							}
						}
					}
					else {
						return;
						var menus = $layout.gnb_nodes.filter(function (item) {
							return item.PROGRAMID == menuID
								&& item.PARENTID == parentMenuID
						});

						if (menus.length > 0) {
							var menu = menus[0];
							// var treenode = menu.treenode;
							// $layout.treeView.doubleClickNode(treenode);
						}
					}
				});
			}

			// LMS 메뉴
			// if (syn.$w.SSO.Roles.indexOf('20') > -1) {
			// 	var li = document.createElement('li');
			// 	li.id = 'MLMS';
			// 	li.parentMenuID = 'PLMS';
			// 	li.folderYN = '0';
			// 
			// 	ul_toolbar.appendChild(li);
			// 
			// 	var a = document.createElement('a');
			// 	a.href = '#';
			// 	a.innerText = 'LMS';
			// 	li.appendChild(a);
			// 
			// 	var ul_depth1 = document.createElement('ul');
			// 	li.appendChild(ul_depth1);
			// 
			// 	$l.addEvent(li, 'click', function (evt) {
			// 		var directObject = {
			// 			ProgramID: 'HDS',
			// 			BusinessID: 'SMP',
			// 			TransactionID: 'SMP070',
			// 			FunctionID: 'G07',
			// 			InputObjects: [
			// 				{ prop: 'I_USER_ID', val: syn.$w.SSO.UserID }
			// 			]
			// 		};
			// 
			// 		$w.transactionDirect(directObject, function (responseData, addtionalData) {
			// 			if (responseData.length == 1) {
			// 				var item = responseData[0].Value[0];
			// 				if (item.O_RET == '1') {
			// 					var browserTokenID = item.O_BROWSER_TOKEN_ID;
			// 					if (browserTokenID) {
			// 						window.open('https://ilms.handstack.com/token_login.do?token=' + syn.$w.getStorage('browserTokenID', true), '_blank');
			// 					}
			// 				}
			// 				else {
			// 					$w.alert('브라우저 토근 ID 확인이 필요합니다', '정보');
			// 				}
			// 			}
			// 			else {
			// 				$l.eventLog('LMS', 'BROWSER_TOKEN_ID 확인 오류', 'Error');
			// 			}
			// 		});
			// 	});
			// }

			$('#topToolbarMenu').smartmenus({
				collapsibleHideDuration: null,
				hideTimeout: 0,
				subIndicators: false
			});

			var lnbSection = syn.$l.querySelector('div.lnbMenuList');
			// lnb 설정
			for (var i = 0; i < $layout.gnb_nodes.length; i++) {
				var depth1_node = $layout.gnb_nodes[i];
				var el = document.createElement('nav');
				el.setAttribute('lnbTreeMenu', 'none');
				$m.addClass(el, 'hidden');
				el.id = 'lnbTreeMenu_' + depth1_node.PROGRAMID;
				lnbSection.appendChild(el);
				var treeView = createTree(el.id);
				treeView.nodeSelectEvent = function (node) {
					var menu_node = node.tag;
					var url = '';
					if (menu_node.PROGRAMPATH) {
						url = menu_node.PROGRAMPATH;
					}
					else {
						if (menu_node.CLASSNAME.indexOf('|') > -1) {
							var menuCommand = menu_node.CLASSNAME.split('|')[0];
							var menuPath = menu_node.CLASSNAME.split('|')[1];
							if (menuCommand == 'URL') {
								url = menuPath;
							}
						}
						else {
							url = '/views/{0}/{1}.html'.format(menu_node.ASSEMBLYNAME, menu_node.CLASSNAME);
						}
					}

					if (event && event.ctrlKey == true) {
						url = url.replace('views', 'designs');
					}

					$layout.addTabUI(menu_node.ASSEMBLYNAME, menu_node.CLASSNAME, menu_node.PROGRAMID, menu_node.PARENTID, url);
				};

				var depth2_nodes = $layout.menus.filter(function (item) { return item.PARENTID == depth1_node.PROGRAMID }).sort(orderSortFunction);
				for (var j = 0; j < depth2_nodes.length; j++) {
					var depth2_node = depth2_nodes[j];

					var node2 = null;
					if (depth2_node.VIEWYN == 'Y') {
						node2 = treeView.createNode(depth2_node.PROGRAMNAME, false, null, null, depth2_node, null);
					}

					$layout.treemenus.push({ treenode: node2, menu: depth2_node, parent_menu: null });
					var depth3_nodes = $layout.menus.filter(function (item) { return item.PARENTID == depth2_node.PROGRAMID }).sort(orderSortFunction);

					for (var k = 0; k < depth3_nodes.length; k++) {
						var depth3_node = depth3_nodes[k];
						var node3 = null;
						if (depth3_node.VIEWYN == 'Y') {
							node3 = node2.createChildNode(depth3_node.PROGRAMNAME, false, null, depth3_node, null);
						}

						$layout.treemenus.push({ treenode: node3, menu: depth3_node, parent_menu: depth2_node });
					}
				}

				treeView.drawTree();
				$layout.treeViews.push(treeView);

				var lnbHeader = syn.$l.get('tplHeaderArea_' + depth1_node.PROGRAMID);
				if (lnbHeader != null) {
					var div = document.createElement('div');
					div.innerHTML = lnbHeader.innerHTML;
					$m.prepend(div, el);
				}

				var lnbFooter = syn.$l.get('tplFooterArea_' + depth1_node.PROGRAMID);
				if (lnbFooter != null) {
					var div = document.createElement('div');
					div.innerHTML = lnbFooter.innerHTML;
					$m.appendChild(el, div);
				}
			}

			if ($layout.gnb_nodes.length > 0) {
				var depth1_node = $layout.gnb_nodes[0];

				var gnbEl = syn.$l.get('M' + depth1_node.PROGRAMID);
				$m.addClass(gnbEl, 'active');

				var lnbEl = syn.$l.get('lnbTreeMenu_' + depth1_node.PROGRAMID);
				$m.removeClass(lnbEl, 'hidden');
				lnbEl.setAttribute('lnbTreeMenu', 'display');
			}

			// 메뉴 검색
			var menu_names = $layout.autocomplete_nodes
				.filter(function (item) { return item.VIEWYN == 'Y' })
				.map(function (item) { return { PROGRAMNAME: item.PROGRAMNAME, CLASSNAME: item.CLASSNAME }; });

			var find_menu = new autoComplete({
				selector: '#txtMenuSearch',
				minChars: 1,
				delay: 250,
				source: function (term, suggest) {
					var matches = [];
					if (term.trim() == '') {
						matches = menu_names.map(function (item) { return item.PROGRAMNAME + ' (' + item.CLASSNAME + ')'; });
					}
					else {
						matches = menu_names.filter(function (item) { return item.PROGRAMNAME.indexOf(term) > -1 || item.CLASSNAME.toUpperCase().indexOf(term.toUpperCase()) > -1 }).map(function (item) { return item.PROGRAMNAME + ' (' + item.CLASSNAME + ')'; });
					}

					suggest(matches);
				},
				onSelect: function (event, term, item) {
					$l.trigger('btnFindAddTabMenu', 'click');
				}
			});

			$l.addEvent('txtMenuSearch', 'keydown', function (evt) {
				if (evt.keyCode == 13) {
					$l.trigger('btnFindAddTabMenu', 'click');
				}

				return true;
			});
		},

		addWorkTabUI: function (tabID, title, buttons, url, options) {
			if ($string.isNullOrEmpty(tabID) == true || $string.isNullOrEmpty(title) == true || $string.isNullOrEmpty(url) == true) {
				$w.alert('업무 탭을 열 수 있는 필수 항목 확인 필요', '정보');
				return;
			}

			options = syn.$w.argumentsExtend({
				uiType: 'u', // d: document, a: approval, s: share, l: link, u: ui 탭 배경색 관리
				uniqueTab: true,
				callback: null
			}, options);

			var tabLI = syn.$l.querySelector('ul[class="mainTabUI"] > li[id="' + tabID + '"]');
			if (tabLI && options.uniqueTab == false) {
				$layout.focusTabUI(tabID);
				return;
			}

			if (options.uniqueTab == true) {
				tabID = tabID + '$' + syn.$l.random();
			}

			buttons = syn.$w.argumentsExtend({
				FN_SEARCH: 'N',
				FN_SAVE: 'N',
				FN_DELETE: 'N',
				FN_PRINT: 'N',
				FN_EXCELEXPORT: 'N'
			}, buttons);

			var tabHeaderEL = syn.$l.querySelector('ul[class="mainTabUI"]');
			$m.removeClass(syn.$l.querySelector('ul[class="mainTabUI"] [class*="active"]'), 'active');

			var evt = evt ? evt : window.event;

			if (syn.$l.querySelector('ul[class="mainTabUI"] > li[id="' + tabID + '"]')) {
				$layout.focusTabUI(tabID);
				$layout.refreshTabUI();
				$layout.setMoveButtonStatus($layout.tabUICurrentPageIndex > 0, $layout.tabUICurrentPageIndex > 0, $layout.tabUICurrentPageIndex < $layout.tabUITotalPages, $layout.tabUICurrentPageIndex < $layout.tabUITotalPages);
				return;
			}

			var tabCount = syn.$l.querySelectorAll('ul[class="mainTabUI"] > li').length;

			if (tabCount >= $layout.limitTabCount) {
				$w.alert('현재 브라우저에서 열 수 있는 최대 탭 UI 갯수는 {0}개 입니다'.format($layout.limitTabCount.toString()), '정보');
				return;
			}

			tabHeaderEL.style.width = (($MainFrame.homeTabID == null ? tabHeaderEL.childNodes.length + 1 : tabHeaderEL.childNodes.length) * 153 - 3).toString() + 'px';
			tabLI = syn.$m.append(tabHeaderEL, 'li', tabID, { display: 'none' });

			var callback = options.callback;
			if (callback) {
			}
			else {
				$m.setStyle(tabLI, 'display', 'block');
			}

			tabLI.title = '{0} ({1})'.format(title, tabID);
			tabLI.buttons = '{0}|{1}|{2}|{3}|{4}'.format(buttons.FN_SEARCH, buttons.FN_SAVE, buttons.FN_DELETE, buttons.FN_PRINT, buttons.FN_EXCELEXPORT);
			var spanText = syn.$m.append(tabLI, 'span');

			if (options.uiType != 'u') {
				var iconName = '';
				switch (options.uiType) {
					case 'd':
						iconName = 'ri-file-edit-line';
						break;
					case 'a':
						iconName = 'ri-key-2-line';
						break;
					case 's':
						iconName = 'ri-share-box-line';
						break;
					case 'l':
						iconName = 'ri-links-line';
						break;
				}
				var icon = document.createElement('i');
				$m.addClass(icon, iconName);

				$m.prepend(icon, tabLI);
				$m.addClass(spanText, 'ml-4');
			}

			spanText.innerText = title;

			var tabClose = syn.$m.append(tabLI, 'button', tabID + '_closeButton');
			$m.addClass(tabClose, 'ri-close-line');
			$m.addClass(tabClose, 'btn_close');

			$m.addClass(tabLI, 'active');

			var mainTabWrap = syn.$l.querySelector('.mainTabWrap');
			mainTabWrap.scrollLeft = tabHeaderEL.offsetWidth - mainTabWrap.offsetWidth;

			$l.addEvent(tabLI, 'mousedown', function (evt) {
				var el = evt.srcElement || evt.target || evt;
				var tabLI = null;

				if (el.tagName == 'LI') {
					tabLI = el;
				}
				else {
					tabLI = el.parentElement;
				}

				var tabHeaders = null;
				if (evt.which === 2) {
					tabHeaders = syn.$l.querySelectorAll('ul[class="mainTabUI"] > li');

					for (var i = 0, l = tabHeaders.length; i < l; i++) {
						if (tabLI.id.replace('_closeButton', '') === tabHeaders[i].id) {
							$layout.closeTabUI(i);
							break;
						}
					}
				}
			});

			$l.addEvent(tabLI, 'click', function (evt) {
				if ($MainFrame.isTabMoveUp == true) {
					$MainFrame.isTabMoveUp = false;
					return;
				}

				var el = evt.srcElement || evt.target || evt;
				var tabLI = null;

				if (el.tagName == 'LI') {
					tabLI = el;
				}
				else {
					tabLI = el.parentElement;
				}

				var tabHeaders = null;

				if (syn.$m.hasClass(el, 'btn_close') == true) {
					tabHeaders = syn.$l.querySelectorAll('ul[class="mainTabUI"] > li');

					for (var i = 0, l = tabHeaders.length; i < l; i++) {
						if (tabLI.id.replace('_closeButton', '') === tabHeaders[i].id) {
							$layout.closeTabUI(i);
							break;
						}
					}

					return;
				}

				if (syn.$m.hasClass(el, 'btn_refresh') == true) {
					tabHeaders = syn.$l.querySelectorAll('ul[class="mainTabUI"] > li');

					for (var i = 0, l = tabHeaders.length; i < l; i++) {
						if (tabLI.id.replace('_refreshButton', '') === tabHeaders[i].id) {
							var tabIFrame = syn.$l.get(tabHeaders[i].id + '$i');
							tabIFrame.contentWindow.location.reload(true);
							break;
						}
					}

					return;
				}

				var tabFrames = syn.$l.querySelectorAll('div.mainFrame iframe');
				var activeTabID = '';
				var tabInfo = null;
				var tabFrame = null;
				for (var i = 0, l = tabFrames.length; i < l; i++) {
					tabFrame = tabFrames[i];
					if (syn.$m.getStyle(tabFrame, 'display') === 'block') {
						activeTabID = tabFrame.id;
						break;
					}
				}

				$layout.refreshUIButtons(tabLI.buttons);

				tabInfo = $layout.getActiveTab();

				var focusTabID = tabLI.id + '$i';
				if (activeTabID == focusTabID) {
					return;
				}

				$m.removeClass(syn.$l.querySelector('ul[class="mainTabUI"] [class*="active"]'), 'active');
				$m.addClass(tabLI, 'active');

				$m.setStyle(syn.$l.get(activeTabID), 'display', 'none');
				$m.setStyle(syn.$l.get(tabLI.id + '$i'), 'display', 'block');

				if (tabInfo) {
					try {
						var tabID = tabInfo.tabID;
						var pageWindow = $layout.getActiveTabContent(tabID);
						var pageScript = pageWindow[pageWindow['$w'].pageScript];

						$layout.layout_VisibleChanged(pageScript, false);

						if (pageWindow) {
							if (pageWindow['$progressBar']) {
								if (pageWindow.$progressBar.isProgress == true || pageWindow.$webform.isShowAlert == true || pageWindow.$webform.isShowDialog == true) {
									$layout.buttonAction = false;
								}
								else {
									$layout.buttonAction = true;
								}
							}
						}

						tabID = tabLI.id;
						pageWindow = $layout.getActiveTabContent(tabLI.id);
						pageScript = pageWindow[pageWindow['$w'].pageScript];

						if (syn.$l.get(tabID + '$i').resizeReady == true) {
							$layout.layout_UIResizing(pageScript);
							$l.get(tabID + '$i').resizeReady = false;
						}

						if (pageScript && pageScript.$grid) {
							for (var i = 0; i < pageScript.$grid.gridControls.length; i++) {
								pageScript.$grid.gridControls[i].hot.render();
							}
						}

						$layout.layout_VisibleChanged(pageScript, true);
					}
					catch (error) {
						$l.eventLog('tabLI_click', error.toString());
					}
				}
			});

			var tabContainer = syn.$l.querySelector('div.mainFrame');
			var tabFrames = syn.$l.querySelectorAll('div.mainFrame iframe');

			for (var i = 0, l = tabFrames.length; i < l; i++) {
				$m.setStyle(tabFrames[i], 'display', 'none');
			}

			var tabFrame = syn.$m.append(tabContainer, 'iframe', tabID + '$i', { display: 'none' });
			tabFrame.width = '100%';
			tabFrame.height = '100%';
			tabFrame.frameborder = '0';
			tabFrame.scrolling = 'yes';
			tabFrame.border = '0';
			tabFrame.hspace = '0';
			tabFrame.vspace = '0';
			tabFrame.name = 'fraBody';
			tabFrame.src = url += (url.indexOf('?') > -1 ? '&' : '?') + 'tabID=' + tabID + '&r=' + syn.$l.random();
			tabFrame.setAttribute('allowfullscreen', 'allowfullscreen');
			tabFrame.style.border = 0;

			$l.addEvent(tabFrame, 'load', function () {
				var pageWindow = $layout.getActiveTabContent(tabID);
				if (pageWindow && pageWindow.document) {
					var pageHeader = pageWindow.document.querySelector('.mainContents > .head > .title');
					if (pageHeader) {
						pageHeader.innerHTML = '<span>{0}</span><em>{1}</em>'.format(title, '');
					}
				}

				$layout.focusTabUI(tabID);
				$layout.refreshTabUI();
				$layout.setMoveButtonStatus($layout.tabUICurrentPageIndex > 0, $layout.tabUICurrentPageIndex > 0, $layout.tabUICurrentPageIndex < $layout.tabUITotalPages, $layout.tabUICurrentPageIndex < $layout.tabUITotalPages);

				if (callback) {
					var isHiddenTab = callback(tabID);
					if (isHiddenTab == null || isHiddenTab == undefined || isHiddenTab === false) {
					}
					else {
						$m.setStyle(tabLI, 'display', 'none');
					}
				}
			});

			tabFrame.style.display = 'block';

			if ($layout.isUILog == true) {
				// 신규 탭 생성시 화면 사용 로그를 기록합니다. 
				// var jsonObject = syn.$w.serviceObject('UseUILogInsert', 'json');
				// 
				// jsonObject.NameValues.push({ 'prop': 'ApplicationID', 'val': syn.$w.SSO.ApplicationID });
				// jsonObject.NameValues.push({ 'prop': 'BusinessID', 'val': syn.$w.SSO.BusinessID });
				// jsonObject.NameValues.push({ 'prop': 'PersonID', 'val': syn.$w.SSO.PersonID });
				// jsonObject.NameValues.push({ 'prop': 'LocaleID', 'val': syn.$w.SSO.LocaleID });
				// jsonObject.NameValues.push({ 'prop': 'UserAgent', 'val': navigator.userAgent });
				// jsonObject.NameValues.push({ 'prop': 'CategoryID', 'val': categoryID });
				// jsonObject.NameValues.push({ 'prop': 'MenuID', 'val': menuID });
				// jsonObject.NameValues.push({ 'prop': 'Url', 'val': url });
				// 
				// syn.$w.basicServiceClient('/RESTFul/Common/', jsonObject);
			}
		},

		addTabUI: function (projectID, itemID, menuID, parentMenuID, url, callback) {
			var menu_node = null;
			var menu_nodes = $layout.menus.filter(function (item) { return item.PROGRAMID == menuID && item.PARENTID == parentMenuID });
			if (menu_nodes.length > 0) {
				menu_node = menu_nodes[0];
			}
			else {
				$w.alert('메뉴 정보가 올바르지 않습니다', '정보');
				return;
			}
			var tabHeaderEL = syn.$l.querySelector('ul[class="mainTabUI"]');
			$m.removeClass(syn.$l.querySelector('ul[class="mainTabUI"] [class*="active"]'), 'active');

			var evt = evt ? evt : window.event;
			var tabID = '';
			tabID = tabID.concat(projectID, '$', itemID, '$', menuID, '$', parentMenuID);

			if (syn.$l.querySelector('ul[class="mainTabUI"] > li[id="' + tabID + '"]')) {
				$layout.focusTabUI(tabID);
				$layout.refreshTabUI();
				$layout.setMoveButtonStatus($layout.tabUICurrentPageIndex > 0, $layout.tabUICurrentPageIndex > 0, $layout.tabUICurrentPageIndex < $layout.tabUITotalPages, $layout.tabUICurrentPageIndex < $layout.tabUITotalPages);
				return;
			}

			var tabCount = syn.$l.querySelectorAll('ul[class="mainTabUI"] > li').length;

			if (tabCount >= $layout.limitTabCount) {
				$w.alert('현재 브라우저에서 열 수 있는 최대 탭 UI 갯수는 {0}개 입니다'.format($layout.limitTabCount.toString()), '정보');
				return;
			}

			tabHeaderEL.style.width = (($MainFrame.homeTabID == null ? tabHeaderEL.childNodes.length + 1 : tabHeaderEL.childNodes.length) * 153 - 3).toString() + 'px';
			var tabLI = syn.$m.append(tabHeaderEL, 'li', tabID, { display: 'none' });

			if (callback) {
			}
			else {
				$m.setStyle(tabLI, 'display', 'block');
			}

			tabLI.title = tabID;
			tabLI.buttons = '{0}|{1}|{2}|{3}|{4}'.format(menu_node.FN_SEARCH, menu_node.FN_SAVE, menu_node.FN_DELETE, menu_node.FN_PRINT, menu_node.FN_EXCELEXPORT);
			var spanText = syn.$m.append(tabLI, 'span');
			spanText.innerText = menu_node.PROGRAMNAME;

			// var tabRefresh = syn.$m.append(tabLI, 'button', tabID + '_refreshButton');
			// $m.addClass(tabRefresh, 'ri-refresh-line');
			// $m.addClass(tabRefresh, 'btn_refresh');

			var tabClose = syn.$m.append(tabLI, 'button', tabID + '_closeButton');
			$m.addClass(tabClose, 'ri-close-line');
			$m.addClass(tabClose, 'btn_close');

			$m.addClass(tabLI, 'active');

			var mainTabWrap = syn.$l.querySelector('.mainTabWrap');
			mainTabWrap.scrollLeft = tabHeaderEL.offsetWidth - mainTabWrap.offsetWidth;

			$l.addEvent(tabLI, 'mousedown', function (evt) {
				var el = evt.srcElement || evt.target || evt;
				var tabLI = null;

				if (el.tagName == 'LI') {
					tabLI = el;
				}
				else {
					tabLI = el.parentElement;
				}

				var tabHeaders = null;
				if (evt.which === 2) {
					tabHeaders = syn.$l.querySelectorAll('ul[class="mainTabUI"] > li');

					for (var i = 0, l = tabHeaders.length; i < l; i++) {
						if (tabLI.id.replace('_closeButton', '') === tabHeaders[i].id) {
							$layout.closeTabUI(i);
							break;
						}
					}
				}
			});

			$l.addEvent(tabLI, 'click', function (evt) {
				if ($MainFrame.isTabMoveUp == true) {
					$MainFrame.isTabMoveUp = false;
					return;
				}

				var el = evt.srcElement || evt.target || evt;
				var tabLI = null;

				if (el.tagName == 'LI') {
					tabLI = el;
				}
				else {
					tabLI = el.parentElement;
				}

				var tabHeaders = null;

				if (syn.$m.hasClass(el, 'btn_close') == true) {
					tabHeaders = syn.$l.querySelectorAll('ul[class="mainTabUI"] > li');

					for (var i = 0, l = tabHeaders.length; i < l; i++) {
						if (tabLI.id.replace('_closeButton', '') === tabHeaders[i].id) {
							$layout.closeTabUI(i);
							break;
						}
					}

					return;
				}

				if (syn.$m.hasClass(el, 'btn_refresh') == true) {
					tabHeaders = syn.$l.querySelectorAll('ul[class="mainTabUI"] > li');

					for (var i = 0, l = tabHeaders.length; i < l; i++) {
						if (tabLI.id.replace('_refreshButton', '') === tabHeaders[i].id) {
							var tabIFrame = syn.$l.get(tabHeaders[i].id + '$i');
							tabIFrame.contentWindow.location.reload(true);
							break;
						}
					}

					return;
				}

				var tabFrames = syn.$l.querySelectorAll('div.mainFrame iframe');
				var tabHeaderInfos = tabLI.id.split('$');
				var projectID = tabHeaderInfos[0];
				var itemID = tabHeaderInfos[1];
				var menuID = tabHeaderInfos[2];
				var parentMenuID = tabHeaderInfos[3];
				var activeTabID = '';
				var tabInfo = null;
				var tabFrame = null;
				for (var i = 0, l = tabFrames.length; i < l; i++) {
					tabFrame = tabFrames[i];
					if (syn.$m.getStyle(tabFrame, 'display') === 'block') {
						activeTabID = tabFrame.id;
						break;
					}
				}

				$layout.refreshUIButtons(tabLI.buttons);
				$layout.focusTreeMenu(projectID, itemID, menuID, parentMenuID);

				tabInfo = $layout.getActiveTab();

				var focusTabID = tabLI.id + '$i';
				if (activeTabID == focusTabID) {
					return;
				}

				$m.removeClass(syn.$l.querySelector('ul[class="mainTabUI"] [class*="active"]'), 'active');
				$m.addClass(tabLI, 'active');

				$m.setStyle(syn.$l.get(activeTabID), 'display', 'none');
				$m.setStyle(syn.$l.get(tabLI.id + '$i'), 'display', 'block');

				if (tabInfo) {
					try {
						var tabID = tabInfo.tabID;
						var pageWindow = $layout.getActiveTabContent(tabID);
						var pageScript = pageWindow[pageWindow['$w'].pageScript];

						$layout.layout_VisibleChanged(pageScript, false);

						if (pageWindow) {
							if (pageWindow['$progressBar']) {
								if (pageWindow.$progressBar.isProgress == true || pageWindow.$webform.isShowAlert == true || pageWindow.$webform.isShowDialog == true) {
									$layout.buttonAction = false;
								}
								else {
									$layout.buttonAction = true;
								}
							}
						}

						tabID = tabLI.id;
						pageWindow = $layout.getActiveTabContent(tabLI.id);
						pageScript = pageWindow[pageWindow['$w'].pageScript];

						if (syn.$l.get(tabID + '$i').resizeReady == true) {
							$layout.layout_UIResizing(pageScript);
							$l.get(tabID + '$i').resizeReady = false;
						}

						if (pageScript && pageScript.$grid) {
							for (var i = 0; i < pageScript.$grid.gridControls.length; i++) {
								pageScript.$grid.gridControls[i].hot.render();
							}
						}

						$layout.layout_VisibleChanged(pageScript, true);
					}
					catch (error) {
						$l.eventLog('tabLI_click', error.toString());
					}
				}
			});

			var tabContainer = syn.$l.querySelector('div.mainFrame');
			var tabFrames = syn.$l.querySelectorAll('div.mainFrame iframe');

			for (var i = 0, l = tabFrames.length; i < l; i++) {
				$m.setStyle(tabFrames[i], 'display', 'none');
			}

			var tabFrame = syn.$m.append(tabContainer, 'iframe', tabID + '$i', { display: 'none' });
			tabFrame.width = '100%';
			tabFrame.height = '100%';
			tabFrame.frameborder = '0';
			tabFrame.scrolling = 'yes';
			tabFrame.border = '0';
			tabFrame.hspace = '0';
			tabFrame.vspace = '0';
			tabFrame.name = 'fraBody';
			tabFrame.src = url += (url.indexOf('?') > -1 ? '&' : '?') + 'tabID=' + tabID + '&r=' + syn.$l.random();
			tabFrame.setAttribute('allowfullscreen', 'allowfullscreen');
			tabFrame.style.border = 0;

			$l.addEvent(tabFrame, 'load', function () {
				var pageWindow = $layout.getActiveTabContent(tabID);
				if (pageWindow && pageWindow.document) {
					var pageHeader = pageWindow.document.querySelector('.mainContents > .head > .title');
					if (pageHeader) {
						pageHeader.innerHTML = '<span>{0}</span><em>{1}</em>'.format(menu_node.PROGRAMNAME, menu_node.PARENTNM + ' > ' + menu_node.PROGRAMNAME);
					}
				}

				$layout.focusTabUI(tabID);
				$layout.refreshTabUI();
				$layout.setMoveButtonStatus($layout.tabUICurrentPageIndex > 0, $layout.tabUICurrentPageIndex > 0, $layout.tabUICurrentPageIndex < $layout.tabUITotalPages, $layout.tabUICurrentPageIndex < $layout.tabUITotalPages);

				if (callback) {
					var isHiddenTab = callback(tabID);
					if (isHiddenTab == null || isHiddenTab == undefined || isHiddenTab === false) {
					}
					else {
						$m.setStyle(tabLI, 'display', 'none');
					}
				}
			});

			tabFrame.style.display = 'block';

			if ($layout.isUILog == true) {
				// 신규 탭 생성시 화면 사용 로그를 기록합니다. 
				// var jsonObject = syn.$w.serviceObject('UseUILogInsert', 'json');
				// 
				// jsonObject.NameValues.push({ 'prop': 'ApplicationID', 'val': syn.$w.SSO.ApplicationID });
				// jsonObject.NameValues.push({ 'prop': 'BusinessID', 'val': syn.$w.SSO.BusinessID });
				// jsonObject.NameValues.push({ 'prop': 'PersonID', 'val': syn.$w.SSO.PersonID });
				// jsonObject.NameValues.push({ 'prop': 'LocaleID', 'val': syn.$w.SSO.LocaleID });
				// jsonObject.NameValues.push({ 'prop': 'UserAgent', 'val': navigator.userAgent });
				// jsonObject.NameValues.push({ 'prop': 'CategoryID', 'val': categoryID });
				// jsonObject.NameValues.push({ 'prop': 'MenuID', 'val': menuID });
				// jsonObject.NameValues.push({ 'prop': 'Url', 'val': url });
				// 
				// syn.$w.basicServiceClient('/RESTFul/Common/', jsonObject);
			}
		},

		focusTreeMenu: function (projectID, itemID, menuID, parentMenuID) {
			// 기존 gnb, lnb 비활성화
			// gnb, lnb 활성화
			var treemenus = $layout.treemenus.filter(function (item) {
				return item.menu.ASSEMBLYNAME == projectID
					&& item.menu.CLASSNAME == itemID
					&& item.menu.PROGRAMID == menuID
					&& item.menu.PARENTID == parentMenuID
			});

			if (treemenus.length > 0) {
				var treemenu = treemenus[0];
				var treenode = treemenu.treenode;

				if (treemenu.parent_menu) {
					var gnbMenu = syn.$l.querySelector('ul#topToolbarMenu > li.active');
					if (gnbMenu) {
						$m.removeClass(gnbMenu, 'active');
					}

					var gnbEl = syn.$l.get('M' + treemenu.parent_menu.PARENTID);
					if (gnbEl) {
						$m.addClass(gnbEl, 'active');
					}

					var hiddenLnbTreeMenus = syn.$l.querySelectorAll('nav[lnbTreeMenu]');
					for (var i = 0; i < hiddenLnbTreeMenus.length; i++) {
						var hiddenLnbTreeMenu = hiddenLnbTreeMenus[i];
						$m.addClass(hiddenLnbTreeMenu, 'hidden');
						hiddenLnbTreeMenu.setAttribute('lnbTreeMenu', 'none');
					}

					var lnbElID = 'lnbTreeMenu_' + treemenu.parent_menu.PARENTID;
					var activeLnbTreeMenu = syn.$l.get(lnbElID);
					if (activeLnbTreeMenu) {
						$m.removeClass(activeLnbTreeMenu, 'hidden');
						hiddenLnbTreeMenu.setAttribute('lnbTreeMenu', 'display');
					}

					var lnbEls = $layout.treeViews.filter(function (item) { return item.div == lnbElID });
					if (lnbEls.length > 0) {
						$layout.treeView = lnbEls[0];
						if (treenode != null) {
							$layout.treeView.selectNode(treenode);
						}

						var curring_menu = treemenu.parent_menu;
						while (curring_menu != null) {
							var parent_treemenus = $layout.treemenus.filter(function (item) {
								return item.menu.ASSEMBLYNAME == curring_menu.ASSEMBLYNAME
									&& item.menu.CLASSNAME == curring_menu.CLASSNAME
									&& item.menu.PROGRAMID == curring_menu.PROGRAMID
									&& item.menu.PARENTID == curring_menu.PARENTID
							});

							if (parent_treemenus.length > 0) {
								var parent_treemenu = parent_treemenus[0];
								var parent_treenode = parent_treemenu.treenode;

								if (parent_treenode) {
									if (parent_treenode.expanded == true) {
										break;
									}
									else {
										parent_treenode.expandNode();
										curring_menu = parent_treemenu.parent_menu;
									}
								}
								else {
									break;
								}
							}
						}
					}
				}
			}
		},

		layout_ApplicationButtonCommand: function (pageScript, actionID) {
			if (pageScript && pageScript.frameEvent) {
				if (pageScript.$grid && pageScript.$grid.gridControls) {
					for (var i = 0; i < pageScript.$grid.gridControls.length; i++) {
						var gridControl = pageScript.$grid.gridControls[i];
						gridControl.value.passSelectCellEvent = true;
						var value = gridControl.value;
						if (value) {
							gridControl.hot.selectCell(value.previousRow, value.previousCol);
						}
						delete gridControl.value.passSelectCellEvent;
					}
				}

				pageScript.frameEvent('buttonCommand', {
					actionID: actionID
				});
			}
		},

		layout_VisibleChanged: function (pageScript, isVisible) {
			if (pageScript && pageScript.pageVisible) {
				pageScript.pageVisible(isVisible);
			}
		},

		layout_UIStoregeChanging: function (pageScript, sourceTabID, storageKey) {
			if (pageScript && pageScript.frameEvent) {
				pageScript.frameEvent('storegeChanging', {
					sourceTabID: sourceTabID,
					storageKey: storageKey
				});
			}
		},

		layout_UIResizing: function (pageScript) {
			if (pageScript && pageScript.pageResizing) {
				var dimension = {
					windowWidth: $MainFrame.windowWidth,
					windowHeight: $MainFrame.windowHeight,
					tabWidth: $MainFrame.tabFrameSize.width,
					tabHeight: $MainFrame.tabFrameSize.height
				};

				pageScript.pageResizing(dimension);
			}
		},

		layout_UIClosed: function (pageScript) {
			var result = true;
			if (pageScript && pageScript.pageClosed) {
				var isClosed = pageScript.pageClosed();
				result = $reflection.isBoolean(isClosed) ? isClosed : true;
				isClosed = null;
			}

			return result;
		},

		layout_SessionDestroyed: function (pageScript) {
			if (pageScript && pageScript.frameEvent) {
				pageScript.frameEvent('sessionDestroy');
			}
		}
	});
	window.$layout = window.$layout || $layout;
})(window);