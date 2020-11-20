import { Injectable, NgZone } from '@angular/core';
import { merge, fromEvent } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as i0 from "@angular/core";
export class PopoverEventsService {
    constructor(ngZone) {
        this.ngZone = ngZone;
        this.registeredEvents = [];
    }
    register(type, activePopover, callback) {
        let sub;
        this.ngZone.runOutsideAngular(() => {
            const obs = this.getEventObservable(type);
            sub = obs.subscribe((event) => {
                callback(event);
            });
        });
        this.registeredEvents.push({ popover: activePopover, type, sub, callback });
    }
    unregister(type, activePopover) {
        this.registeredEvents
            .filter((event) => event.type === type)
            .forEach((event) => {
            if (event.popover === activePopover) {
                event.sub.unsubscribe();
            }
        });
        this.registeredEvents = this.registeredEvents.filter((event) => event.type === type ? event.popover !== activePopover : true);
    }
    subscribe(type, popover) {
        const obs = this.getEventObservable(type);
        this.registeredEvents
            .filter((event) => { var _a; return event.type === type && event.popover === popover && ((_a = event.sub) === null || _a === void 0 ? void 0 : _a.closed); })
            .forEach((event) => {
            event.sub = obs.subscribe((e) => event.callback(e));
        });
    }
    unsubscribe(type, popover) {
        this.registeredEvents
            .filter((event) => event.type === type && event.popover === popover)
            .forEach((event) => {
            event.sub.unsubscribe();
        });
    }
    getEventObservable(type) {
        switch (type) {
            case 'click-outside':
                return merge(fromEvent(document, 'click'), fromEvent(document, 'contextmenu'))
                    .pipe();
            case 'capture-scroll':
                return fromEvent(document, 'scroll').pipe(tap(() => {
                    // console.log('Capturing scroll event..');
                }));
            case 'resize':
                return fromEvent(window, 'resize').pipe(tap(() => {
                    // console.log('Resize event..');
                }));
        }
    }
}
PopoverEventsService.ɵprov = i0.ɵɵdefineInjectable({ factory: function PopoverEventsService_Factory() { return new PopoverEventsService(i0.ɵɵinject(i0.NgZone)); }, token: PopoverEventsService, providedIn: "root" });
PopoverEventsService.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
PopoverEventsService.ctorParameters = () => [
    { type: NgZone }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvZm9sdGkvUHJvamVjdHMvbmctcG9wcHkvcHJvamVjdHMvbmctcG9wcHkvc3JjLyIsInNvdXJjZXMiOlsibGliL3BvcG92ZXIvc2VydmljZXMvZXZlbnRzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFbkQsT0FBTyxFQUE0QixLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRWxFLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFZckMsTUFBTSxPQUFPLG9CQUFvQjtJQUcvQixZQUFvQixNQUFjO1FBQWQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUYxQixxQkFBZ0IsR0FBNkIsRUFBRSxDQUFDO0lBRW5CLENBQUM7SUFFdEMsUUFBUSxDQUNOLElBQXNCLEVBQ3RCLGFBQTRCLEVBQzVCLFFBQXNDO1FBRXRDLElBQUksR0FBaUIsQ0FBQztRQUV0QixJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtZQUNqQyxNQUFNLEdBQUcsR0FBc0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdELEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQzVCLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNsQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFRCxVQUFVLENBQUMsSUFBc0IsRUFBRSxhQUE0QjtRQUM3RCxJQUFJLENBQUMsZ0JBQWdCO2FBQ2xCLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUM7YUFDdEMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDakIsSUFBSSxLQUFLLENBQUMsT0FBTyxLQUFLLGFBQWEsRUFBRTtnQkFDbkMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQzthQUN6QjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUM3RCxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDN0QsQ0FBQztJQUNKLENBQUM7SUFFRCxTQUFTLENBQUMsSUFBc0IsRUFBRSxPQUFzQjtRQUN0RCxNQUFNLEdBQUcsR0FBc0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTdELElBQUksQ0FBQyxnQkFBZ0I7YUFDbEIsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsV0FBQyxPQUFBLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSSxJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssT0FBTyxXQUFJLEtBQUssQ0FBQyxHQUFHLDBDQUFFLE1BQU0sQ0FBQSxDQUFBLEVBQUEsQ0FBQzthQUN4RixPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUNqQixLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxXQUFXLENBQUMsSUFBc0IsRUFBRSxPQUFzQjtRQUN4RCxJQUFJLENBQUMsZ0JBQWdCO2FBQ2xCLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxPQUFPLENBQUM7YUFDbkUsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDakIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTyxrQkFBa0IsQ0FBQyxJQUFzQjtRQUMvQyxRQUFRLElBQUksRUFBRTtZQUNaLEtBQUssZUFBZTtnQkFDbEIsT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsRUFBRSxTQUFTLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDO3FCQUMzRSxJQUFJLEVBRUgsQ0FBQztZQUNQLEtBQUssZ0JBQWdCO2dCQUNuQixPQUFPLFNBQVMsQ0FBYSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUNuRCxHQUFHLENBQUMsR0FBRyxFQUFFO29CQUNQLDJDQUEyQztnQkFDN0MsQ0FBQyxDQUFDLENBQ0gsQ0FBQztZQUNKLEtBQUssUUFBUTtnQkFDWCxPQUFPLFNBQVMsQ0FBYSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUNqRCxHQUFHLENBQUMsR0FBRyxFQUFFO29CQUNQLGlDQUFpQztnQkFDbkMsQ0FBQyxDQUFDLENBQ0gsQ0FBQztTQUNMO0lBQ0gsQ0FBQzs7OztZQTFFRixVQUFVLFNBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzs7WUFmYixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgTmdab25lIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJUG9wb3ZlckV2ZW50U2VydmljZSB9IGZyb20gJy4uL3BvcG92ZXIuaW50ZXJmYWNlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiwgT2JzZXJ2YWJsZSwgbWVyZ2UsIGZyb21FdmVudCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQWN0aXZlUG9wb3ZlciB9IGZyb20gJy4uL21vZGVscy9wb3BvdmVyLWFjdGl2ZS5tb2RlbCc7XG5pbXBvcnQgeyB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmV4cG9ydCB0eXBlIFBvcG92ZXJFdmVudFR5cGUgPSAnY2xpY2stb3V0c2lkZScgfCAncmVzaXplJyB8ICdjYXB0dXJlLXNjcm9sbCc7XG5cbmludGVyZmFjZSBQb3BvdmVyUmVnaXN0ZXJlZEV2ZW50IHtcbiAgc3ViOiBTdWJzY3JpcHRpb247XG4gIHBvcG92ZXI6IEFjdGl2ZVBvcG92ZXI7XG4gIHR5cGU6IFBvcG92ZXJFdmVudFR5cGU7XG4gIGNhbGxiYWNrPzogKGFyZ3M/KSA9PiB2b2lkIHwgYW55O1xufVxuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIFBvcG92ZXJFdmVudHNTZXJ2aWNlIGltcGxlbWVudHMgSVBvcG92ZXJFdmVudFNlcnZpY2Uge1xuICBwcml2YXRlIHJlZ2lzdGVyZWRFdmVudHM6IFBvcG92ZXJSZWdpc3RlcmVkRXZlbnRbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbmdab25lOiBOZ1pvbmUpIHt9XG5cbiAgcmVnaXN0ZXIoXG4gICAgdHlwZTogUG9wb3ZlckV2ZW50VHlwZSxcbiAgICBhY3RpdmVQb3BvdmVyOiBBY3RpdmVQb3BvdmVyLFxuICAgIGNhbGxiYWNrOiAoZXZlbnQ6IEV2ZW50KSA9PiB2b2lkIHwgYW55XG4gICk6IHZvaWQge1xuICAgIGxldCBzdWI6IFN1YnNjcmlwdGlvbjtcblxuICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGNvbnN0IG9iczogT2JzZXJ2YWJsZTxFdmVudD4gPSB0aGlzLmdldEV2ZW50T2JzZXJ2YWJsZSh0eXBlKTtcbiAgICAgIHN1YiA9IG9icy5zdWJzY3JpYmUoKGV2ZW50KSA9PiB7XG4gICAgICAgIGNhbGxiYWNrKGV2ZW50KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZWdpc3RlcmVkRXZlbnRzLnB1c2goeyBwb3BvdmVyOiBhY3RpdmVQb3BvdmVyLCB0eXBlLCBzdWIsIGNhbGxiYWNrIH0pO1xuICB9XG5cbiAgdW5yZWdpc3Rlcih0eXBlOiBQb3BvdmVyRXZlbnRUeXBlLCBhY3RpdmVQb3BvdmVyOiBBY3RpdmVQb3BvdmVyKTogdm9pZCB7XG4gICAgdGhpcy5yZWdpc3RlcmVkRXZlbnRzXG4gICAgICAuZmlsdGVyKChldmVudCkgPT4gZXZlbnQudHlwZSA9PT0gdHlwZSlcbiAgICAgIC5mb3JFYWNoKChldmVudCkgPT4ge1xuICAgICAgICBpZiAoZXZlbnQucG9wb3ZlciA9PT0gYWN0aXZlUG9wb3Zlcikge1xuICAgICAgICAgIGV2ZW50LnN1Yi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB0aGlzLnJlZ2lzdGVyZWRFdmVudHMgPSB0aGlzLnJlZ2lzdGVyZWRFdmVudHMuZmlsdGVyKChldmVudCkgPT5cbiAgICAgIGV2ZW50LnR5cGUgPT09IHR5cGUgPyBldmVudC5wb3BvdmVyICE9PSBhY3RpdmVQb3BvdmVyIDogdHJ1ZVxuICAgICk7XG4gIH1cblxuICBzdWJzY3JpYmUodHlwZTogUG9wb3ZlckV2ZW50VHlwZSwgcG9wb3ZlcjogQWN0aXZlUG9wb3Zlcik6IHZvaWQge1xuICAgIGNvbnN0IG9iczogT2JzZXJ2YWJsZTxFdmVudD4gPSB0aGlzLmdldEV2ZW50T2JzZXJ2YWJsZSh0eXBlKTtcblxuICAgIHRoaXMucmVnaXN0ZXJlZEV2ZW50c1xuICAgICAgLmZpbHRlcigoZXZlbnQpID0+IGV2ZW50LnR5cGUgPT09IHR5cGUgJiYgZXZlbnQucG9wb3ZlciA9PT0gcG9wb3ZlciAmJiBldmVudC5zdWI/LmNsb3NlZClcbiAgICAgIC5mb3JFYWNoKChldmVudCkgPT4ge1xuICAgICAgICBldmVudC5zdWIgPSBvYnMuc3Vic2NyaWJlKChlKSA9PiBldmVudC5jYWxsYmFjayhlKSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKHR5cGU6IFBvcG92ZXJFdmVudFR5cGUsIHBvcG92ZXI6IEFjdGl2ZVBvcG92ZXIpOiB2b2lkIHtcbiAgICB0aGlzLnJlZ2lzdGVyZWRFdmVudHNcbiAgICAgIC5maWx0ZXIoKGV2ZW50KSA9PiBldmVudC50eXBlID09PSB0eXBlICYmIGV2ZW50LnBvcG92ZXIgPT09IHBvcG92ZXIpXG4gICAgICAuZm9yRWFjaCgoZXZlbnQpID0+IHtcbiAgICAgICAgZXZlbnQuc3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RXZlbnRPYnNlcnZhYmxlKHR5cGU6IFBvcG92ZXJFdmVudFR5cGUpOiBPYnNlcnZhYmxlPEV2ZW50PiB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdjbGljay1vdXRzaWRlJzpcbiAgICAgICAgcmV0dXJuIG1lcmdlKGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyksIGZyb21FdmVudChkb2N1bWVudCwgJ2NvbnRleHRtZW51JykpXG4gICAgICAgICAgLnBpcGVcbiAgICAgICAgICAvLyB0YXAoKCkgPT4gY29uc29sZS5sb2coJ2xpc3RlbiBmb3IgY2xpY2sgb3V0c2lkZS4uJykpXG4gICAgICAgICAgKCk7XG4gICAgICBjYXNlICdjYXB0dXJlLXNjcm9sbCc6XG4gICAgICAgIHJldHVybiBmcm9tRXZlbnQ8TW91c2VFdmVudD4oZG9jdW1lbnQsICdzY3JvbGwnKS5waXBlKFxuICAgICAgICAgIHRhcCgoKSA9PiB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnQ2FwdHVyaW5nIHNjcm9sbCBldmVudC4uJyk7XG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIGNhc2UgJ3Jlc2l6ZSc6XG4gICAgICAgIHJldHVybiBmcm9tRXZlbnQ8TW91c2VFdmVudD4od2luZG93LCAncmVzaXplJykucGlwZShcbiAgICAgICAgICB0YXAoKCkgPT4ge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1Jlc2l6ZSBldmVudC4uJyk7XG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==