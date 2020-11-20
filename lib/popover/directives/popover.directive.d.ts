import { AfterViewInit, ComponentFactoryResolver, ElementRef, Injector, NgZone, TemplateRef } from '@angular/core';
import { PopoverService } from '../services/popover.service';
import { BasePopoverDirective } from './base-popover';
export declare class PopoverDirective extends BasePopoverDirective implements AfterViewInit {
    protected readonly componentFactoryResolver: ComponentFactoryResolver;
    protected readonly popoverService: PopoverService;
    readonly hostElement: ElementRef;
    protected readonly ngZone: NgZone;
    poppyPopover: TemplateRef<HTMLElement> | string;
    constructor(componentFactoryResolver: ComponentFactoryResolver, popoverService: PopoverService, hostElement: ElementRef, ngZone: NgZone);
    ngAfterViewInit(): void;
    open(): void;
    protected getPopoverComponentInjector(): Injector;
    protected canAppend(): boolean;
    private listenEventsForClickTrigger;
    private listenEventsForHoverTrigger;
    private append;
}
