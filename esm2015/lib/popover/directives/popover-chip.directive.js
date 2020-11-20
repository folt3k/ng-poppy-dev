import { Directive, TemplateRef } from '@angular/core';
export class PopoverChipDirective {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1jaGlwLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS9mb2x0aS9Qcm9qZWN0cy9uZy1wb3BweS9wcm9qZWN0cy9uZy1wb3BweS9zcmMvIiwic291cmNlcyI6WyJsaWIvcG9wb3Zlci9kaXJlY3RpdmVzL3BvcG92ZXItY2hpcC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFNdkQsTUFBTSxPQUFPLG9CQUFvQjtJQUMvQixZQUFtQixRQUEwQjtRQUExQixhQUFRLEdBQVIsUUFBUSxDQUFrQjtJQUFHLENBQUM7OztZQUxsRCxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLFFBQVEsRUFBRSxXQUFXO2FBQ3RCOzs7WUFMbUIsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3BvcHB5LWNoaXBdJyxcbiAgZXhwb3J0QXM6ICdwb3BweUNoaXAnXG59KVxuZXhwb3J0IGNsYXNzIFBvcG92ZXJDaGlwRGlyZWN0aXZlIHtcbiAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+KSB7fVxufVxuIl19