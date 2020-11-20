import { QueryList, TemplateRef } from '@angular/core';
import { PopoverMenuItemDirective } from '../../directives/popover-menu-item.directive';
export declare class PopoverMenuComponent {
    menuItems: QueryList<PopoverMenuItemDirective>;
    templateRef: TemplateRef<any>;
    constructor();
}
