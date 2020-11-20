import { Directive, TemplateRef } from '@angular/core';
export class PopoverOptionDirective {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1vcHRpb24uZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL2ZvbHRpL1Byb2plY3RzL25nLXBvcHB5L3Byb2plY3RzL25nLXBvcHB5L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9wb3BvdmVyL2RpcmVjdGl2ZXMvcG9wb3Zlci1vcHRpb24uZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBTXZELE1BQU0sT0FBTyxzQkFBc0I7SUFDakMsWUFBbUIsUUFBMEI7UUFBMUIsYUFBUSxHQUFSLFFBQVEsQ0FBa0I7SUFBRyxDQUFDOzs7WUFMbEQsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLFFBQVEsRUFBRSxhQUFhO2FBQ3hCOzs7WUFMbUIsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3BvcHB5LW9wdGlvbl0nLFxuICBleHBvcnRBczogJ3BvcHB5T3B0aW9uJyxcbn0pXG5leHBvcnQgY2xhc3MgUG9wb3Zlck9wdGlvbkRpcmVjdGl2ZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55Pikge31cbn1cbiJdfQ==