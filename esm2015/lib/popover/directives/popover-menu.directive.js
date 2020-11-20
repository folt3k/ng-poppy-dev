import { ComponentFactoryResolver, Directive, ElementRef, Injector, Input, NgZone, } from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { POPOVER_CONFIG } from '../popover.token';
import { PopoverService } from '../services/popover.service';
import { PopoverAppendOptions } from '../models/popover-append-options.model';
import { BasePopoverDirective } from './base-popover';
export class PopoverMenuDirective extends BasePopoverDirective {
    constructor(componentFactoryResolver, popoverService, hostElement, ngZone) {
        super(componentFactoryResolver, popoverService, hostElement, ngZone);
        this.componentFactoryResolver = componentFactoryResolver;
        this.popoverService = popoverService;
        this.hostElement = hostElement;
        this.ngZone = ngZone;
        this.type = 'menu';
        this.closeOnClickItem = true;
    }
    ngAfterViewInit() {
        if (this.poppyMenu) {
            this.ngZone.runOutsideAngular(() => {
                if (this.trigger !== 'manual' && this.type === 'menu') {
                    this.listenEventsForClickTrigger();
                }
                if (this.type === 'context') {
                    this.listenEventsForContextTrigger();
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
    // NOTE: It should be removed after upgrade to ng 9, because QueryList should emit changes
    // when elements is removed
    updateContentPosition() {
        if (this.popoverComponentRef) {
            this.popoverComponentRef.instance.componentStyles.update();
        }
    }
    getPopoverComponentInjector() {
        const providerValues = {
            bounds: this.getBounds(),
            type: this.type,
            triggerElement: this.hostElement,
            triggerDirective: this,
            closeOnClickOutside: this.closeOnClickOutside,
            closeOnClickItem: this.closeOnClickItem,
            menuRef: this.poppyMenu,
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
        return (!this.popoverComponentRef ||
            (this.popoverComponentRef && this.type === 'context') ||
            (this.popoverComponentRef && this.closeOnTriggerAgain));
    }
    listenEventsForClickTrigger() {
        fromEvent(this.hostElement.nativeElement, 'click')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            this.open();
        });
    }
    listenEventsForContextTrigger() {
        fromEvent(this.hostElement.nativeElement, 'contextmenu')
            .pipe(takeUntil(this.destroy$))
            .subscribe((event) => {
            event.preventDefault();
            this.contextMenuPosition = {
                top: event.clientY,
                left: event.clientX,
            };
            this.open();
        });
    }
    append() {
        const options = new PopoverAppendOptions({
            type: this.type,
        });
        this.appendToLayer(options);
    }
    getBounds() {
        if (this.type === 'context') {
            return { top: this.contextMenuPosition.top, left: this.contextMenuPosition.left };
        }
        else {
            return this.hostElement.nativeElement.getBoundingClientRect();
        }
    }
}
PopoverMenuDirective.decorators = [
    { type: Directive, args: [{
                selector: '[poppyMenu]',
                exportAs: 'poppyMenu',
            },] }
];
PopoverMenuDirective.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: PopoverService },
    { type: ElementRef },
    { type: NgZone }
];
PopoverMenuDirective.propDecorators = {
    poppyMenu: [{ type: Input }],
    type: [{ type: Input }],
    closeOnClickItem: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1tZW51LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS9mb2x0aS9Qcm9qZWN0cy9uZy1wb3BweS9wcm9qZWN0cy9uZy1wb3BweS9zcmMvIiwic291cmNlcyI6WyJsaWIvcG9wb3Zlci9kaXJlY3RpdmVzL3BvcG92ZXItbWVudS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLHdCQUF3QixFQUN4QixTQUFTLEVBQ1QsVUFBVSxFQUNWLFFBQVEsRUFDUixLQUFLLEVBQ0wsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDakMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxjQUFjLEVBQWlCLE1BQU0sa0JBQWtCLENBQUM7QUFFakUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzdELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQzlFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBT3RELE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxvQkFBb0I7SUFPNUQsWUFDcUIsd0JBQWtELEVBQ2xELGNBQThCLEVBQ2pDLFdBQXVCLEVBQ3BCLE1BQWM7UUFFakMsS0FBSyxDQUFDLHdCQUF3QixFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFMbEQsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUEwQjtRQUNsRCxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUFDakMsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDcEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQVQxQixTQUFJLEdBQW9CLE1BQU0sQ0FBQztRQUMvQixxQkFBZ0IsR0FBWSxJQUFJLENBQUM7SUFXMUMsQ0FBQztJQUVELGVBQWU7UUFD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QUFvQixDQUFDO1lBQ3ZDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtTQUNoQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTyxTQUFTO1FBQ2YsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtZQUMzQixPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNuRjthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1NBQy9EO0lBQ0gsQ0FBQzs7O1lBakhGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsYUFBYTtnQkFDdkIsUUFBUSxFQUFFLFdBQVc7YUFDdEI7OztZQW5CQyx3QkFBd0I7WUFXakIsY0FBYztZQVRyQixVQUFVO1lBR1YsTUFBTTs7O3dCQWdCTCxLQUFLO21CQUNMLEtBQUs7K0JBQ0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3RvcixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBmcm9tRXZlbnQgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IFBPUE9WRVJfQ09ORklHLCBQb3BvdmVyQ29uZmlnIH0gZnJvbSAnLi4vcG9wb3Zlci50b2tlbic7XG5pbXBvcnQgeyBQb3BvdmVyQm91bmRzLCBQb3BvdmVyQ29udGV4dE1lbnVQb3NpdGlvbiwgUG9wb3Zlck1lbnVUeXBlIH0gZnJvbSAnLi4vcG9wb3Zlci5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgUG9wb3ZlclNlcnZpY2UgfSBmcm9tICcuLi9zZXJ2aWNlcy9wb3BvdmVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9wb3ZlckFwcGVuZE9wdGlvbnMgfSBmcm9tICcuLi9tb2RlbHMvcG9wb3Zlci1hcHBlbmQtb3B0aW9ucy5tb2RlbCc7XG5pbXBvcnQgeyBCYXNlUG9wb3ZlckRpcmVjdGl2ZSB9IGZyb20gJy4vYmFzZS1wb3BvdmVyJztcbmltcG9ydCB7IFBvcG92ZXJNZW51Q29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9wb3BvdmVyLW1lbnUvcG9wb3Zlci1tZW51LmNvbXBvbmVudCc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1twb3BweU1lbnVdJyxcbiAgZXhwb3J0QXM6ICdwb3BweU1lbnUnLFxufSlcbmV4cG9ydCBjbGFzcyBQb3BvdmVyTWVudURpcmVjdGl2ZSBleHRlbmRzIEJhc2VQb3BvdmVyRGlyZWN0aXZlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBJbnB1dCgpIHBvcHB5TWVudTogUG9wb3Zlck1lbnVDb21wb25lbnQ7XG4gIEBJbnB1dCgpIHR5cGU6IFBvcG92ZXJNZW51VHlwZSA9ICdtZW51JztcbiAgQElucHV0KCkgY2xvc2VPbkNsaWNrSXRlbTogYm9vbGVhbiA9IHRydWU7XG5cbiAgcHJpdmF0ZSBjb250ZXh0TWVudVBvc2l0aW9uOiBQb3BvdmVyQ29udGV4dE1lbnVQb3NpdGlvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHBvcG92ZXJTZXJ2aWNlOiBQb3BvdmVyU2VydmljZSxcbiAgICBwdWJsaWMgcmVhZG9ubHkgaG9zdEVsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IG5nWm9uZTogTmdab25lXG4gICkge1xuICAgIHN1cGVyKGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgcG9wb3ZlclNlcnZpY2UsIGhvc3RFbGVtZW50LCBuZ1pvbmUpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnBvcHB5TWVudSkge1xuICAgICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy50cmlnZ2VyICE9PSAnbWFudWFsJyAmJiB0aGlzLnR5cGUgPT09ICdtZW51Jykge1xuICAgICAgICAgIHRoaXMubGlzdGVuRXZlbnRzRm9yQ2xpY2tUcmlnZ2VyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy50eXBlID09PSAnY29udGV4dCcpIHtcbiAgICAgICAgICB0aGlzLmxpc3RlbkV2ZW50c0ZvckNvbnRleHRUcmlnZ2VyKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG9wZW4oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY2FuQXBwZW5kKCkpIHtcbiAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHRoaXMuYXBwZW5kKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvLyBOT1RFOiBJdCBzaG91bGQgYmUgcmVtb3ZlZCBhZnRlciB1cGdyYWRlIHRvIG5nIDksIGJlY2F1c2UgUXVlcnlMaXN0IHNob3VsZCBlbWl0IGNoYW5nZXNcbiAgLy8gd2hlbiBlbGVtZW50cyBpcyByZW1vdmVkXG4gIHVwZGF0ZUNvbnRlbnRQb3NpdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wb3BvdmVyQ29tcG9uZW50UmVmKSB7XG4gICAgICB0aGlzLnBvcG92ZXJDb21wb25lbnRSZWYuaW5zdGFuY2UuY29tcG9uZW50U3R5bGVzLnVwZGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRQb3BvdmVyQ29tcG9uZW50SW5qZWN0b3IoKTogSW5qZWN0b3Ige1xuICAgIGNvbnN0IHByb3ZpZGVyVmFsdWVzOiBQb3BvdmVyQ29uZmlnID0ge1xuICAgICAgYm91bmRzOiB0aGlzLmdldEJvdW5kcygpLFxuICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgdHJpZ2dlckVsZW1lbnQ6IHRoaXMuaG9zdEVsZW1lbnQsXG4gICAgICB0cmlnZ2VyRGlyZWN0aXZlOiB0aGlzLFxuICAgICAgY2xvc2VPbkNsaWNrT3V0c2lkZTogdGhpcy5jbG9zZU9uQ2xpY2tPdXRzaWRlLFxuICAgICAgY2xvc2VPbkNsaWNrSXRlbTogdGhpcy5jbG9zZU9uQ2xpY2tJdGVtLFxuICAgICAgbWVudVJlZjogdGhpcy5wb3BweU1lbnUsXG4gICAgICBpbm5lckNsYXNzOiB0aGlzLmlubmVyQ2xhc3MsXG4gICAgfTtcblxuICAgIHJldHVybiBJbmplY3Rvci5jcmVhdGUoW1xuICAgICAge1xuICAgICAgICBwcm92aWRlOiBQT1BPVkVSX0NPTkZJRyxcbiAgICAgICAgdXNlVmFsdWU6IHByb3ZpZGVyVmFsdWVzLFxuICAgICAgfSxcbiAgICBdKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjYW5BcHBlbmQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgICF0aGlzLnBvcG92ZXJDb21wb25lbnRSZWYgfHxcbiAgICAgICh0aGlzLnBvcG92ZXJDb21wb25lbnRSZWYgJiYgdGhpcy50eXBlID09PSAnY29udGV4dCcpIHx8XG4gICAgICAodGhpcy5wb3BvdmVyQ29tcG9uZW50UmVmICYmIHRoaXMuY2xvc2VPblRyaWdnZXJBZ2FpbilcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZW5FdmVudHNGb3JDbGlja1RyaWdnZXIoKTogdm9pZCB7XG4gICAgZnJvbUV2ZW50KHRoaXMuaG9zdEVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2NsaWNrJylcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZW5FdmVudHNGb3JDb250ZXh0VHJpZ2dlcigpOiB2b2lkIHtcbiAgICBmcm9tRXZlbnQodGhpcy5ob3N0RWxlbWVudC5uYXRpdmVFbGVtZW50LCAnY29udGV4dG1lbnUnKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgLnN1YnNjcmliZSgoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudVBvc2l0aW9uID0ge1xuICAgICAgICAgIHRvcDogZXZlbnQuY2xpZW50WSxcbiAgICAgICAgICBsZWZ0OiBldmVudC5jbGllbnRYLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhcHBlbmQoKTogdm9pZCB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IG5ldyBQb3BvdmVyQXBwZW5kT3B0aW9ucyh7XG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgfSk7XG5cbiAgICB0aGlzLmFwcGVuZFRvTGF5ZXIob3B0aW9ucyk7XG4gIH1cblxuICBwcml2YXRlIGdldEJvdW5kcygpOiBQb3BvdmVyQm91bmRzIHtcbiAgICBpZiAodGhpcy50eXBlID09PSAnY29udGV4dCcpIHtcbiAgICAgIHJldHVybiB7IHRvcDogdGhpcy5jb250ZXh0TWVudVBvc2l0aW9uLnRvcCwgbGVmdDogdGhpcy5jb250ZXh0TWVudVBvc2l0aW9uLmxlZnQgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuaG9zdEVsZW1lbnQubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==