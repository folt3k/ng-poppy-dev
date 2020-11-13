import { ElementRef, InjectionToken, TemplateRef } from '@angular/core';

import { PopoverMenu, PopoverTrigger, PopoverType } from './popover.interface';
import { BasePopoverDirective } from './directives/base-popover';
import { PopoverMenuItemDirective } from './directives/popover-menu-item.directive';
import { PopoverMenuComponent } from './components/popover-menu/popover-menu.component';

export const POPOVER_CONFIG = new InjectionToken<PopoverConfig>('popover-config');

export interface PopoverConfig {
  bounds: ClientRect;
  type: PopoverType;
  triggerDirective?: BasePopoverDirective;
  content?: TemplateRef<any> | string;
  trigger?: PopoverTrigger;
  triggerElement?: ElementRef;
  menuItems?: PopoverMenu;
  menuRef?: PopoverMenuComponent;
  styles?: { [key: string]: number | string };
  submenuTriggeredItem?: PopoverMenuItemDirective;
  multiselect?: boolean;
  closeOnClickOutside?: boolean;
  closeOnClickItem?: boolean;
  selectable?: boolean;
  innerClass?: string;
}
