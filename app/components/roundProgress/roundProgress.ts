import {Component, ElementRef, Input} from 'angular2/core';

import {RoundProgressService} from './roundProgressService';

interface RoundProgressOptions {
	max: number,
	semi?: boolean,
	rounded: boolean,
	responsive: boolean,
	clockwise: boolean,
	radius: number,
	color: string,
	bgcolor: string,
	stroke: number,
	duration: number,
	animation: string,
	animationDelay?: number,
	offset: number|"string",
	onRender?(end: number, options: any, element: Element): void
};

@Component({
	selector: 'round-progress',
	template: `<svg class="round-progress" xmlns="http://www.w3.org/2000/svg">
	<circle fill="none"/>
	<path fill="none"/>
	<g ng-transclude></g>
	</svg>`,
	providers: [RoundProgressService]
})
export class RoundProgress{
	options: RoundProgressOptions = {
		max:            50,
		rounded:        false,
		responsive:     true,
		clockwise:      true,
		radius:         100,
		color:          "#45ccce",
		bgcolor:        "#eaeaea",
		stroke:         15,
		duration:       800,
		animation:      "easeOutCubic",
		offset:         0
};

ring: SVGPathElement;
svg: SVGElement;
background: SVGCircleElement;
lastAnimationId: number;
lastTimeoutId: number;
element: HTMLElement;
isNested: boolean;
@Input() current: number;
@Input() max: number;
constructor(myElement: ElementRef, private service: RoundProgressService) {
	this.element = myElement.nativeElement;
	this.isNested    = !this.element.classList.contains('round-progress-wrapper');
	this.svg         = <SVGElement>(this.isNested ? this.element : this.element.querySelector('svg'));
	this.ring        = <SVGPathElement>this.svg.querySelector('path');
	this.background  = <SVGCircleElement>this.svg.querySelector('circle');
	this.lastAnimationId = 0;
	this.renderCircle();
	this.renderRing();
}

ngOnChanges() {
	this.renderRing();
}

renderCircle() {
	var isSemicircle     = this.options.semi;
	var responsive       = this.options.responsive;
	var radius           = +this.options.radius || 0;
	var stroke           = +this.options.stroke;
	var diameter         = radius*2;
	var backgroundSize   = radius - (stroke/2);

	(<HTMLElement><any>this.svg).style.top = '0';
	(<HTMLElement><any>this.svg).style.left = '0';
	(<HTMLElement><any>this.svg).style.position = responsive ? "absolute" : "static";
	(<HTMLElement><any>this.svg).style.width = responsive ? "100%" : (diameter + "px");
	(<HTMLElement><any>this.svg).style.height = responsive ? "100%" : (isSemicircle ? radius : diameter) + "px";
	(<HTMLElement><any>this.svg).style.overflow = 'hidden';

	// when nested, the element shouldn't define its own viewBox
	if(!this.isNested){
		// note that we can't use .attr, because if jQuery is loaded,
		// it lowercases all attributes and viewBox is case-sensitive
		this.svg[0].setAttribute('viewBox', '0 0 ' + diameter + ' ' + (isSemicircle ? radius : diameter));
	}

	this.element.style.width = responsive ? "100%" : "auto";
	this.element.style.position = "relative";
	this.element.style.paddingBottom = responsive ? (isSemicircle ? "50%" : "100%") : '0';

	this.ring.style.stroke = this.service.resolveColor(this.options.color);
	this.ring.style.strokeWidth = "" + stroke;
	this.ring.style.strokeLinecap = this.options.rounded ? 'round' : 'butt';

	if(isSemicircle){
		this.ring.setAttribute("transform", this.options.clockwise ? "translate("+ 0 +","+ diameter +") rotate(-90)" : "translate("+ diameter +", "+ diameter +") rotate(90) scale(-1, 1)");
	}else{
		this.ring.setAttribute("transform", this.options.clockwise ? "" : "scale(-1, 1) translate("+ (-diameter) +" 0)");
	}

	this.background.cx.baseVal.value = radius;
	this.background.cy.baseVal.value = radius;
	this.background.r.baseVal.value = backgroundSize >= 0 ? backgroundSize : 0;
	this.background.style.stroke = this.service.resolveColor(this.options.bgcolor);
	this.background.style.strokeWidth = String(stroke);
}

private renderRing() {
	var max                 = this.service.toNumber(this.max || 0);
	var end                 = this.current > 0 ? Math.min(this.current, max) : 0;
	var start               = 0;
	var radius              = this.options.radius;

	var circleSize          = radius - (this.options.stroke/2);
	var elementSize         = radius*2;

	var doAnimation = () => {
		this.service.updateState(end, max, circleSize, this.ring, elementSize);
		if(this.options.onRender){
			this.options.onRender(end, this.options, this.element);
		}
	}
		doAnimation();
}
}
