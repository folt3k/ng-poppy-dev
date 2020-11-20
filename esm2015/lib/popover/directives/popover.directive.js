import { ComponentFactoryResolver, Directive, ElementRef, Injector, Input, NgZone, } from '@angular/core';
import { fromEvent, merge, timer } from 'rxjs';
import { takeUntil, debounceTime, tap, switchMap, take } from 'rxjs/operators';
import { POPOVER_CONFIG } from '../popover.token';
import { PopoverService } from '../services/popover.service';
import { PopoverAppendOptions } from '../models/popover-append-options.model';
import { BasePopoverDirective } from './base-popover';
export class PopoverDirective extends BasePopoverDirective {
    constructor(componentFactoryResolver, popoverService, hostElement, ngZone) {
        super(componentFactoryResolver, popoverService, hostElement, ngZone);
        this.componentFactoryResolver = componentFactoryResolver;
        this.popoverService = popoverService;
        this.hostElement = hostElement;
        this.ngZone = ngZone;
    }
    ngAfterViewInit() {
        if (this.poppyPopover) {
            this.ngZone.runOutsideAngular(() => {
                if (this.trigger === 'click') {
                    this.listenEventsForClickTrigger();
                }
                if (this.trigger === 'hover') {
                    this.listenEventsForHoverTrigger();
                }
            });
        }
    }
    open() {
        if (this.canAppend()) {
            this.ngZone.run(() => {
                this.append();
            });
        }
    }
    getPopoverComponentInjector() {
        const providerValues = {
            bounds: this.hostElement.nativeElement.getBoundingClientRect(),
            type: this.type,
            trigger: this.trigger,
            triggerElement: this.hostElement,
            triggerDirective: this,
            content: this.poppyPopover,
            closeOnClickOutside: this.closeOnClickOutside,
            innerClass: this.innerClass,
        };
        return Injector.create([
            {
                provide: POPOVER_CONFIG,
                useValue: providerValues,
            },
        ]);
    }
    canAppend() {
        return !this.popoverComponentRef || (this.popoverComponentRef && this.closeOnTriggerAgain);
    }
    listenEventsForClickTrigger() {
        fromEvent(this.hostElement.nativeElement, 'click')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            this.open();
        });
    }
    listenEventsForHoverTrigger() {
        let popoverHovered = false;
        let hostHovered = false;
        let isMouseLeftBeforeDelayTimePast = false;
        merge(fromEvent(this.hostElement.nativeElement, 'mouseenter'), fromEvent(this.hostElement.nativeElement, 'click'))
            .pipe(takeUntil(this.destroy$), tap(() => {
            fromEvent(this.hostElement.nativeElement, 'mouseleave')
                .pipe(takeUntil(this.destroy$), takeUntil(this.afterClose), debounceTime(200))
                .subscribe(() => {
                hostHovered = false;
                isMouseLeftBeforeDelayTimePast = true;
                setTimeout(() => {
                    isMouseLeftBeforeDelayTimePast = false;
                }, 200);
                if (!popoverHovered) {
                    this.remove(this.popoverComponentRef);
                }
            });
        }), switchMap(() => timer(300)))
            .subscribe(() => {
            const isHostElementStillInDOM = document.body.contains(this.hostElement.nativeElement);
            popoverHovered = false;
            hostHovered = true;
            if (isHostElementStillInDOM && !isMouseLeftBeforeDelayTimePast) {
                this.open();
            }
            setTimeout(() => {
                if (this.popoverComponentRef) {
                    fromEvent(this.popoverComponentRef.instance.element.nativeElement, 'mouseenter')
                        .pipe(takeUntil(this.afterClose))
                        .subscribe(() => {
                        popoverHovered = true;
                    });
                    fromEvent(this.popoverComponentRef.instance.element.nativeElement, 'mouseleave')
                        .pipe(takeUntil(this.afterClose))
                        .subscribe(() => {
                        popoverHovered = false;
                        if (!hostHovered) {
                            this.remove(this.popoverComponentRef);
                        }
                    });
                }
            }, 0);
        });
        this.destroy$.pipe(take(1)).subscribe(() => {
            if (this.popoverComponentRef) {
                this.remove(this.popoverComponentRef);
            }
        });
    }
    append() {
        const options = new PopoverAppendOptions({
            type: 'popover',
            triggeredBy: this.trigger,
        });
        this.appendToLayer(options);
    }
}
PopoverDirective.decorators = [
    { type: Directive, args: [{
                selector: '[poppyPopover]',
                exportAs: 'poppyPopover',
            },] }
];
PopoverDirective.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: PopoverService },
    { type: ElementRef },
    { type: NgZone }
];
PopoverDirective.propDecorators = {
    poppyPopover: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvZm9sdGkvUHJvamVjdHMvbmctcG9wcHkvcHJvamVjdHMvbmctcG9wcHkvc3JjLyIsInNvdXJjZXMiOlsibGliL3BvcG92ZXIvZGlyZWN0aXZlcy9wb3BvdmVyLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsd0JBQXdCLEVBQ3hCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsUUFBUSxFQUNSLEtBQUssRUFDTCxNQUFNLEdBRVAsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDL0UsT0FBTyxFQUFFLGNBQWMsRUFBaUIsTUFBTSxrQkFBa0IsQ0FBQztBQUNqRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDN0QsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDOUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFPdEQsTUFBTSxPQUFPLGdCQUFpQixTQUFRLG9CQUFvQjtJQUd4RCxZQUNxQix3QkFBa0QsRUFDbEQsY0FBOEIsRUFDakMsV0FBdUIsRUFDcEIsTUFBYztRQUVqQyxLQUFLLENBQUMsd0JBQXdCLEVBQUUsY0FBYyxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUxsRCw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQTBCO1FBQ2xELG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUNqQyxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUNwQixXQUFNLEdBQU4sTUFBTSxDQUFRO0lBR25DLENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFB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QyxXQUFXLEVBQUU7NEJBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7eUJBQ3ZDO29CQUNILENBQUMsQ0FBQyxDQUFDO2lCQUNOO1lBQ0gsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ1IsQ0FBQyxDQUFDLENBQUM7UUFFTCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ3pDLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO2dCQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2FBQ3ZDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sTUFBTTtRQUNaLE1BQU0sT0FBTyxHQUFHLElBQUksb0JBQW9CLENBQUM7WUFDdkMsSUFBSSxFQUFFLFNBQVM7WUFDZixXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDMUIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixDQUFDOzs7WUE1SUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLFFBQVEsRUFBRSxjQUFjO2FBQ3pCOzs7WUFuQkMsd0JBQXdCO1lBV2pCLGNBQWM7WUFUckIsVUFBVTtZQUdWLE1BQU07OzsyQkFnQkwsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3RvcixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgVGVtcGxhdGVSZWYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBtZXJnZSwgdGltZXIgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCwgZGVib3VuY2VUaW1lLCB0YXAsIHN3aXRjaE1hcCwgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IFBPUE9WRVJfQ09ORklHLCBQb3BvdmVyQ29uZmlnIH0gZnJvbSAnLi4vcG9wb3Zlci50b2tlbic7XG5pbXBvcnQgeyBQb3BvdmVyU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL3BvcG92ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBQb3BvdmVyQXBwZW5kT3B0aW9ucyB9IGZyb20gJy4uL21vZGVscy9wb3BvdmVyLWFwcGVuZC1vcHRpb25zLm1vZGVsJztcbmltcG9ydCB7IEJhc2VQb3BvdmVyRGlyZWN0aXZlIH0gZnJvbSAnLi9iYXNlLXBvcG92ZXInO1xuaW1wb3J0IHsgUG9wb3ZlclR5cGUgfSBmcm9tICcuLi9wb3BvdmVyLmludGVyZmFjZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1twb3BweVBvcG92ZXJdJyxcbiAgZXhwb3J0QXM6ICdwb3BweVBvcG92ZXInLFxufSlcbmV4cG9ydCBjbGFzcyBQb3BvdmVyRGlyZWN0aXZlIGV4dGVuZHMgQmFzZVBvcG92ZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCkgcG9wcHlQb3BvdmVyOiBUZW1wbGF0ZVJlZjxIVE1MRWxlbWVudD4gfCBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIHByb3RlY3RlZCByZWFkb25seSBwb3BvdmVyU2VydmljZTogUG9wb3ZlclNlcnZpY2UsXG4gICAgcHVibGljIHJlYWRvbmx5IGhvc3RFbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCByZWFkb25seSBuZ1pvbmU6IE5nWm9uZVxuICApIHtcbiAgICBzdXBlcihjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIHBvcG92ZXJTZXJ2aWNlLCBob3N0RWxlbWVudCwgbmdab25lKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wb3BweVBvcG92ZXIpIHtcbiAgICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMudHJpZ2dlciA9PT0gJ2NsaWNrJykge1xuICAgICAgICAgIHRoaXMubGlzdGVuRXZlbnRzRm9yQ2xpY2tUcmlnZ2VyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50cmlnZ2VyID09PSAnaG92ZXInKSB7XG4gICAgICAgICAgdGhpcy5saXN0ZW5FdmVudHNGb3JIb3ZlclRyaWdnZXIoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgb3BlbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jYW5BcHBlbmQoKSkge1xuICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5hcHBlbmQoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRQb3BvdmVyQ29tcG9uZW50SW5qZWN0b3IoKTogSW5qZWN0b3Ige1xuICAgIGNvbnN0IHByb3ZpZGVyVmFsdWVzOiBQb3BvdmVyQ29uZmlnID0ge1xuICAgICAgYm91bmRzOiB0aGlzLmhvc3RFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksXG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICB0cmlnZ2VyOiB0aGlzLnRyaWdnZXIsXG4gICAgICB0cmlnZ2VyRWxlbWVudDogdGhpcy5ob3N0RWxlbWVudCxcbiAgICAgIHRyaWdnZXJEaXJlY3RpdmU6IHRoaXMsXG4gICAgICBjb250ZW50OiB0aGlzLnBvcHB5UG9wb3ZlcixcbiAgICAgIGNsb3NlT25DbGlja091dHNpZGU6IHRoaXMuY2xvc2VPbkNsaWNrT3V0c2lkZSxcbiAgICAgIGlubmVyQ2xhc3M6IHRoaXMuaW5uZXJDbGFzcyxcbiAgICB9O1xuXG4gICAgcmV0dXJuIEluamVjdG9yLmNyZWF0ZShbXG4gICAgICB7XG4gICAgICAgIHByb3ZpZGU6IFBPUE9WRVJfQ09ORklHLFxuICAgICAgICB1c2VWYWx1ZTogcHJvdmlkZXJWYWx1ZXMsXG4gICAgICB9LFxuICAgIF0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNhbkFwcGVuZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMucG9wb3ZlckNvbXBvbmVudFJlZiB8fCAodGhpcy5wb3BvdmVyQ29tcG9uZW50UmVmICYmIHRoaXMuY2xvc2VPblRyaWdnZXJBZ2Fpbik7XG4gIH1cblxuICBwcml2YXRlIGxpc3RlbkV2ZW50c0ZvckNsaWNrVHJpZ2dlcigpOiB2b2lkIHtcbiAgICBmcm9tRXZlbnQodGhpcy5ob3N0RWxlbWVudC5uYXRpdmVFbGVtZW50LCAnY2xpY2snKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGxpc3RlbkV2ZW50c0ZvckhvdmVyVHJpZ2dlcigpOiB2b2lkIHtcbiAgICBsZXQgcG9wb3ZlckhvdmVyZWQgPSBmYWxzZTtcbiAgICBsZXQgaG9zdEhvdmVyZWQgPSBmYWxzZTtcbiAgICBsZXQgaXNNb3VzZUxlZnRCZWZvcmVEZWxheVRpbWVQYXN0ID0gZmFsc2U7XG5cbiAgICBtZXJnZShcbiAgICAgIGZyb21FdmVudCh0aGlzLmhvc3RFbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdtb3VzZWVudGVyJyksXG4gICAgICBmcm9tRXZlbnQodGhpcy5ob3N0RWxlbWVudC5uYXRpdmVFbGVtZW50LCAnY2xpY2snKVxuICAgIClcbiAgICAgIC5waXBlKFxuICAgICAgICB0YWtlVW50aWwodGhpcy5kZXN0cm95JCksXG4gICAgICAgIHRhcCgoKSA9PiB7XG4gICAgICAgICAgZnJvbUV2ZW50KHRoaXMuaG9zdEVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ21vdXNlbGVhdmUnKVxuICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpLCB0YWtlVW50aWwodGhpcy5hZnRlckNsb3NlKSwgZGVib3VuY2VUaW1lKDIwMCkpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgaG9zdEhvdmVyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgaXNNb3VzZUxlZnRCZWZvcmVEZWxheVRpbWVQYXN0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaXNNb3VzZUxlZnRCZWZvcmVEZWxheVRpbWVQYXN0ID0gZmFsc2U7XG4gICAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgICAgICAgIGlmICghcG9wb3ZlckhvdmVyZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZSh0aGlzLnBvcG92ZXJDb21wb25lbnRSZWYpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSksXG4gICAgICAgIHN3aXRjaE1hcCgoKSA9PiB0aW1lcigzMDApKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGlzSG9zdEVsZW1lbnRTdGlsbEluRE9NID0gZG9jdW1lbnQuYm9keS5jb250YWlucyh0aGlzLmhvc3RFbGVtZW50Lm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICBwb3BvdmVySG92ZXJlZCA9IGZhbHNlO1xuICAgICAgICBob3N0SG92ZXJlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKGlzSG9zdEVsZW1lbnRTdGlsbEluRE9NICYmICFpc01vdXNlTGVmdEJlZm9yZURlbGF5VGltZVBhc3QpIHtcbiAgICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLnBvcG92ZXJDb21wb25lbnRSZWYpIHtcbiAgICAgICAgICAgIGZyb21FdmVudCh0aGlzLnBvcG92ZXJDb21wb25lbnRSZWYuaW5zdGFuY2UuZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnbW91c2VlbnRlcicpXG4gICAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmFmdGVyQ2xvc2UpKVxuICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICBwb3BvdmVySG92ZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmcm9tRXZlbnQodGhpcy5wb3BvdmVyQ29tcG9uZW50UmVmLmluc3RhbmNlLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ21vdXNlbGVhdmUnKVxuICAgICAgICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5hZnRlckNsb3NlKSlcbiAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcG9wb3ZlckhvdmVyZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAoIWhvc3RIb3ZlcmVkKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZSh0aGlzLnBvcG92ZXJDb21wb25lbnRSZWYpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5kZXN0cm95JC5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5wb3BvdmVyQ29tcG9uZW50UmVmKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlKHRoaXMucG9wb3ZlckNvbXBvbmVudFJlZik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFwcGVuZCgpOiB2b2lkIHtcbiAgICBjb25zdCBvcHRpb25zID0gbmV3IFBvcG92ZXJBcHBlbmRPcHRpb25zKHtcbiAgICAgIHR5cGU6ICdwb3BvdmVyJyxcbiAgICAgIHRyaWdnZXJlZEJ5OiB0aGlzLnRyaWdnZXIsXG4gICAgfSk7XG5cbiAgICB0aGlzLmFwcGVuZFRvTGF5ZXIob3B0aW9ucyk7XG4gIH1cbn1cbiJdfQ==