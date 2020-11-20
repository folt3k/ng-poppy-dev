import { ComponentFactoryResolver, EventEmitter, Input, Output, ElementRef, NgZone, Directive, } from '@angular/core';
import { Subject } from 'rxjs';
import { PopoverService } from '../services/popover.service';
export class BasePopoverDirective {
    constructor(componentFactoryResolver, popoverService, hostElement, ngZone) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.popoverService = popoverService;
        this.hostElement = hostElement;
        this.ngZone = ngZone;
        this.trigger = 'click';
        // Options
        this.delayClose = null;
        this.closeOnTriggerAgain = undefined;
        this.closeOnClickOutside = true;
        this.hideOnScroll = false;
        // Emitters
        this.afterClose = new EventEmitter();
        this.afterShow = new EventEmitter();
        this.type = 'popover';
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        this.setOptions();
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.unsubscribe();
    }
    close() {
        if (this.popoverComponentRef) {
            this.remove(this.popoverComponentRef);
        }
    }
    appendToLayer(options) {
        const injector = this.getPopoverComponentInjector();
        const opts = Object.assign(Object.assign({}, options), { delayClose: this.delayClose, closeOnTriggerAgain: this.closeOnTriggerAgain, hideOnScroll: this.hideOnScroll });
        this.popoverComponentRef = this.popoverService.append(injector, this, opts);
    }
    remove(popoverRef) {
        this.ngZone.run(() => {
            this.popoverService.remove(popoverRef);
        });
    }
    setOptions() {
        if (this.closeOnTriggerAgain === undefined) {
            this.closeOnTriggerAgain = !(this.type === 'tooltip' || this.trigger === 'hover');
        }
    }
}
BasePopoverDirective.decorators = [
    { type: Directive }
];
BasePopoverDirective.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: PopoverService },
    { type: ElementRef },
    { type: NgZone }
];
BasePopoverDirective.propDecorators = {
    trigger: [{ type: Input }],
    delayClose: [{ type: Input }],
    closeOnTriggerAgain: [{ type: Input }],
    closeOnClickOutside: [{ type: Input }],
    hideOnScroll: [{ type: Input }],
    innerClass: [{ type: Input }],
    afterClose: [{ type: Output }],
    afterShow: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1wb3BvdmVyLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL2ZvbHRpL1Byb2plY3RzL25nLXBvcHB5L3Byb2plY3RzL25nLXBvcHB5L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9wb3BvdmVyL2RpcmVjdGl2ZXMvYmFzZS1wb3BvdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCx3QkFBd0IsRUFFeEIsWUFBWSxFQUVaLEtBQUssRUFFTCxNQUFNLEVBQ04sVUFBVSxFQUNWLE1BQU0sRUFDTixTQUFTLEdBRVYsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUUvQixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFLN0QsTUFBTSxPQUFnQixvQkFBb0I7SUFnQnhDLFlBQ3FCLHdCQUFrRCxFQUNsRCxjQUE4QixFQUNqQyxXQUF1QixFQUNwQixNQUFjO1FBSGQsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUEwQjtRQUNsRCxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDakMsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDcEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQW5CMUIsWUFBTyxHQUFtQixPQUFPLENBQUM7UUFDM0MsVUFBVTtRQUNELGVBQVUsR0FBVyxJQUFJLENBQUM7UUFDMUIsd0JBQW1CLEdBQUcsU0FBUyxDQUFDO1FBQ2hDLHdCQUFtQixHQUFHLElBQUksQ0FBQztRQUMzQixpQkFBWSxHQUFZLEtBQUssQ0FBQztRQUV2QyxXQUFXO1FBQ0QsZUFBVSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDaEMsY0FBUyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFHL0IsU0FBSSxHQUFnQixTQUFTLENBQUM7UUFDOUIsYUFBUSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7SUFPaEMsQ0FBQztJQUVKLFFBQVE7UUFDTixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQVFNLEtBQUs7UUFDVixJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtZQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1NBQ3ZDO0lBQ0gsQ0FBQztJQUVTLGFBQWEsQ0FBQyxPQUE2QjtRQUNuRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztRQUNwRCxNQUFNLElBQUksbUNBQ0wsT0FBTyxLQUNWLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUMzQixtQkFBbUIsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQzdDLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxHQUNoQyxDQUFDO1FBRUYsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVTLE1BQU0sQ0FBQyxVQUFpRDtRQUNoRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7WUFDbkIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sVUFBVTtRQUNoQixJQUFJLElBQUksQ0FBQyxtQkFBbUIsS0FBSyxTQUFTLEVBQUU7WUFDMUMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLE9BQU8sQ0FBQyxDQUFDO1NBQ25GO0lBQ0gsQ0FBQzs7O1lBbkVGLFNBQVM7OztZQW5CUix3QkFBd0I7WUFlakIsY0FBYztZQVJyQixVQUFVO1lBQ1YsTUFBTTs7O3NCQWFMLEtBQUs7eUJBRUwsS0FBSztrQ0FDTCxLQUFLO2tDQUNMLEtBQUs7MkJBQ0wsS0FBSzt5QkFDTCxLQUFLO3lCQUVMLE1BQU07d0JBQ04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgQ29tcG9uZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdG9yLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIEVsZW1lbnRSZWYsXG4gIE5nWm9uZSxcbiAgRGlyZWN0aXZlLFxuICBPbkluaXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUG9wb3ZlckNvbnRlbnRDb21wb25lbnQgfSBmcm9tICcuLi9jb21wb25lbnRzL3BvcG92ZXItY29udGVudC9wb3BvdmVyLWNvbnRlbnQuY29tcG9uZW50JztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgUG9wb3ZlclNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9wb3BvdmVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9wb3ZlckFwcGVuZE9wdGlvbnMgfSBmcm9tICcuLi9tb2RlbHMvcG9wb3Zlci1hcHBlbmQtb3B0aW9ucy5tb2RlbCc7XG5pbXBvcnQgeyBQb3BvdmVyVHJpZ2dlciwgUG9wb3ZlclR5cGUgfSBmcm9tICcuLi9wb3BvdmVyLmludGVyZmFjZSc7XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2VQb3BvdmVyRGlyZWN0aXZlIGltcGxlbWVudHMgT25EZXN0cm95LCBPbkluaXQge1xuICBASW5wdXQoKSB0cmlnZ2VyOiBQb3BvdmVyVHJpZ2dlciA9ICdjbGljayc7XG4gIC8vIE9wdGlvbnNcbiAgQElucHV0KCkgZGVsYXlDbG9zZTogbnVtYmVyID0gbnVsbDtcbiAgQElucHV0KCkgY2xvc2VPblRyaWdnZXJBZ2FpbiA9IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgY2xvc2VPbkNsaWNrT3V0c2lkZSA9IHRydWU7XG4gIEBJbnB1dCgpIGhpZGVPblNjcm9sbDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBpbm5lckNsYXNzOiBzdHJpbmc7XG4gIC8vIEVtaXR0ZXJzXG4gIEBPdXRwdXQoKSBhZnRlckNsb3NlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgYWZ0ZXJTaG93ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHBvcG92ZXJDb21wb25lbnRSZWY6IENvbXBvbmVudFJlZjxQb3BvdmVyQ29udGVudENvbXBvbmVudD47XG4gIHByb3RlY3RlZCB0eXBlOiBQb3BvdmVyVHlwZSA9ICdwb3BvdmVyJztcbiAgcHJvdGVjdGVkIGRlc3Ryb3kkID0gbmV3IFN1YmplY3QoKTtcblxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIHByb3RlY3RlZCByZWFkb25seSBwb3BvdmVyU2VydmljZTogUG9wb3ZlclNlcnZpY2UsXG4gICAgcHVibGljIHJlYWRvbmx5IGhvc3RFbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIHByb3RlY3RlZCByZWFkb25seSBuZ1pvbmU6IE5nWm9uZVxuICApIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5zZXRPcHRpb25zKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcbiAgICB0aGlzLmRlc3Ryb3kkLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwdWJsaWMgYWJzdHJhY3Qgb3BlbigpOiB2b2lkO1xuXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBnZXRQb3BvdmVyQ29tcG9uZW50SW5qZWN0b3IoKTogSW5qZWN0b3I7XG5cbiAgcHJvdGVjdGVkIGFic3RyYWN0IGNhbkFwcGVuZCgpOiBib29sZWFuO1xuXG4gIHB1YmxpYyBjbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wb3BvdmVyQ29tcG9uZW50UmVmKSB7XG4gICAgICB0aGlzLnJlbW92ZSh0aGlzLnBvcG92ZXJDb21wb25lbnRSZWYpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBhcHBlbmRUb0xheWVyKG9wdGlvbnM6IFBvcG92ZXJBcHBlbmRPcHRpb25zKTogdm9pZCB7XG4gICAgY29uc3QgaW5qZWN0b3IgPSB0aGlzLmdldFBvcG92ZXJDb21wb25lbnRJbmplY3RvcigpO1xuICAgIGNvbnN0IG9wdHM6IFBvcG92ZXJBcHBlbmRPcHRpb25zID0ge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIGRlbGF5Q2xvc2U6IHRoaXMuZGVsYXlDbG9zZSxcbiAgICAgIGNsb3NlT25UcmlnZ2VyQWdhaW46IHRoaXMuY2xvc2VPblRyaWdnZXJBZ2FpbixcbiAgICAgIGhpZGVPblNjcm9sbDogdGhpcy5oaWRlT25TY3JvbGwsXG4gICAgfTtcblxuICAgIHRoaXMucG9wb3ZlckNvbXBvbmVudFJlZiA9IHRoaXMucG9wb3ZlclNlcnZpY2UuYXBwZW5kKGluamVjdG9yLCB0aGlzLCBvcHRzKTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZW1vdmUocG9wb3ZlclJlZjogQ29tcG9uZW50UmVmPFBvcG92ZXJDb250ZW50Q29tcG9uZW50Pik6IHZvaWQge1xuICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICB0aGlzLnBvcG92ZXJTZXJ2aWNlLnJlbW92ZShwb3BvdmVyUmVmKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0T3B0aW9ucygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jbG9zZU9uVHJpZ2dlckFnYWluID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuY2xvc2VPblRyaWdnZXJBZ2FpbiA9ICEodGhpcy50eXBlID09PSAndG9vbHRpcCcgfHwgdGhpcy50cmlnZ2VyID09PSAnaG92ZXInKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==