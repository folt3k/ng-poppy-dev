import { InjectionToken, Component, ViewEncapsulation, Inject, ViewChild, ViewContainerRef, HostBinding, Injector, ɵɵdefineInjectable, ɵɵinject, ComponentFactoryResolver, ApplicationRef, Injectable, NgZone, EventEmitter, Directive, ElementRef, Input, Output, ChangeDetectionStrategy, ContentChildren, TemplateRef, ChangeDetectorRef, NgModule, HostListener, forwardRef, Optional, Host, SkipSelf, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent, merge, Subject, timer } from 'rxjs';
import { tap, takeUntil, debounceTime, skipUntil, switchMap, take, map } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlContainer } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const POPOVER_CONFIG = new InjectionToken('popover-config');

const LAYER_CONFIG = new InjectionToken('layer-token');

class LayerComponent {
    constructor(config) {
        this.config = config;
    }
    get overlay() {
        return this.config.overlay;
    }
}
LayerComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'poppy-layer',
                template: "<ng-container #container></ng-container>\n",
                encapsulation: ViewEncapsulation.None,
                styles: ["poppy-layer{bottom:0;display:block;left:0;position:fixed;right:0;top:0;visibility:hidden;z-index:10000}.poppy-layer--overlay{background:rgba(0,0,0,.42);overflow-y:auto;visibility:visible}"]
            },] }
];
LayerComponent.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [LAYER_CONFIG,] }] }
];
LayerComponent.propDecorators = {
    container: [{ type: ViewChild, args: ['container', { read: ViewContainerRef },] }],
    overlay: [{ type: HostBinding, args: ['class.poppy-layer--overlay',] }]
};

class LayerService {
    constructor(componentFactoryResolver, appRef) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.appRef = appRef;
        this.activeLayers = [];
    }
    appendToBody(component, options, injector) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(LayerComponent);
        const componentRef = componentFactory.create(Injector.create([
            {
                provide: LAYER_CONFIG,
                useValue: options,
            },
        ]));
        componentRef.changeDetectorRef.detectChanges();
        const appendComponentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        const appendComponentRef = componentRef.instance.container.createComponent(appendComponentFactory, null, injector);
        this.activeLayers.push({
            ref: componentRef,
            appendComponentRef,
            options,
        });
        this.appRef.attachView(componentRef.hostView);
        const domElem = componentRef.hostView.rootNodes[0];
        document.body.appendChild(domElem);
        return appendComponentRef;
    }
    removeFromBody(componentRef) {
        const layers = this.activeLayers.filter((layer) => layer.appendComponentRef === componentRef);
        layers.forEach((layer) => {
            const delayClose = layer.options.delayClose;
            if (delayClose !== null) {
                setTimeout(() => {
                    this.removeLayer(layer);
                }, delayClose);
            }
            else {
                this.removeLayer(layer);
            }
        });
        this.activeLayers = this.activeLayers.filter((layer) => layer.appendComponentRef !== componentRef);
    }
    removeLayer(layer) {
        this.appRef.detachView(layer.ref.hostView);
        layer.ref.changeDetectorRef.detectChanges();
        layer.ref.destroy();
    }
}
LayerService.ɵprov = ɵɵdefineInjectable({ factory: function LayerService_Factory() { return new LayerService(ɵɵinject(ComponentFactoryResolver), ɵɵinject(ApplicationRef)); }, token: LayerService, providedIn: "root" });
LayerService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
LayerService.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: ApplicationRef }
];

class ActivePopover {
    constructor(popoverRef, parentPopoverRef, superParentPopoverRef, directiveRef, type, deepLevel) {
        this.popoverRef = popoverRef;
        this.parentPopoverRef = parentPopoverRef;
        this.superParentPopoverRef = superParentPopoverRef;
        this.directiveRef = directiveRef;
        this.type = type;
        this.deepLevel = deepLevel;
        this.isMenuParent = type === 'menu';
        this.isSubmenu = type === 'submenu';
        this.isSuperparent = this.popoverRef === this.superParentPopoverRef;
    }
}

class LayerAppendOptions {
    constructor(options = {}) {
        this.delayClose = Number.isInteger(options.delayClose) ? options.delayClose : null;
        this.overlay = !!options.overlay;
    }
}

class PopoverEventsService {
    constructor(ngZone) {
        this.ngZone = ngZone;
        this.registeredEvents = [];
    }
    register(type, activePopover, callback) {
        let sub;
        this.ngZone.runOutsideAngular(() => {
            const obs = this.getEventObservable(type);
            sub = obs.subscribe((event) => {
                callback(event);
            });
        });
        this.registeredEvents.push({ popover: activePopover, type, sub, callback });
    }
    unregister(type, activePopover) {
        this.registeredEvents
            .filter((event) => event.type === type)
            .forEach((event) => {
            if (event.popover === activePopover) {
                event.sub.unsubscribe();
            }
        });
        this.registeredEvents = this.registeredEvents.filter((event) => event.type === type ? event.popover !== activePopover : true);
    }
    subscribe(type, popover) {
        const obs = this.getEventObservable(type);
        this.registeredEvents
            .filter((event) => { var _a; return event.type === type && event.popover === popover && ((_a = event.sub) === null || _a === void 0 ? void 0 : _a.closed); })
            .forEach((event) => {
            event.sub = obs.subscribe((e) => event.callback(e));
        });
    }
    unsubscribe(type, popover) {
        this.registeredEvents
            .filter((event) => event.type === type && event.popover === popover)
            .forEach((event) => {
            event.sub.unsubscribe();
        });
    }
    getEventObservable(type) {
        switch (type) {
            case 'click-outside':
                return merge(fromEvent(document, 'click'), fromEvent(document, 'contextmenu'))
                    .pipe();
            case 'capture-scroll':
                return fromEvent(document, 'scroll').pipe(tap(() => {
                    // console.log('Capturing scroll event..');
                }));
            case 'resize':
                return fromEvent(window, 'resize').pipe(tap(() => {
                    // console.log('Resize event..');
                }));
        }
    }
}
PopoverEventsService.ɵprov = ɵɵdefineInjectable({ factory: function PopoverEventsService_Factory() { return new PopoverEventsService(ɵɵinject(NgZone)); }, token: PopoverEventsService, providedIn: "root" });
PopoverEventsService.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
PopoverEventsService.ctorParameters = () => [
    { type: NgZone }
];

class PopoverService {
    constructor(layerService, eventsService) {
        this.layerService = layerService;
        this.eventsService = eventsService;
        this.activePopovers = [];
    }
    append(injector, directive, options, parentPopoverRef) {
        const existedPopover = this.activePopovers.find((popover) => popover.directiveRef === directive);
        if (options.closeOnTriggerAgain && existedPopover) {
            this.remove(existedPopover.popoverRef);
            return existedPopover.popoverRef;
        }
        else {
            return this.appendToBody(injector, directive, options, parentPopoverRef);
        }
    }
    remove(popoverRef) {
        const active = this.activePopovers.find((p) => p.popoverRef === popoverRef);
        if (active) {
            if (active.directiveRef) {
                active.directiveRef.popoverComponentRef = null;
                active.directiveRef.afterClose.emit();
            }
            active.popoverRef.destroy();
            this.layerService.removeFromBody(active.popoverRef);
            this.eventsService.unregister('click-outside', active);
            this.eventsService.unregister('capture-scroll', active);
            this.eventsService.unregister('resize', active);
            this.activePopovers = this.activePopovers.filter((a) => a.popoverRef !== popoverRef);
        }
    }
    removeByNativeElementRef(element) {
        const activePopover = this.activePopovers.find((active) => active.popoverRef.location.nativeElement === element);
        if (activePopover) {
            this.remove(activePopover.popoverRef);
        }
    }
    getActive(popoverRef) {
        return this.activePopovers.find((active) => active.popoverRef === popoverRef);
    }
    isPopoverSubmenuExits(precendingRef, parentRef) {
        const precendingActivePopover = this.getActive(precendingRef);
        if (!precendingActivePopover || (precendingActivePopover && !precendingActivePopover.deepLevel)) {
            return false;
        }
        return !!this.activePopovers.find((popover) => popover.parentPopoverRef === parentRef && popover.deepLevel === precendingActivePopover.deepLevel + 1);
    }
    removeAllNestedPopovers(popoverRef) {
        const activePopover = this.getActive(popoverRef);
        if (activePopover) {
            this.activePopovers
                .filter((popover) => popover.deepLevel > activePopover.deepLevel)
                .forEach((popover) => {
                this.remove(popover.popoverRef);
            });
        }
    }
    removeMenu(componentRef) {
        this.activePopovers
            .filter((popover) => popover.parentPopoverRef === componentRef || popover.popoverRef === componentRef)
            .forEach((popover) => {
            this.remove(popover.popoverRef);
        });
    }
    subscribeToClickOutsideEventForParentPopover(componentRef) {
        const currentPopover = this.getActive(componentRef);
        if (currentPopover) {
            const parentPopover = this.activePopovers.find((popover) => popover.superParentPopoverRef === currentPopover.superParentPopoverRef &&
                popover.deepLevel === currentPopover.deepLevel - 1);
            if (parentPopover) {
                setTimeout(() => {
                    this.eventsService.subscribe('click-outside', parentPopover);
                });
            }
        }
    }
    appendToBody(injector, directive, options, parentPopoverRef) {
        const layerOptions = new LayerAppendOptions({ delayClose: options.delayClose });
        const popover = this.layerService.appendToBody(PopoverContentComponent, layerOptions, injector);
        const { superparent, deepLevel } = this.prepareSuperparentAndDeepLevel(popover, parentPopoverRef, directive);
        const newPopover = new ActivePopover(popover, parentPopoverRef, superparent, directive, options.type, deepLevel);
        popover.instance.componentRef = popover;
        popover.instance.parentPopoverRef = popover;
        popover.changeDetectorRef.detectChanges();
        this.activePopovers.push(newPopover);
        if (newPopover.directiveRef) {
            newPopover.directiveRef.afterShow.emit();
        }
        if (this.canRegisterScrollCaptureEvent(newPopover, options)) {
            this.registerScrollCaptureEvent(newPopover, options);
        }
        if (this.canRegisterResizeEvent(newPopover, options)) {
            this.registerResizeEvent(newPopover, options);
        }
        return popover;
    }
    prepareSuperparentAndDeepLevel(popover, parentPopover, directive) {
        let deepLevel = 0;
        let superparent = null;
        if (directive) {
            const parentPopover = this.activePopovers.find((p) => {
                return p.popoverRef.instance.element.nativeElement.contains(directive.hostElement.nativeElement);
            });
            if (!parentPopover) {
                superparent = popover;
                deepLevel = 0;
            }
            else {
                superparent = parentPopover.superParentPopoverRef || parentPopover.popoverRef;
                deepLevel = parentPopover.deepLevel + 1;
            }
        }
        else {
            const closestParent = this.activePopovers.find((p) => p.popoverRef === parentPopover);
            if (closestParent) {
                const popoverGroup = this.activePopovers.filter((p) => p.superParentPopoverRef === closestParent.superParentPopoverRef);
                superparent = closestParent.superParentPopoverRef;
                deepLevel = popoverGroup[popoverGroup.length - 1].deepLevel + 1;
            }
        }
        return {
            deepLevel,
            superparent,
        };
    }
    canRegisterScrollCaptureEvent(popover, options) {
        const { triggeredBy, type, closeOnScroll } = options;
        return (popover.directiveRef &&
            popover.deepLevel === 0 &&
            triggeredBy !== 'hover' &&
            type !== 'submenu' &&
            closeOnScroll);
    }
    canRegisterResizeEvent(popover, options) {
        const { triggeredBy, type } = options;
        return popover.directiveRef && popover.deepLevel === 0 && triggeredBy !== 'hover' && type !== 'submenu';
    }
    registerResizeEvent(popover, options) {
        this.eventsService.register('resize', popover, () => {
            if (options.type === 'context') {
                this.hideGroup(popover);
            }
            else {
                this.updateGroupPosition(popover);
            }
        });
    }
    registerScrollCaptureEvent(popover, options) {
        this.eventsService.register('capture-scroll', popover, (event) => {
            const captured = popover.directiveRef.hostElement.nativeElement === event.target ||
                event.target.contains(popover.directiveRef.hostElement.nativeElement);
            if ((captured && options.hideOnScroll) || options.type === 'context') {
                this.hideGroup(popover);
            }
            if (captured && !options.hideOnScroll && options.type !== 'context') {
                this.updateGroupPosition(popover);
            }
        });
    }
    hideGroup(popover) {
        this.activePopovers.forEach((active) => {
            if (active.superParentPopoverRef === popover.superParentPopoverRef) {
                this.remove(active.popoverRef);
            }
        });
    }
    updateGroupPosition(popover) {
        this.activePopovers
            .filter((active) => active.superParentPopoverRef === popover.popoverRef)
            .forEach((active) => {
            if (active.popoverRef.instance.componentStyles) {
                active.popoverRef.instance.componentStyles.update();
            }
        });
    }
}
PopoverService.ɵprov = ɵɵdefineInjectable({ factory: function PopoverService_Factory() { return new PopoverService(ɵɵinject(LayerService), ɵɵinject(PopoverEventsService)); }, token: PopoverService, providedIn: "root" });
PopoverService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
PopoverService.ctorParameters = () => [
    { type: LayerService },
    { type: PopoverEventsService }
];

class PopoverAppendOptions {
    constructor(options) {
        this.type = options.type;
        this.triggeredBy = options.triggeredBy || 'click';
        this.closeOnScroll = options.closeOnScroll !== undefined ? options.closeOnScroll : true;
        this.delayClose = Number.isInteger(options.delayClose) ? options.delayClose : null;
        this.closeOnTriggerAgain = !!options.closeOnTriggerAgain;
        this.hideOnScroll = !!options.hideOnScroll;
    }
}

const fadeInAnimation = trigger('fadeIn', [
    state('open', style({
        transform: 'translateY(0px)',
        opacity: 1,
    })),
    state('close', style({
        transform: 'translateY(-6px)',
        opacity: 0.5,
    })),
    transition('close => open', [animate('0.15s')]),
]);

const SPACE_FROM_BOTTOM = 20;
const SPACE_FROM_TOP = 10;
const POSITION_MEASURE_UNIT = 'px';
class PopoverStyles {
    constructor(popover) {
        this.initHostElementWidth = 0;
        this.popover = popover;
        this.hostElement = popover.element;
        this.config = popover.popoverConfig;
        this.type = this.config.type;
    }
    init() {
        const hostBounds = this.config.bounds;
        this.hostElement.nativeElement.style.zIndex = 10000;
        this.setPositionStyle('left', 0);
        this.setPositionStyle('top', +hostBounds.top + hostBounds.height + SPACE_FROM_TOP);
        if (!this.isContextType && !this.isSubmenuType) {
            this.hostElement.nativeElement.style.minWidth = hostBounds.width + 'px';
        }
        if (this.isContextType) {
            this.setPositionStyle('top', +hostBounds.top);
            this.hostElement.nativeElement.style.minWidth = 0;
        }
        if (this.isSubmenuType) {
            const triggerItem = this.config.submenuTriggeredItem.element.nativeElement;
            const triggerBounds = triggerItem.getBoundingClientRect();
            this.hostElement.nativeElement.style.minWidth = 0;
            this.setPositionStyle('top', triggerBounds.top);
        }
        if (this.canAssignPadding) {
            const padding = this.isTooltip ? '8px 12px' : '15px 25px';
            this.popover.popoverWrapperEl.nativeElement.style.padding = padding;
        }
        this.hostElement.nativeElement.style.visibility = 'hidden';
        setTimeout(() => {
            this.initHostElementWidth = this.hostElement.nativeElement.offsetWidth;
            this.hostElement.nativeElement.style.minWidth = this.initHostElementWidth + 'px';
        });
    }
    update() {
        this.setLeftPosition();
        this.setTopPosition();
        this.setWidth();
        this.hostElement.nativeElement.style.visibility = 'visible';
    }
    setTopPosition() {
        const windowHeight = window.innerHeight;
        const elementHeight = this.hostElement.nativeElement.getBoundingClientRect().height;
        const triggerBounds = this.config.triggerElement.nativeElement.getBoundingClientRect();
        if (this.config.triggerDirective) {
            const hostTopPosition = this.config.type === 'context' ? this.config.bounds.top : triggerBounds.top + triggerBounds.height;
            const isBelowWindowCenterHeight = elementHeight >= windowHeight - hostTopPosition - SPACE_FROM_BOTTOM;
            if (isBelowWindowCenterHeight) {
                if (this.config.type === 'context') {
                    this.setPositionStyle('top', +this.config.bounds.top - elementHeight + SPACE_FROM_TOP);
                }
                else {
                    const newPos = triggerBounds.top - elementHeight - SPACE_FROM_TOP;
                    if (newPos > 0) {
                        this.setPositionStyle('top', triggerBounds.top - elementHeight - SPACE_FROM_TOP);
                    }
                    else {
                        this.hostElement.nativeElement.style.height =
                            windowHeight - hostTopPosition - SPACE_FROM_BOTTOM + POSITION_MEASURE_UNIT;
                        this.hostElement.nativeElement.querySelector('.popover-content').style.height =
                            windowHeight - hostTopPosition - SPACE_FROM_BOTTOM + POSITION_MEASURE_UNIT;
                    }
                }
            }
            else {
                if (this.config.type === 'context') {
                    this.setPositionStyle('top', +this.config.bounds.top + SPACE_FROM_TOP);
                }
                else {
                    this.setPositionStyle('top', triggerBounds.top + triggerBounds.height + SPACE_FROM_TOP);
                }
            }
        }
        if (!this.config.triggerDirective) {
            const hostBounds = this.config.submenuTriggeredItem.element.nativeElement.getBoundingClientRect();
            const hostPosition = hostBounds.top;
            if (elementHeight >= windowHeight - hostPosition - SPACE_FROM_BOTTOM) {
                const diff = elementHeight - (windowHeight - hostPosition);
                this.setPositionStyle('top', hostPosition - diff - SPACE_FROM_BOTTOM);
            }
            else {
                this.setPositionStyle('top', hostPosition);
            }
        }
    }
    setLeftPosition() {
        const windowWidth = window.innerWidth;
        const elementWidth = this.hostElement.nativeElement.getBoundingClientRect().width;
        const hostBounds = this.config.triggerElement.nativeElement.getBoundingClientRect();
        if (this.isContextType) {
            if (+this.config.bounds.left >= windowWidth / 2) {
                this.setPositionStyle('left', +this.config.bounds.left - elementWidth);
            }
            else {
                this.setPositionStyle('left', this.defaultLeftPosition);
            }
        }
        else if (this.config.triggerDirective) {
            if (hostBounds.left >= windowWidth / 2) {
                this.setPositionStyle('left', hostBounds.right - elementWidth);
            }
            else {
                this.setPositionStyle('left', hostBounds.left);
            }
        }
        else {
            const hostBounds = this.config.submenuTriggeredItem.element.nativeElement.getBoundingClientRect();
            if (elementWidth > windowWidth - hostBounds.right) {
                this.setPositionStyle('left', hostBounds.left - this.initHostElementWidth);
            }
            else {
                this.setPositionStyle('left', hostBounds.right);
            }
        }
    }
    setWidth() {
        const triggerBounds = this.config.triggerElement.nativeElement.getBoundingClientRect();
        if (!this.isContextType && !this.isSubmenuType) {
            const windowWidth = window.innerWidth;
            const hostElBounds = this.hostElement.nativeElement.getBoundingClientRect();
            this.hostElement.nativeElement.style.minWidth = triggerBounds.width + POSITION_MEASURE_UNIT;
            if (!this.isMenuType) {
                if (hostElBounds.left < 0 || hostElBounds.right > windowWidth) {
                    this.hostElement.nativeElement.style.width = windowWidth - 30 + POSITION_MEASURE_UNIT;
                    this.hostElement.nativeElement.querySelector('.popover-content').style.minWidth =
                        windowWidth - 30 + POSITION_MEASURE_UNIT;
                    this.setPositionStyle('left', 15);
                }
            }
        }
    }
    setPositionStyle(property, value) {
        this.hostElement.nativeElement.style[property] = value + POSITION_MEASURE_UNIT;
    }
    get defaultLeftPosition() {
        return this.config.bounds.left;
    }
    get canAssignPadding() {
        return ((!this.isContextType && !this.isMenuType && !this.isSubmenuType) ||
            (this.isSubmenuType && !!this.config.content));
    }
    get isContextType() {
        return this.type === 'context';
    }
    get isMenuType() {
        return this.type === 'menu';
    }
    get isSubmenuType() {
        return this.type === 'submenu';
    }
    get isTooltip() {
        return this.type === 'tooltip';
    }
}

class PopoverMenuItemDirective {
    constructor(element) {
        this.element = element;
        this.selected = false;
        this.hidden = false;
        this.clicked = new EventEmitter();
    }
    get selectedClass() {
        return this.selected;
    }
    get hiddenClass() {
        return this.hidden;
    }
    ngOnInit() {
        this.clicked$ = fromEvent(this.element.nativeElement, 'click').pipe(tap(() => {
            this.clicked.emit();
        }));
        this.hovered$ = fromEvent(this.element.nativeElement, 'mousemove');
        // this.global$ = fromEvent<MouseEvent>(document, 'click').pipe(tap(() => console.log('clicked window')));
    }
    ngAfterViewInit() {
        this.element.nativeElement.classList.add('popover-menu-item');
    }
}
PopoverMenuItemDirective.decorators = [
    { type: Directive, args: [{
                selector: '[poppy-menu-item]',
            },] }
];
PopoverMenuItemDirective.ctorParameters = () => [
    { type: ElementRef }
];
PopoverMenuItemDirective.propDecorators = {
    submenu: [{ type: Input }],
    selected: [{ type: Input }],
    hidden: [{ type: Input }],
    clicked: [{ type: Output }],
    selectedClass: [{ type: HostBinding, args: ['class.popover-menu-item--selected',] }],
    hiddenClass: [{ type: HostBinding, args: ['class.popover-menu-item--hidden',] }]
};

class PopoverMenuComponent {
    constructor() { }
}
PopoverMenuComponent.decorators = [
    { type: Component, args: [{
                selector: 'poppy-menu',
                exportAs: 'poppyMenu',
                template: "<ng-template>\n  <ng-content></ng-content>\n</ng-template>",
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
PopoverMenuComponent.ctorParameters = () => [];
PopoverMenuComponent.propDecorators = {
    menuItems: [{ type: ContentChildren, args: [PopoverMenuItemDirective,] }],
    templateRef: [{ type: ViewChild, args: [TemplateRef,] }]
};

class PopoverContentComponent {
    constructor(element, ngZone, componentFactoryResolver, popoverService, popoverEventsService, cdr, popoverConfig) {
        this.element = element;
        this.ngZone = ngZone;
        this.componentFactoryResolver = componentFactoryResolver;
        this.popoverService = popoverService;
        this.popoverEventsService = popoverEventsService;
        this.cdr = cdr;
        this.popoverConfig = popoverConfig;
        this.animationState = 'close';
        this.animationEnd$ = new Subject();
        this.menuItemsChanged = new Subject();
        this.destroy$ = new Subject();
    }
    ngAfterViewInit() {
        var _a;
        this.applyStyles();
        if (this.popoverConfig.submenuTriggeredItem) {
            this.popoverConfig.submenuTriggeredItem.element.nativeElement.classList.add('popover-menu-item--focused');
        }
        if (this.popoverConfig.innerClass) {
            this.popoverWrapperEl.nativeElement.classList.add(this.popoverConfig.innerClass);
        }
        this.listenForMouseEventOnHost();
        if (this.canListenForClickOutside()) {
            this.ngZone.runOutsideAngular(() => {
                setTimeout(() => {
                    this.listenForClickOutside();
                });
            });
        }
        if ((_a = this.popoverConfig.menuRef) === null || _a === void 0 ? void 0 : _a.menuItems) {
            this.listenForMenuItemTriggers();
            // Subscribe to click outside event again, when menu items changed - it's workaround to refresh host element content;
            this.popoverConfig.menuRef.menuItems.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
                this.menuItemsChanged.next();
                this.listenForMenuItemTriggers();
                this.popoverEventsService.unregister('click-outside', this.popoverService.getActive(this.componentRef));
                setTimeout(() => {
                    this.listenForClickOutside();
                    this.componentStyles.update();
                }, 0);
            });
        }
    }
    ngOnDestroy() {
        if (this.popoverConfig.submenuTriggeredItem) {
            this.popoverConfig.submenuTriggeredItem.element.nativeElement.classList.remove('popover-menu-item--focused');
        }
        this.destroy$.next();
        this.destroy$.complete();
    }
    get template() {
        var _a;
        return ((this.popoverConfig.content instanceof TemplateRef &&
            this.popoverConfig.content) || ((_a = this.popoverConfig.menuRef) === null || _a === void 0 ? void 0 : _a.templateRef));
    }
    animationEnd(event) {
        if (event.toState === 'open') {
            this.animationEnd$.next();
        }
    }
    applyStyles() {
        this.componentStyles = new PopoverStyles(this);
        this.componentStyles.init();
        setTimeout(() => {
            this.componentStyles.update();
            this.animationState = 'open';
            this.detectChanges();
        });
    }
    onClickMenuItem(item) {
        const hasItemNestedSubpopovers = !!item.submenu;
        if (!hasItemNestedSubpopovers) {
            if (this.popoverConfig.closeOnClickItem) {
                this.close();
            }
        }
    }
    onHoverMenuItem(item) {
        const canRemoveNestedSubmenus = !this.popoverService.activePopovers.find((popover) => popover.popoverRef.instance.popoverConfig.submenuTriggeredItem === item);
        const hasItemNestedSubpopovers = !!item.submenu;
        if (canRemoveNestedSubmenus) {
            this.popoverService.removeAllNestedPopovers(this.componentRef);
            this.detectChanges();
        }
        const isSubmenuExists = this.popoverService.isPopoverSubmenuExits(this.componentRef, this.parentPopoverRef);
        if (!isSubmenuExists && hasItemNestedSubpopovers && canRemoveNestedSubmenus) {
            this.createSubpopover(item);
        }
    }
    listenForClickOutside() {
        const activePopover = this.popoverService.getActive(this.componentRef);
        this.popoverEventsService.register('click-outside', activePopover, (event) => {
            const clickedElement = event.target;
            let clickedOutside = clickedElement !== this.element.nativeElement &&
                !this.element.nativeElement.contains(clickedElement) &&
                clickedElement !== this.popoverConfig.triggerElement.nativeElement &&
                !this.popoverConfig.triggerElement.nativeElement.contains(clickedElement);
            if (this.popoverConfig.type === 'context' &&
                (clickedElement === this.popoverConfig.triggerElement.nativeElement ||
                    this.popoverConfig.triggerElement.nativeElement.contains(clickedElement))) {
                clickedOutside = true;
            }
            if (clickedOutside) {
                this.close();
            }
        });
    }
    listenForMouseEventOnHost() {
        fromEvent(this.element.nativeElement, 'mouseenter')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            const enteredPopover = this.popoverService.getActive(this.componentRef);
            if (enteredPopover === null || enteredPopover === void 0 ? void 0 : enteredPopover.deepLevel) {
                this.popoverService.activePopovers.forEach((popover, index) => {
                    if (index <= enteredPopover.deepLevel) {
                        this.popoverEventsService.unsubscribe('click-outside', popover);
                    }
                    else {
                        this.popoverEventsService.subscribe('click-outside', popover);
                    }
                });
            }
        });
        fromEvent(this.element.nativeElement, 'mouseleave')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            this.popoverService.activePopovers.forEach((popover) => {
                this.popoverEventsService.subscribe('click-outside', popover);
            });
        });
    }
    listenForMenuItemTriggers() {
        this.popoverConfig.menuRef.menuItems.forEach((item) => {
            item.clicked$.pipe(takeUntil(this.destroy$), takeUntil(this.menuItemsChanged)).subscribe(() => {
                this.onClickMenuItem(item);
            });
            item.hovered$
                .pipe(takeUntil(this.destroy$), takeUntil(this.menuItemsChanged), debounceTime(0), skipUntil(this.animationEnd$))
                .subscribe(() => {
                this.onHoverMenuItem(item);
            });
        });
    }
    close() {
        if (this.isMenu()) {
            this.popoverService.subscribeToClickOutsideEventForParentPopover(this.componentRef);
            this.popoverService.removeMenu(this.parentPopoverRef);
        }
        else {
            this.popoverService.remove(this.componentRef);
        }
    }
    createSubpopover(item) {
        const factory = this.componentFactoryResolver.resolveComponentFactory(PopoverContentComponent);
        const bounds = item.element.nativeElement.getBoundingClientRect();
        const type = 'submenu';
        const options = new PopoverAppendOptions({ type });
        const providedValues = {
            bounds,
            type,
            submenuTriggeredItem: item,
            triggerElement: this.popoverConfig.triggerElement,
            closeOnClickItem: this.popoverConfig.closeOnClickItem,
        };
        if ((item === null || item === void 0 ? void 0 : item.submenu) instanceof PopoverMenuComponent) {
            providedValues.menuRef = item.submenu;
        }
        if ((item === null || item === void 0 ? void 0 : item.submenu) instanceof TemplateRef) {
            providedValues.content = item.submenu;
        }
        const injector = Injector.create([
            {
                provide: POPOVER_CONFIG,
                useValue: providedValues,
            },
        ]);
        this.subMenuComponentRef = this.popoverService.append(injector, null, options, this.parentPopoverRef);
        this.subMenuComponentRef.instance.componentRef = this.subMenuComponentRef;
        this.subMenuComponentRef.instance.parentPopoverRef = this.parentPopoverRef;
        this.subMenuComponentRef.hostView.detectChanges();
    }
    isMenu() {
        return (this.popoverConfig.type === 'menu' ||
            this.popoverConfig.type === 'context' ||
            this.popoverConfig.type === 'submenu');
    }
    canListenForClickOutside() {
        return (this.popoverConfig.closeOnClickOutside && (this.popoverConfig.trigger !== 'hover' || this.isMenu()));
    }
    detectChanges() {
        if (this.cdr && !this.cdr.destroyed) {
            this.cdr.detectChanges();
        }
    }
}
PopoverContentComponent.decorators = [
    { type: Component, args: [{
                selector: 'poppy-content',
                template: "<div\n  #popoverWrapperEl\n  class=\"popover-content\"\n  [@fadeIn]=\"animationState\"\n  (@fadeIn.done)=\"animationEnd($event)\"\n>\n  <ng-container *ngIf=\"template; else textContent\">\n    <ng-container *ngTemplateOutlet=\"template\"></ng-container>\n  </ng-container>\n\n  <ng-template #textContent>\n    {{ popoverConfig.content }}\n  </ng-template>\n</div>\n",
                animations: [fadeInAnimation],
                encapsulation: ViewEncapsulation.None,
                styles: ["poppy-content{position:absolute;visibility:visible}.popover-content{background-color:#fff;border-radius:2px;box-shadow:0 3.2px 7.2px 0 rgba(0,0,0,.133),0 .6px 1.8px 0 rgba(0,0,0,.11);box-sizing:border-box;max-height:400px;overflow:auto}.popover-menu-list{margin:0;padding:0}.popover-menu-item{align-items:center;background-color:transparent;border:0;box-sizing:border-box;color:#323130;cursor:pointer;display:flex;justify-content:space-between;list-style:none;outline:0;padding:9px 12px;position:relative;text-align:left;width:100%}.popover-menu-item:disabled{opacity:.5}.popover-menu-item--focused,.popover-menu-item--selected,.popover-menu-item:hover{background-color:#edebe9}.popover-menu-item--hidden{display:none}"]
            },] }
];
PopoverContentComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: ComponentFactoryResolver },
    { type: PopoverService },
    { type: PopoverEventsService },
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Inject, args: [POPOVER_CONFIG,] }] }
];
PopoverContentComponent.propDecorators = {
    popoverWrapperEl: [{ type: ViewChild, args: ['popoverWrapperEl',] }]
};

class LayerModule {
}
LayerModule.decorators = [
    { type: NgModule, args: [{
                declarations: [LayerComponent],
                imports: [CommonModule],
            },] }
];

class BasePopoverDirective {
    constructor(componentFactoryResolver, popoverService, hostElement, ngZone) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.popoverService = popoverService;
        this.hostElement = hostElement;
        this.ngZone = ngZone;
        this.trigger = 'click';
        // Options
        this.delayClose = null;
        this.closeOnTriggerAgain = undefined;
        this.closeOnClickOutside = true;
        this.hideOnScroll = false;
        // Emitters
        this.afterClose = new EventEmitter();
        this.afterShow = new EventEmitter();
        this.type = 'popover';
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        this.setOptions();
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
    close() {
        if (this.popoverComponentRef) {
            this.remove(this.popoverComponentRef);
        }
    }
    appendToLayer(options) {
        const injector = this.getPopoverComponentInjector();
        const opts = Object.assign(Object.assign({}, options), { delayClose: this.delayClose, closeOnTriggerAgain: this.closeOnTriggerAgain, hideOnScroll: this.hideOnScroll });
        this.popoverComponentRef = this.popoverService.append(injector, this, opts);
    }
    remove(popoverRef) {
        this.ngZone.run(() => {
            this.popoverService.remove(popoverRef);
        });
    }
    setOptions() {
        if (this.closeOnTriggerAgain === undefined) {
            this.closeOnTriggerAgain = !(this.type === 'tooltip' || this.trigger === 'hover');
        }
    }
}
BasePopoverDirective.decorators = [
    { type: Directive }
];
BasePopoverDirective.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: PopoverService },
    { type: ElementRef },
    { type: NgZone }
];
BasePopoverDirective.propDecorators = {
    trigger: [{ type: Input }],
    delayClose: [{ type: Input }],
    closeOnTriggerAgain: [{ type: Input }],
    closeOnClickOutside: [{ type: Input }],
    hideOnScroll: [{ type: Input }],
    innerClass: [{ type: Input }],
    afterClose: [{ type: Output }],
    afterShow: [{ type: Output }]
};

class PopoverDirective extends BasePopoverDirective {
    constructor(componentFactoryResolver, popoverService, hostElement, ngZone) {
        super(componentFactoryResolver, popoverService, hostElement, ngZone);
        this.componentFactoryResolver = componentFactoryResolver;
        this.popoverService = popoverService;
        this.hostElement = hostElement;
        this.ngZone = ngZone;
    }
    ngAfterViewInit() {
        if (this.poppyPopover) {
            this.ngZone.runOutsideAngular(() => {
                if (this.trigger === 'click') {
                    this.listenEventsForClickTrigger();
                }
                if (this.trigger === 'hover') {
                    this.listenEventsForHoverTrigger();
                }
            });
        }
    }
    open() {
        if (this.canAppend()) {
            this.ngZone.run(() => {
                this.append();
            });
        }
    }
    getPopoverComponentInjector() {
        const providerValues = {
            bounds: this.hostElement.nativeElement.getBoundingClientRect(),
            type: this.type,
            trigger: this.trigger,
            triggerElement: this.hostElement,
            triggerDirective: this,
            content: this.poppyPopover,
            closeOnClickOutside: this.closeOnClickOutside,
            innerClass: this.innerClass,
        };
        return Injector.create([
            {
                provide: POPOVER_CONFIG,
                useValue: providerValues,
            },
        ]);
    }
    canAppend() {
        return !this.popoverComponentRef || (this.popoverComponentRef && this.closeOnTriggerAgain);
    }
    listenEventsForClickTrigger() {
        fromEvent(this.hostElement.nativeElement, 'click')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            this.open();
        });
    }
    listenEventsForHoverTrigger() {
        let popoverHovered = false;
        let hostHovered = false;
        let isMouseLeftBeforeDelayTimePast = false;
        merge(fromEvent(this.hostElement.nativeElement, 'mouseenter'), fromEvent(this.hostElement.nativeElement, 'click'))
            .pipe(takeUntil(this.destroy$), tap(() => {
            fromEvent(this.hostElement.nativeElement, 'mouseleave')
                .pipe(takeUntil(this.destroy$), takeUntil(this.afterClose), debounceTime(200))
                .subscribe(() => {
                hostHovered = false;
                isMouseLeftBeforeDelayTimePast = true;
                setTimeout(() => {
                    isMouseLeftBeforeDelayTimePast = false;
                }, 200);
                if (!popoverHovered) {
                    this.remove(this.popoverComponentRef);
                }
            });
        }), switchMap(() => timer(300)))
            .subscribe(() => {
            const isHostElementStillInDOM = document.body.contains(this.hostElement.nativeElement);
            popoverHovered = false;
            hostHovered = true;
            if (isHostElementStillInDOM && !isMouseLeftBeforeDelayTimePast) {
                this.open();
            }
            setTimeout(() => {
                if (this.popoverComponentRef) {
                    fromEvent(this.popoverComponentRef.instance.element.nativeElement, 'mouseenter')
                        .pipe(takeUntil(this.afterClose))
                        .subscribe(() => {
                        popoverHovered = true;
                    });
                    fromEvent(this.popoverComponentRef.instance.element.nativeElement, 'mouseleave')
                        .pipe(takeUntil(this.afterClose))
                        .subscribe(() => {
                        popoverHovered = false;
                        if (!hostHovered) {
                            this.remove(this.popoverComponentRef);
                        }
                    });
                }
            }, 0);
        });
        this.destroy$.pipe(take(1)).subscribe(() => {
            if (this.popoverComponentRef) {
                this.remove(this.popoverComponentRef);
            }
        });
    }
    append() {
        const options = new PopoverAppendOptions({
            type: 'popover',
            triggeredBy: this.trigger,
        });
        this.appendToLayer(options);
    }
}
PopoverDirective.decorators = [
    { type: Directive, args: [{
                selector: '[poppyPopover]',
                exportAs: 'poppyPopover',
            },] }
];
PopoverDirective.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: PopoverService },
    { type: ElementRef },
    { type: NgZone }
];
PopoverDirective.propDecorators = {
    poppyPopover: [{ type: Input }]
};

class PopoverChipDirective {
    constructor(template) {
        this.template = template;
    }
}
PopoverChipDirective.decorators = [
    { type: Directive, args: [{
                selector: '[poppy-chip]',
                exportAs: 'poppyChip'
            },] }
];
PopoverChipDirective.ctorParameters = () => [
    { type: TemplateRef }
];

class PopoverChipRemoveDirective {
    constructor(selectComponentRef) {
        this.selectComponentRef = selectComponentRef;
    }
    onClick(event) {
        this.remove(event);
    }
    remove(event) {
        if (this.selectComponentRef) {
            this.selectComponentRef.closeChip(this.poppyChipRemove, event);
        }
    }
}
PopoverChipRemoveDirective.decorators = [
    { type: Directive, args: [{
                selector: '[poppyChipRemove]'
            },] }
];
PopoverChipRemoveDirective.ctorParameters = () => [
    { type: PopoverSelectComponent }
];
PopoverChipRemoveDirective.propDecorators = {
    poppyChipRemove: [{ type: Input }],
    onClick: [{ type: HostListener, args: ['click', ['$event'],] }]
};

class PopoverMenuDirective extends BasePopoverDirective {
    constructor(componentFactoryResolver, popoverService, hostElement, ngZone) {
        super(componentFactoryResolver, popoverService, hostElement, ngZone);
        this.componentFactoryResolver = componentFactoryResolver;
        this.popoverService = popoverService;
        this.hostElement = hostElement;
        this.ngZone = ngZone;
        this.type = 'menu';
        this.closeOnClickItem = true;
    }
    ngAfterViewInit() {
        if (this.poppyMenu) {
            this.ngZone.runOutsideAngular(() => {
                if (this.trigger !== 'manual' && this.type === 'menu') {
                    this.listenEventsForClickTrigger();
                }
                if (this.type === 'context') {
                    this.listenEventsForContextTrigger();
                }
            });
        }
    }
    open() {
        if (this.canAppend()) {
            this.ngZone.run(() => {
                this.append();
            });
        }
    }
    // NOTE: It should be removed after upgrade to ng 9, because QueryList should emit changes
    // when elements is removed
    updateContentPosition() {
        if (this.popoverComponentRef) {
            this.popoverComponentRef.instance.componentStyles.update();
        }
    }
    getPopoverComponentInjector() {
        const providerValues = {
            bounds: this.getBounds(),
            type: this.type,
            triggerElement: this.hostElement,
            triggerDirective: this,
            closeOnClickOutside: this.closeOnClickOutside,
            closeOnClickItem: this.closeOnClickItem,
            menuRef: this.poppyMenu,
            innerClass: this.innerClass,
        };
        return Injector.create([
            {
                provide: POPOVER_CONFIG,
                useValue: providerValues,
            },
        ]);
    }
    canAppend() {
        return (!this.popoverComponentRef ||
            (this.popoverComponentRef && this.type === 'context') ||
            (this.popoverComponentRef && this.closeOnTriggerAgain));
    }
    listenEventsForClickTrigger() {
        fromEvent(this.hostElement.nativeElement, 'click')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            this.open();
        });
    }
    listenEventsForContextTrigger() {
        fromEvent(this.hostElement.nativeElement, 'contextmenu')
            .pipe(takeUntil(this.destroy$))
            .subscribe((event) => {
            event.preventDefault();
            this.contextMenuPosition = {
                top: event.clientY,
                left: event.clientX,
            };
            this.open();
        });
    }
    append() {
        const options = new PopoverAppendOptions({
            type: this.type,
        });
        this.appendToLayer(options);
    }
    getBounds() {
        if (this.type === 'context') {
            return { top: this.contextMenuPosition.top, left: this.contextMenuPosition.left };
        }
        else {
            return this.hostElement.nativeElement.getBoundingClientRect();
        }
    }
}
PopoverMenuDirective.decorators = [
    { type: Directive, args: [{
                selector: '[poppyMenu]',
                exportAs: 'poppyMenu',
            },] }
];
PopoverMenuDirective.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: PopoverService },
    { type: ElementRef },
    { type: NgZone }
];
PopoverMenuDirective.propDecorators = {
    poppyMenu: [{ type: Input }],
    type: [{ type: Input }],
    closeOnClickItem: [{ type: Input }]
};

class PopoverOptionDirective {
    constructor(template) {
        this.template = template;
    }
}
PopoverOptionDirective.decorators = [
    { type: Directive, args: [{
                selector: '[poppy-option]',
                exportAs: 'poppyOption',
            },] }
];
PopoverOptionDirective.ctorParameters = () => [
    { type: TemplateRef }
];

class PopoverRemoveOnClickDirective {
    constructor(host, popoverService) {
        this.host = host;
        this.popoverService = popoverService;
    }
    onClick() {
        this.remove();
    }
    remove() {
        setTimeout(() => {
            const parentElement = this.host.nativeElement.closest('poppy-content');
            this.popoverService.removeByNativeElementRef(parentElement);
        });
    }
}
PopoverRemoveOnClickDirective.decorators = [
    { type: Directive, args: [{
                selector: '[poppyRemoveOnClick]',
            },] }
];
PopoverRemoveOnClickDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: PopoverService }
];
PopoverRemoveOnClickDirective.propDecorators = {
    onClick: [{ type: HostListener, args: ['click', ['$event'],] }]
};

class TooltipDirective extends PopoverDirective {
    constructor(componentFactoryResolver, popoverService, hostElement, ngZone) {
        super(componentFactoryResolver, popoverService, hostElement, ngZone);
        this.componentFactoryResolver = componentFactoryResolver;
        this.popoverService = popoverService;
        this.hostElement = hostElement;
        this.ngZone = ngZone;
        this.trigger = 'hover';
        this.type = 'tooltip';
    }
    ngOnInit() {
        this.poppyPopover = this.poppyTooltip;
    }
}
TooltipDirective.decorators = [
    { type: Directive, args: [{
                selector: '[poppyTooltip]',
            },] }
];
TooltipDirective.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: PopoverService },
    { type: ElementRef },
    { type: NgZone }
];
TooltipDirective.propDecorators = {
    poppyTooltip: [{ type: Input }]
};

class PopoverSelectComponent {
    constructor(cdr, controlContainer) {
        this.cdr = cdr;
        this.controlContainer = controlContainer;
        this.options = [];
        this.bindLabel = 'label';
        this.multiselect = false;
        this.clearable = true;
        this.searchable = true;
        this.placeholder = 'Wybierz..';
        this.notFoundText = 'Nie znaleziono wyników';
        this.changed = new EventEmitter();
        this.selectedOptions = [];
        this.displayedOptions = [];
        this.displayedChips = [];
        this.asyncLoading = false;
        this.isMenuOpen = false;
        this.destroy$ = new Subject();
        this.propagateChange = (value) => { };
    }
    ngOnInit() { }
    ngOnChanges(changes) {
        if (changes.options && changes.options.previousValue !== changes.options.currentValue) {
            this.onOptionsChange();
        }
        if (changes.value && changes.value.previousValue !== changes.value.currentValue) {
            this.writeValue(this.value);
        }
    }
    ngAfterViewInit() {
        this.menuRef.afterClose.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.isMenuOpen = false;
            if (!this.multiselect) {
                this.onCloseMenu();
            }
            this.cdr.detectChanges();
        });
        this.menuRef.afterShow.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.isMenuOpen = true;
            this.cdr.detectChanges();
        });
        this.menuRef.afterClose.pipe(take(1)).subscribe(() => {
            // TODO: mark as touched..
            // if (this.control) {
            //   this.control.markAsTouched();
            //   this.control.updateValueAndValidity();
            // }
        });
        if (this.async) {
            this.loadAsyncOptions(null, { firstLoad: true });
        }
        if (this.searchable) {
            this.onInputKeyUp();
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    get noItemsFound() {
        return !this.displayedOptions.length || !!this.displayedOptions.every((opt) => opt.hidden);
    }
    writeValue(value) {
        if (value !== undefined) {
            if (this.multiselect) {
                this.updateSelectedItemsForMultiSelection(value);
            }
            else {
                this.updateSelectedItemsForSingleSelection(value);
            }
        }
        else {
            this.reset();
        }
        setTimeout(() => {
            this.cdr.detectChanges();
        });
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched() { }
    setDisabledState(isDisabled) { }
    getDisplayLabel(option) {
        return this.bindLabel ? option[this.bindLabel] : '';
    }
    onClickItem(clickedOption) {
        this.selectedOptions = [];
        this.displayedOptions.forEach((option, index) => {
            if (this.matchByValueOrReference(option, clickedOption)) {
                this.displayedOptions[index].selected = this.multiselect ? !option.selected : true;
                this.displayedOptions[index].hidden = this.multiselect ? !option.hidden : false;
            }
            else {
                if (!this.multiselect) {
                    this.displayedOptions[index].selected = false;
                }
            }
            if (this.displayedOptions[index].selected) {
                this.selectedOptions.push(this.options[index]);
            }
        });
        if (this.multiselect) {
            this.updateDisplayedChips();
        }
        if (!this.multiselect) {
            this.inputEl.nativeElement.value = this.bindLabel ? this.selectedOptions[0][this.bindLabel] : '';
        }
        this.emitChange();
        this.cdr.detectChanges();
    }
    onChangeInput(target) {
        const value = target.value;
        if (this.bindLabel) {
            if (this.async) {
                this.loadAsyncOptions(value);
            }
            else {
                this.displayedOptions.forEach((option, index) => {
                    this.displayedOptions[index].hidden = !option[this.bindLabel].includes(value);
                });
                this.cdr.detectChanges();
            }
        }
    }
    clear(event) {
        event.stopPropagation();
        this.reset();
        this.emitChange();
    }
    getDisplayValue() {
        if (!!this.selectedOptions.length) {
            if (this.multiselect) {
                return '';
            }
            if (typeof this.selectedOptions[0] === 'object' && this.bindLabel) {
                return this.selectedOptions[0][this.bindLabel];
            }
            return '';
        }
        return '';
    }
    closeChip(chip, event) {
        this.selectedOptions = [];
        this.displayedOptions.forEach((option, index) => {
            if (this.matchByValueOrReference(option, chip)) {
                this.displayedOptions[index].selected = false;
                this.displayedOptions[index].hidden = false;
            }
            if (this.displayedOptions[index].selected) {
                this.selectedOptions.push(this.options[index]);
            }
        });
        this.updateDisplayedChips();
        this.emitChange();
        if (event) {
            event.stopPropagation();
        }
        this.cdr.detectChanges();
    }
    onOptionsChange() {
        this.displayedOptions = [...this.options].map((option) => (Object.assign(Object.assign({}, option), { selected: false, hidden: false })));
    }
    onInputKeyUp() {
        fromEvent(this.inputEl.nativeElement, 'keyup')
            .pipe(tap(() => {
            if (this.async) {
                this.asyncLoading = true;
            }
        }), debounceTime(!!this.async ? 500 : 0), map((event) => event.target), takeUntil(this.destroy$))
            .subscribe((target) => {
            this.onChangeInput(target);
        });
    }
    reset() {
        this.displayedOptions.forEach((option, index) => {
            this.displayedOptions[index].hidden = false;
            this.displayedOptions[index].selected = false;
        });
        this.selectedOptions = [];
        if (this.multiselect) {
            this.displayedChips = [];
        }
    }
    emitChange() {
        const value = this.getPropagateValue();
        this.propagateChange(value);
        this.changed.emit(value);
    }
    getPropagateValue() {
        if (!this.selectedOptions.length) {
            return this.multiselect ? [] : null;
        }
        if (this.multiselect) {
            return this.bindValue
                ? this.selectedOptions.map((option) => option[this.bindValue])
                : this.selectedOptions;
        }
        return this.bindValue ? this.selectedOptions[0][this.bindValue] : this.selectedOptions[0];
    }
    onCloseMenu() {
        this.inputEl.nativeElement.value = !!this.selectedOptions.length
            ? this.selectedOptions[0][this.bindLabel]
            : null;
        this.displayedOptions.forEach((option, index) => {
            this.displayedOptions[index].hidden = false;
        });
    }
    loadAsyncOptions(searchPhrase, options = {}) {
        this.asyncLoading = !options.firstLoad;
        this.async(searchPhrase).subscribe((results) => {
            this.options = results;
            this.onOptionsChange();
            this.asyncLoading = false;
            this.cdr.detectChanges();
        });
    }
    updateSelectedItemsForMultiSelection(value) {
        if (!Array.isArray(value)) {
            if (value !== null) {
                throw Error('Initial value for multiselect must be an array!');
            }
            else {
                value = [];
            }
        }
        this.selectedOptions = [];
        this.displayedChips = [];
        this.options.forEach((option, index) => {
            const matchOption = !!value.find((v) => this.matchByValueOrReference(option, v));
            if (matchOption) {
                this.selectedOptions.push(option);
                this.displayedOptions[index].selected = true;
                this.displayedOptions[index].hidden = true;
            }
            else {
                this.displayedOptions[index].selected = false;
                this.displayedOptions[index].hidden = false;
            }
        });
        this.updateDisplayedChips();
    }
    updateSelectedItemsForSingleSelection(value) {
        this.options.forEach((option, index) => {
            if (this.matchByValueOrReference(option, value)) {
                this.selectedOptions = [option];
                this.displayedOptions[index].selected = true;
            }
            else {
                this.displayedOptions[index].selected = false;
            }
        });
        if (!value) {
            this.selectedOptions = [];
        }
    }
    updateDisplayedChips() {
        this.displayedOptions
            .filter((option) => option.selected)
            .forEach((option) => {
            const chipIndex = this.displayedChips.findIndex((chip) => this.matchByValueOrReference(chip, option));
            if (chipIndex === -1) {
                this.displayedChips.push(option);
            }
        });
        this.displayedChips.forEach((chip, index) => {
            const option = this.displayedOptions
                .filter((opt) => opt.selected)
                .find((opt) => this.matchByValueOrReference(chip, opt));
            if (!option) {
                this.displayedChips.splice(index, 1);
            }
        });
        if (this.menuRef) {
            setTimeout(() => {
                this.menuRef.updateContentPosition();
            });
        }
    }
    matchByValueOrReference(item, comparedTo) {
        if (this.bindValue) {
            if (comparedTo && comparedTo[this.bindValue] !== undefined) {
                // tslint:disable-next-line:triple-equals
                return item[this.bindValue] == comparedTo[this.bindValue];
            }
            // tslint:disable-next-line:triple-equals
            return item[this.bindValue] == comparedTo;
        }
        return item === comparedTo;
    }
}
PopoverSelectComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'poppy-select',
                template: "  <div class=\"poppy-select\" [poppyMenu]=\"menu\" [closeOnClickItem]=\"!multiselect\">\n    <div class=\"poppy-select__content\">\n      <div *ngIf=\"multiselect\" class=\"poppy-select__multiselect\">\n        <div *ngFor=\"let chip of displayedChips\" class=\"poppy-select__chip\">\n          <ng-container *ngIf=\"chipTemplate\">\n            <ng-container\n              [ngTemplateOutlet]=\"chipTemplate.template\"\n              [ngTemplateOutletContext]=\"{ $implicit: chip }\"\n            ></ng-container>\n          </ng-container>\n          <div *ngIf=\"!chipTemplate\" class=\"poppy-chip\">\n            <div class=\"poppy-chip__content\">{{ getDisplayLabel(chip) }}</div>\n            <div class=\"poppy-chip__close\" (click)=\"closeChip(chip, $event)\">\n              &#10006;\n            </div>\n          </div>\n        </div>\n        <span class=\"poppy-select__placeholder\" *ngIf=\"!selectedOptions.length\">{{ placeholder }}</span>\n      </div>\n\n      <input\n        #input\n        [hidden]=\"multiselect\"\n        [placeholder]=\"placeholder\"\n        [value]=\"getDisplayValue()\"\n        [readOnly]=\"!searchable\"\n        type=\"text\"\n      />\n\n      <div *ngIf=\"clearable && !multiselect && !!getDisplayValue()\" class=\"poppy-select__clear\">\n        <button class=\"clear-btn\" (click)=\"clear($event)\">&times;</button>\n      </div>\n\n      <div *ngIf=\"!asyncLoading\" class=\"poppy-select__arrow\">\n        <span *ngIf=\"isMenuOpen\" class=\"material-icons\">\n          keyboard_arrow_up\n        </span>\n        <span *ngIf=\"!isMenuOpen\" class=\"material-icons\">\n          keyboard_arrow_down\n        </span>\n      </div>\n\n      <ng-container *ngIf=\"asyncLoading\">\n        <div class=\"poppy-select__loader\">\n          loader..\n        </div>\n      </ng-container>\n    </div>\n  </div>\n\n<poppy-menu #menu=\"poppyMenu\">\n  <li\n    *ngFor=\"let option of displayedOptions\"\n    poppy-menu-item\n    [hidden]=\"option.hidden\"\n    [selected]=\"option.selected\"\n    (clicked)=\"onClickItem(option)\"\n  >\n    <ng-container *ngIf=\"optionTemplate\">\n      <ng-container\n        [ngTemplateOutlet]=\"optionTemplate.template\"\n        [ngTemplateOutletContext]=\"{ $implicit: option }\"\n      ></ng-container>\n    </ng-container>\n    <ng-container *ngIf=\"!optionTemplate\">\n      {{ getDisplayLabel(option) }}\n    </ng-container>\n  </li>\n  <div class=\"poppy__no-items\" *ngIf=\"noItemsFound\">{{ notFoundText }}</div>\n</poppy-menu>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => PopoverSelectComponent),
                        multi: true,
                    },
                    {
                        provide: NG_VALIDATORS,
                        useExisting: forwardRef(() => PopoverSelectComponent),
                        multi: true,
                    },
                ],
                styles: [".poppy-select{align-items:center;box-sizing:border-box;cursor:pointer;display:flex;min-height:42px}.poppy-select__content{min-height:18px;position:relative;width:100%}.poppy-select__content input{cursor:pointer;padding-right:2rem}.poppy-select__chips{height:100%;margin-bottom:-6px}.poppy-select__multiselect{align-items:center;border:2px solid #282828;border-radius:4px;display:flex;flex-wrap:wrap;min-height:44px;padding:.18rem .8rem;width:100%}.poppy-select__chip{display:inline-block;margin-bottom:4px;margin-right:6px;margin-top:4px}.poppy-select__arrow{color:#f6f6f6;position:absolute;right:8px;top:12px}.poppy-select__clear{color:#f6f6f6;position:absolute;right:32px;top:9px}.poppy-chip{align-items:stretch;background-color:#edebe9;border-radius:16px;cursor:pointer;display:flex;font-size:.92em;height:26px;line-height:1;overflow:hidden}.poppy-chip__content{align-items:center;display:flex;font-size:inherit;line-height:1rem;margin-right:4px;padding:0 0 0 10px}.poppy-chip__close{align-items:center;background-color:#343333;border-radius:16px;display:flex;font-size:.86em;justify-content:center;padding-top:1px;width:26px}.poppy-chip__close:hover{background-color:#f6f6f6}.poppy__no-items{padding:14px 10px}.poppy-select__placeholder{color:#f6f6f6}.poppy-select__loader{position:absolute;right:15px;top:12px}"]
            },] }
];
PopoverSelectComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ControlContainer, decorators: [{ type: Optional }, { type: Host }, { type: SkipSelf }] }
];
PopoverSelectComponent.propDecorators = {
    options: [{ type: Input }],
    async: [{ type: Input }],
    value: [{ type: Input }],
    bindLabel: [{ type: Input }],
    bindValue: [{ type: Input }],
    multiselect: [{ type: Input }],
    clearable: [{ type: Input }],
    searchable: [{ type: Input }],
    placeholder: [{ type: Input }],
    notFoundText: [{ type: Input }],
    changed: [{ type: Output }],
    inputEl: [{ type: ViewChild, args: ['input',] }],
    menuRef: [{ type: ViewChild, args: [PopoverMenuDirective,] }],
    chipTemplate: [{ type: ContentChild, args: [PopoverChipDirective,] }],
    optionTemplate: [{ type: ContentChild, args: [PopoverOptionDirective,] }]
};

class PopoverModule {
}
PopoverModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    PopoverDirective,
                    PopoverMenuDirective,
                    PopoverContentComponent,
                    PopoverMenuItemDirective,
                    PopoverMenuComponent,
                    PopoverSelectComponent,
                    PopoverChipDirective,
                    PopoverChipRemoveDirective,
                    PopoverRemoveOnClickDirective,
                    PopoverOptionDirective,
                    TooltipDirective,
                ],
                imports: [CommonModule, BrowserAnimationsModule, LayerModule],
                exports: [
                    PopoverDirective,
                    PopoverMenuDirective,
                    PopoverMenuItemDirective,
                    PopoverMenuComponent,
                    PopoverSelectComponent,
                    PopoverChipDirective,
                    PopoverChipRemoveDirective,
                    PopoverRemoveOnClickDirective,
                    PopoverOptionDirective,
                    TooltipDirective,
                ],
            },] }
];

/*
 * Public API Surface of ng-poppy
 */

/**
 * Generated bundle index. Do not edit.
 */

export { PopoverChipDirective, PopoverChipRemoveDirective, PopoverDirective, PopoverMenuComponent, PopoverMenuDirective, PopoverMenuItemDirective, PopoverModule, PopoverOptionDirective, PopoverRemoveOnClickDirective, PopoverSelectComponent, TooltipDirective, PopoverDirective as ɵa, PopoverMenuDirective as ɵb, PopoverContentComponent as ɵc, fadeInAnimation as ɵd, POPOVER_CONFIG as ɵe, PopoverService as ɵg, LayerService as ɵh, PopoverEventsService as ɵi, PopoverMenuItemDirective as ɵj, PopoverMenuItemDirective as ɵk, PopoverChipDirective as ɵl, PopoverOptionDirective as ɵm, PopoverChipRemoveDirective as ɵn, PopoverRemoveOnClickDirective as ɵo, TooltipDirective as ɵp, LayerModule as ɵq, LayerComponent as ɵr, LAYER_CONFIG as ɵs };
//# sourceMappingURL=ng-poppy.js.map
