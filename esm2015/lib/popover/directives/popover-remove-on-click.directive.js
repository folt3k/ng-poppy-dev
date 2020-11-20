import { Directive, ElementRef, HostListener } from '@angular/core';
import { PopoverService } from '../services/popover.service';
export class PopoverRemoveOnClickDirective {
    constructor(host, popoverService) {
        this.host = host;
        this.popoverService = popoverService;
    }
    onClick() {
        this.remove();
    }
    remove() {
        setTimeout(() => {
            const parentElement = this.host.nativeElement.closest('poppy-content');
            this.popoverService.removeByNativeElementRef(parentElement);
        });
    }
}
PopoverRemoveOnClickDirective.decorators = [
    { type: Directive, args: [{
                selector: '[poppyRemoveOnClick]',
            },] }
];
PopoverRemoveOnClickDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: PopoverService }
];
PopoverRemoveOnClickDirective.propDecorators = {
    onClick: [{ type: HostListener, args: ['click', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1yZW1vdmUtb24tY2xpY2suZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL2ZvbHRpL1Byb2plY3RzL25nLXBvcHB5L3Byb2plY3RzL25nLXBvcHB5L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9wb3BvdmVyL2RpcmVjdGl2ZXMvcG9wb3Zlci1yZW1vdmUtb24tY2xpY2suZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNwRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFJN0QsTUFBTSxPQUFPLDZCQUE2QjtJQU14QyxZQUFvQixJQUFnQixFQUFVLGNBQThCO1FBQXhELFNBQUksR0FBSixJQUFJLENBQVk7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7SUFBRyxDQUFDO0lBSmhGLE9BQU87UUFDTCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUlELE1BQU07UUFDSixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxjQUFjLENBQUMsd0JBQXdCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDOUQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOzs7WUFoQkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxzQkFBc0I7YUFDakM7OztZQUptQixVQUFVO1lBQ3JCLGNBQWM7OztzQkFLcEIsWUFBWSxTQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQb3BvdmVyU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL3BvcG92ZXIuc2VydmljZSc7XG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbcG9wcHlSZW1vdmVPbkNsaWNrXScsXG59KVxuZXhwb3J0IGNsYXNzIFBvcG92ZXJSZW1vdmVPbkNsaWNrRGlyZWN0aXZlIHtcbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snLCBbJyRldmVudCddKVxuICBvbkNsaWNrKCk6IHZvaWQge1xuICAgIHRoaXMucmVtb3ZlKCk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGhvc3Q6IEVsZW1lbnRSZWYsIHByaXZhdGUgcG9wb3ZlclNlcnZpY2U6IFBvcG92ZXJTZXJ2aWNlKSB7fVxuXG4gIHJlbW92ZSgpOiB2b2lkIHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IHBhcmVudEVsZW1lbnQgPSB0aGlzLmhvc3QubmF0aXZlRWxlbWVudC5jbG9zZXN0KCdwb3BweS1jb250ZW50Jyk7XG4gICAgICB0aGlzLnBvcG92ZXJTZXJ2aWNlLnJlbW92ZUJ5TmF0aXZlRWxlbWVudFJlZihwYXJlbnRFbGVtZW50KTtcbiAgICB9KTtcbiAgfVxufVxuIl19