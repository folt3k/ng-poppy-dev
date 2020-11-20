import { ComponentFactoryResolver, Directive, ElementRef, Input, NgZone, } from '@angular/core';
import { PopoverDirective } from './popover.directive';
import { PopoverService } from '../services/popover.service';
export class TooltipDirective extends PopoverDirective {
    constructor(componentFactoryResolver, popoverService, hostElement, ngZone) {
        super(componentFactoryResolver, popoverService, hostElement, ngZone);
        this.componentFactoryResolver = componentFactoryResolver;
        this.popoverService = popoverService;
        this.hostElement = hostElement;
        this.ngZone = ngZone;
        this.trigger = 'hover';
        this.type = 'tooltip';
    }
    ngOnInit() {
        this.poppyPopover = this.poppyTooltip;
    }
}
TooltipDirective.decorators = [
    { type: Directive, args: [{
                selector: '[poppyTooltip]',
            },] }
];
TooltipDirective.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: PopoverService },
    { type: ElementRef },
    { type: NgZone }
];
TooltipDirective.propDecorators = {
    poppyTooltip: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvZm9sdGkvUHJvamVjdHMvbmctcG9wcHkvcHJvamVjdHMvbmctcG9wcHkvc3JjLyIsInNvdXJjZXMiOlsibGliL3BvcG92ZXIvZGlyZWN0aXZlcy90b29sdGlwLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsd0JBQXdCLEVBQ3hCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUNMLE1BQU0sR0FHUCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFNN0QsTUFBTSxPQUFPLGdCQUFpQixTQUFRLGdCQUFnQjtJQU1wRCxZQUNxQix3QkFBa0QsRUFDbEQsY0FBOEIsRUFDakMsV0FBdUIsRUFDcEIsTUFBYztRQUVqQyxLQUFLLENBQUMsd0JBQXdCLEVBQUUsY0FBYyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUxsRCw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQTBCO1FBQ2xELG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUNqQyxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUNwQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBUG5DLFlBQU8sR0FBbUIsT0FBTyxDQUFDO1FBQ2xDLFNBQUksR0FBZ0IsU0FBUyxDQUFDO0lBUzlCLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQ3hDLENBQUM7OztZQXBCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjthQUMzQjs7O1lBZkMsd0JBQXdCO1lBVWpCLGNBQWM7WUFSckIsVUFBVTtZQUVWLE1BQU07OzsyQkFhTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uSW5pdCxcbiAgVGVtcGxhdGVSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBQb3BvdmVyRGlyZWN0aXZlIH0gZnJvbSAnLi9wb3BvdmVyLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBQb3BvdmVyU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL3BvcG92ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb3BvdmVyVHJpZ2dlciwgUG9wb3ZlclR5cGUgfSBmcm9tICcuLi9wb3BvdmVyLmludGVyZmFjZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1twb3BweVRvb2x0aXBdJyxcbn0pXG5leHBvcnQgY2xhc3MgVG9vbHRpcERpcmVjdGl2ZSBleHRlbmRzIFBvcG92ZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKSBwb3BweVRvb2x0aXA6IHN0cmluZyB8IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgdHJpZ2dlcjogUG9wb3ZlclRyaWdnZXIgPSAnaG92ZXInO1xuICB0eXBlOiBQb3BvdmVyVHlwZSA9ICd0b29sdGlwJztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHBvcG92ZXJTZXJ2aWNlOiBQb3BvdmVyU2VydmljZSxcbiAgICBwdWJsaWMgcmVhZG9ubHkgaG9zdEVsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IG5nWm9uZTogTmdab25lXG4gICkge1xuICAgIHN1cGVyKGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgcG9wb3ZlclNlcnZpY2UsIGhvc3RFbGVtZW50LCBuZ1pvbmUpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5wb3BweVBvcG92ZXIgPSB0aGlzLnBvcHB5VG9vbHRpcDtcbiAgfVxufVxuIl19