import { TemplateRef } from '@angular/core';
import { ActivePopover } from './models/popover-active.model';
import { PopoverEventType } from './services/events.service';
export declare type PopoverType = 'popover' | 'context' | 'menu' | 'submenu' | 'tooltip';
export declare type PopoverMenuType = 'context' | 'menu';
export declare type PopoverTrigger = 'click' | 'hover' | 'manual';
export declare type PopoverBounds = Partial<ClientRect>;
export interface PopoverMenuItem {
    name: string;
    desc?: string;
    icon?: string;
    image?: string;
    submenu?: PopoverMenu;
    templateRef?: TemplateRef<any>;
    callback?: () => void | any;
    separator?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    selected?: boolean;
    data?: any;
}
export declare type PopoverMenu = PopoverMenuItem[];
export interface PopoverContextMenuPosition {
    top: number;
    left: number;
}
export interface IPopoverAppendOptions {
    type: PopoverType;
    triggeredBy?: PopoverTrigger;
    closeOnScroll?: boolean;
    delayClose?: number;
    closeOnTriggerAgain?: boolean;
    hideOnScroll?: boolean;
    innerClass?: string;
}
export interface IPopoverEventService {
    register(type: PopoverEventType, popover: ActivePopover, callback: () => void | any): any;
    unregister(type: PopoverEventType, popover: ActivePopover): void;
    subscribe(type: PopoverEventType, popover: ActivePopover): void;
    unsubscribe(type: PopoverEventType, popover: ActivePopover): void;
}
