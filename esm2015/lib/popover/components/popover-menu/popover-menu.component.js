import { ContentChildren, Component, TemplateRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { PopoverMenuItemDirective } from '../../directives/popover-menu-item.directive';
export class PopoverMenuComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1tZW51LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS9mb2x0aS9Qcm9qZWN0cy9uZy1wb3BweS9wcm9qZWN0cy9uZy1wb3BweS9zcmMvIiwic291cmNlcyI6WyJsaWIvcG9wb3Zlci9jb21wb25lbnRzL3BvcG92ZXItbWVudS9wb3BvdmVyLW1lbnUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBYSxlQUFlLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdkgsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFReEYsTUFBTSxPQUFPLG9CQUFvQjtJQUkvQixnQkFBZSxDQUFDOzs7WUFWakIsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxZQUFZO2dCQUN0QixRQUFRLEVBQUUsV0FBVztnQkFDckIsc0VBQTRDO2dCQUM1QyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTthQUNoRDs7Ozt3QkFFRSxlQUFlLFNBQUMsd0JBQXdCOzBCQUN4QyxTQUFTLFNBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFF1ZXJ5TGlzdCwgQ29udGVudENoaWxkcmVuLCBDb21wb25lbnQsIFRlbXBsYXRlUmVmLCBWaWV3Q2hpbGQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQb3BvdmVyTWVudUl0ZW1EaXJlY3RpdmUgfSBmcm9tICcuLi8uLi9kaXJlY3RpdmVzL3BvcG92ZXItbWVudS1pdGVtLmRpcmVjdGl2ZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BvcHB5LW1lbnUnLFxuICBleHBvcnRBczogJ3BvcHB5TWVudScsXG4gIHRlbXBsYXRlVXJsOiAnLi9wb3BvdmVyLW1lbnUuY29tcG9uZW50Lmh0bWwnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgUG9wb3Zlck1lbnVDb21wb25lbnQge1xuICBAQ29udGVudENoaWxkcmVuKFBvcG92ZXJNZW51SXRlbURpcmVjdGl2ZSkgbWVudUl0ZW1zOiBRdWVyeUxpc3Q8UG9wb3Zlck1lbnVJdGVtRGlyZWN0aXZlPjtcbiAgQFZpZXdDaGlsZChUZW1wbGF0ZVJlZikgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgY29uc3RydWN0b3IoKSB7fVxufVxuIl19