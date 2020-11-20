import { ComponentRef } from '@angular/core';
import { PopoverType } from '../popover.interface';
import { PopoverContentComponent } from '../components/popover-content/popover-content.component';
import { BasePopoverDirective } from '../directives/base-popover';
export declare class ActivePopover {
    popoverRef: ComponentRef<PopoverContentComponent>;
    parentPopoverRef: ComponentRef<PopoverContentComponent>;
    superParentPopoverRef: ComponentRef<PopoverContentComponent>;
    directiveRef: BasePopoverDirective;
    type: PopoverType;
    deepLevel: number;
    isMenuParent: boolean;
    isSuperparent: boolean;
    isSubmenu: boolean;
    constructor(popoverRef: ComponentRef<PopoverContentComponent>, parentPopoverRef: ComponentRef<PopoverContentComponent>, superParentPopoverRef: ComponentRef<PopoverContentComponent>, directiveRef: BasePopoverDirective, type: PopoverType, deepLevel: number);
}
