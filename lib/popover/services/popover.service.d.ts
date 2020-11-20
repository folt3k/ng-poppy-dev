import { ComponentRef, Injector } from '@angular/core';
import { PopoverContentComponent } from '../components/popover-content/popover-content.component';
import { LayerService } from '../../layer/layer.service';
import { PopoverAppendOptions } from '../models/popover-append-options.model';
import { ActivePopover } from '../models/popover-active.model';
import { BasePopoverDirective } from '../directives/base-popover';
import { PopoverEventsService } from './events.service';
export declare class PopoverService {
    private layerService;
    private eventsService;
    activePopovers: ActivePopover[];
    constructor(layerService: LayerService, eventsService: PopoverEventsService);
    append(injector: Injector, directive: BasePopoverDirective, options: PopoverAppendOptions, parentPopoverRef?: ComponentRef<PopoverContentComponent>): ComponentRef<PopoverContentComponent>;
    remove(popoverRef: ComponentRef<PopoverContentComponent>): void;
    removeByNativeElementRef(element: HTMLElement): void;
    getActive(popoverRef: ComponentRef<PopoverContentComponent>): ActivePopover;
    isPopoverSubmenuExits(precendingRef: ComponentRef<PopoverContentComponent>, parentRef: ComponentRef<PopoverContentComponent>): boolean;
    removeAllNestedPopovers(popoverRef: ComponentRef<PopoverContentComponent>): void;
    removeMenu(componentRef: ComponentRef<PopoverContentComponent>): void;
    subscribeToClickOutsideEventForParentPopover(componentRef: ComponentRef<PopoverContentComponent>): void;
    private appendToBody;
    private prepareSuperparentAndDeepLevel;
    private canRegisterScrollCaptureEvent;
    private canRegisterResizeEvent;
    private registerResizeEvent;
    private registerScrollCaptureEvent;
    private hideGroup;
    private updateGroupPosition;
}
