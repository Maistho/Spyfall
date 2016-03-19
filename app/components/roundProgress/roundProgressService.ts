import {Injectable} from 'angular2/core';

@Injectable()
export class RoundProgressService {
	isSupported: boolean;
	constructor() {

		// credits to http://modernizr.com/ for the feature test
		this.isSupported = !!(document.createElementNS && document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect);
	}

	// fixes issues if the document has a <base> element
	resolveColor(value) {
		let base = document.head.querySelector('base');

		if (base && base.getAttribute('href')) {
			var hashIndex = value.indexOf('#');
			if(hashIndex > -1 && value.indexOf('url') > -1){
				return value.slice(0, hashIndex) + window.location.href + value.slice(hashIndex);
			}
		}
		return value;
	}


	// utility function
	private polarToCartesian(centerX, centerY, radius, angle) {
		return {
			x: centerX + (radius * Math.cos(angle)),
			y: centerY + (radius * Math.sin(angle))
		};
	}

	// deals with floats passed as strings
	toNumber(value) {
		return typeof(value)==='number' ? value : parseFloat((value + '').replace(',', '.'));
	}

	// credit to http://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
	updateState(val, total, radius, ring: SVGPathElement, size) {

		let center = {x: size / 2, y: size / 2};
		var value       = val > 0 ? Math.min(val, total) : 0;
		let angle = Math.PI * 2 * (value / total);
			let path = [["M", center.x, center.y - radius]];
			if (angle > Math.PI) {
				path.push([
						'A', radius, radius, 0, 0, 1,
						center.x,
						center.y + radius
				]);
			}
			path.push([
				'A', radius, radius, 0, 0, 1,
				center.x + Math.cos(angle - (Math.PI / 2)) * radius,
				center.y + Math.sin(angle - (Math.PI / 2)) * radius
			]);

		return ring.setAttribute('d', path.map((e) => {
			return e[0]	+ e.slice(1).join(',')
		}).join(' '));
	}

	isDirective(el) {
		if(el && el.length){
			return (typeof el.attr('round-progress') !== 'undefined' || el[0].nodeName.toLowerCase() === 'round-progress');
		}

		return false;
	}

	// Easing functions by Robert Penner
	// Source: http://www.robertpenner.com/easing/
	// License: http://www.robertpenner.com/easing_terms_of_use.html

	animations = {

		// t: is the current time (or position) of the tween. This can be seconds or frames, steps, seconds, ms, whatever – as long as the unit is the same as is used for the total time.
		// b: is the beginning value of the property.
		// c: is the change between the beginning and destination value of the property.
		// d: is the total time of the tween.
		// jshint eqeqeq: false, -W041: true

		linearEase: function(t, b, c, d) {
			return c * t / d + b;
		},

		easeInQuad: function (t, b, c, d) {
			return c*(t/=d)*t + b;
		},

		easeOutQuad: function (t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		},

		easeInOutQuad: function (t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		},

		easeInCubic: function (t, b, c, d) {
			return c*(t/=d)*t*t + b;
		},

		easeOutCubic: function (t, b, c, d) {
			return c*((t=t/d-1)*t*t + 1) + b;
		},

		easeInOutCubic: function (t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t + b;
			return c/2*((t-=2)*t*t + 2) + b;
		},

		easeInQuart: function (t, b, c, d) {
			return c*(t/=d)*t*t*t + b;
		},

		easeOutQuart: function (t, b, c, d) {
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		},

		easeInOutQuart: function (t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
			return -c/2 * ((t-=2)*t*t*t - 2) + b;
		},

		easeInQuint: function (t, b, c, d) {
			return c*(t/=d)*t*t*t*t + b;
		},

		easeOutQuint: function (t, b, c, d) {
			return c*((t=t/d-1)*t*t*t*t + 1) + b;
		},

		easeInOutQuint: function (t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
			return c/2*((t-=2)*t*t*t*t + 2) + b;
		},

		easeInSine: function (t, b, c, d) {
			return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
		},

		easeOutSine: function (t, b, c, d) {
			return c * Math.sin(t/d * (Math.PI/2)) + b;
		},

		easeInOutSine: function (t, b, c, d) {
			return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
		},

		easeInExpo: function (t, b, c, d) {
			return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
		},

		easeOutExpo: function (t, b, c, d) {
			return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
		},

		easeInOutExpo: function (t, b, c, d) {
			if (t==0) return b;
			if (t==d) return b+c;
			if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
			return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
		},

		easeInCirc: function (t, b, c, d) {
			return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
		},

		easeOutCirc: function (t, b, c, d) {
			return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
		},

		easeInOutCirc: function (t, b, c, d) {
			if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
			return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
		},

		easeInElastic: function (t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*0.3;
			if (a < Math.abs(c)) { a=c; s=p/4; }
			else s = p/(2*Math.PI) * Math.asin (c/a);
			return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		},

		easeOutElastic: function (t, b, c, d) {
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*0.3;
			if (a < Math.abs(c)) { a=c; s=p/4; }
			else s = p/(2*Math.PI) * Math.asin (c/a);
			return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
		},

		easeInOutElastic: function (t, b, c, d) {
			// jshint eqeqeq: false, -W041: true
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(0.3*1.5);
			if (a < Math.abs(c)) { a=c; s=p/4; }
			else s = p/(2*Math.PI) * Math.asin (c/a);
			if (t < 1) return -0.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
		},

		easeInBack: function (t, b, c, d, s) {
			// jshint eqeqeq: false, -W041: true
			if (s == undefined) s = 1.70158;
			return c*(t/=d)*t*((s+1)*t - s) + b;
		},

		easeOutBack: function (t, b, c, d, s) {
			// jshint eqeqeq: false, -W041: true
			if (s == undefined) s = 1.70158;
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		},

		easeInOutBack: function (t, b, c, d, s) {
			// jshint eqeqeq: false, -W041: true
			if (s == undefined) s = 1.70158;
			if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		},

		easeInBounce: (t, b, c, d) => {
			return c - this.animations.easeOutBounce (d-t, 0, c, d) + b;
		},

		easeOutBounce: function (t, b, c, d) {
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
			} else {
				return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
			}
		},

		easeInOutBounce: (t, b, c, d) => {
			if (t < d/2) return this.animations.easeInBounce (t*2, 0, c, d) * 0.5 + b;
			return this.animations.easeOutBounce (t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
		}
	}
}