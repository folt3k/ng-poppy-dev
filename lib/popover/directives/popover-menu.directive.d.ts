import { AfterViewInit, ComponentFactoryResolver, ElementRef, Injector, NgZone } from '@angular/core';
import { PopoverMenuType } from '../popover.interface';
import { PopoverService } from '../services/popover.service';
import { BasePopoverDirective } from './base-popover';
import { PopoverMenuComponent } from '../components/popover-menu/popover-menu.component';
export declare class PopoverMenuDirective extends BasePopoverDirective implements AfterViewInit {
    protected readonly componentFactoryResolver: ComponentFactoryResolver;
    protected readonly popoverService: PopoverService;
    readonly hostElement: ElementRef;
    protected readonly ngZone: NgZone;
    poppyMenu: PopoverMenuComponent;
    type: PopoverMenuType;
    closeOnClickItem: boolean;
    private contextMenuPosition;
    constructor(componentFactoryResolver: ComponentFactoryResolver, popoverService: PopoverService, hostElement: ElementRef, ngZone: NgZone);
    ngAfterViewInit(): void;
    open(): void;
    updateContentPosition(): void;
    protected getPopoverComponentInjector(): Injector;
    protected canAppend(): boolean;
    private listenEventsForClickTrigger;
    private listenEventsForContextTrigger;
    private append;
    private getBounds;
}
