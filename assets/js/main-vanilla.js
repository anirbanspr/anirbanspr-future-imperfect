/*
	Future Imperfect by HTML5 UP - Vanilla JS Version
	html5up.net | @ajlkn
	jQuery removed and rewritten in vanilla JavaScript
*/

(function() {
	'use strict';

	const $window = window;
	const $body = document.body;
	const $menu = document.getElementById('menu');
	const $sidebar = document.getElementById('sidebar');
	const $main = document.getElementById('main');

	// Breakpoints configuration
	const breakpointConfig = {
		xlarge:   [ 1281,  1680 ],
		large:    [ 981,   1280 ],
		medium:   [ 737,   980  ],
		small:    [ 481,   736  ],
		xsmall:   [ null,  480  ]
	};

	// Simple breakpoint handler
	const breakpoints = {
		active: null,

		list: function() {
			return breakpointConfig;
		},

		is: function(query) {
			const width = window.innerWidth;
			const bp = breakpointConfig[query];
			if (!bp) return false;

			const min = bp[0];
			const max = bp[1];

			if (min === null) return width <= max;
			if (max === null) return width >= min;
			return width >= min && width <= max;
		},

		on: function(query, callback) {
			const checkBreakpoint = () => {
				const width = window.innerWidth;
				let matches = false;

				if (query.startsWith('<=')) {
					const bp = query.substring(2);
					const maxWidth = breakpointConfig[bp] ? breakpointConfig[bp][1] : null;
					matches = maxWidth === null ? true : width <= maxWidth;
				} else if (query.startsWith('>')) {
					const bp = query.substring(1);
					const minWidth = breakpointConfig[bp] ? breakpointConfig[bp][1] : null;
					matches = minWidth !== null && width > minWidth;
				} else {
					matches = this.is(query);
				}

				if (matches && this.active !== query) {
					this.active = query;
					callback();
				}
			};

			window.addEventListener('resize', checkBreakpoint);
			checkBreakpoint(); // Initial check
		}
	};

	// Play initial animations on page load
	window.addEventListener('load', function() {
		setTimeout(function() {
			$body.classList.remove('is-preload');
		}, 100);
	});

	// Menu panel functionality
	if ($menu) {
		// Move menu to body
		$body.appendChild($menu);

		// Panel configuration
		const panelConfig = {
			delay: 500,
			hideOnClick: true,
			hideOnSwipe: true,
			resetScroll: true,
			resetForms: true,
			side: 'right',
			target: $body,
			visibleClass: 'is-menu-visible'
		};

		// Hide panel function
		const hidePanel = function(event) {
			if (!panelConfig.target.classList.contains(panelConfig.visibleClass))
				return;

			if (event) {
				event.preventDefault();
				event.stopPropagation();
			}

			panelConfig.target.classList.remove(panelConfig.visibleClass);

			setTimeout(function() {
				if (panelConfig.resetScroll)
					$menu.scrollTop = 0;

				if (panelConfig.resetForms) {
					const forms = $menu.querySelectorAll('form');
					forms.forEach(form => form.reset());
				}
			}, panelConfig.delay);
		};

		// Vendor fixes
		$menu.style.msOverflowStyle = '-ms-autohiding-scrollbar';
		$menu.style.webkitOverflowScrolling = 'touch';

		// Hide on click
		if (panelConfig.hideOnClick) {
			const links = $menu.querySelectorAll('a');
			links.forEach(link => {
				link.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
			});

			$menu.addEventListener('click', function(event) {
				const target = event.target.closest('a');
				if (!target) return;

				const href = target.getAttribute('href');
				const targetAttr = target.getAttribute('target');

				if (!href || href === '#' || href === '' || href === '#menu')
					return;

				event.preventDefault();
				event.stopPropagation();

				hidePanel();

				setTimeout(function() {
					if (targetAttr === '_blank')
						window.open(href);
					else
						window.location.href = href;
				}, panelConfig.delay + 10);
			});
		}

		// Touch events for swipe
		let touchPosX = null;
		let touchPosY = null;

		$menu.addEventListener('touchstart', function(event) {
			touchPosX = event.touches[0].pageX;
			touchPosY = event.touches[0].pageY;
		});

		$menu.addEventListener('touchmove', function(event) {
			if (touchPosX === null || touchPosY === null)
				return;

			const diffX = touchPosX - event.touches[0].pageX;
			const diffY = touchPosY - event.touches[0].pageY;

			// Hide on swipe
			if (panelConfig.hideOnSwipe) {
				const boundary = 20;
				const delta = 50;
				let result = false;

				if (panelConfig.side === 'right') {
					result = (diffY < boundary && diffY > -boundary) && (diffX < -delta);
				}

				if (result) {
					touchPosX = null;
					touchPosY = null;
					hidePanel();
					return false;
				}
			}
		});

		// Prevent event bubbling
		$menu.addEventListener('click', function(event) {
			event.stopPropagation();
		});
		$menu.addEventListener('touchend', function(event) {
			event.stopPropagation();
		});

		// Hide panel on body click
		$body.addEventListener('click', function(event) {
			hidePanel(event);
		});
		$body.addEventListener('touchend', function(event) {
			hidePanel(event);
		});

		// Toggle menu
		const menuToggles = document.querySelectorAll('a[href="#menu"]');
		menuToggles.forEach(toggle => {
			toggle.addEventListener('click', function(event) {
				event.preventDefault();
				event.stopPropagation();
				panelConfig.target.classList.toggle(panelConfig.visibleClass);
			});
		});
	}

	// Intro section responsive behavior
	const $intro = document.getElementById('intro');
	if ($intro && $main && $sidebar) {
		// Move to main on <=large, back to sidebar on >large
		breakpoints.on('<=large', function() {
			if ($intro.parentNode !== $main) {
				$main.insertBefore($intro, $main.firstChild);
			}
		});

		breakpoints.on('>large', function() {
			if ($intro.parentNode !== $sidebar) {
				$sidebar.insertBefore($intro, $sidebar.firstChild);
			}
		});
	}

})();
