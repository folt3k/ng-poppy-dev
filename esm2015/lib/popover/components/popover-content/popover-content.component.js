import { ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Inject, Injector, NgZone, ViewChild, ViewEncapsulation, TemplateRef, } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, skipUntil, takeUntil } from 'rxjs/operators';
import { POPOVER_CONFIG } from '../../popover.token';
import { PopoverService } from '../../services/popover.service';
import { PopoverAppendOptions } from '../../models/popover-append-options.model';
import { fadeInAnimation } from '../../popover.animations';
import { PopoverStyles } from '../../models/popover-styles.model';
import { PopoverEventsService } from '../../services/events.service';
import { PopoverMenuComponent } from '../popover-menu/popover-menu.component';
export class PopoverContentComponent {
    constructor(element, ngZone, componentFactoryResolver, popoverService, popoverEventsService, cdr, popoverConfig) {
        this.element = element;
        this.ngZone = ngZone;
        this.componentFactoryResolver = componentFactoryResolver;
        this.popoverService = popoverService;
        this.popoverEventsService = popoverEventsService;
        this.cdr = cdr;
        this.popoverConfig = popoverConfig;
        this.animationState = 'close';
        this.animationEnd$ = new Subject();
        this.menuItemsChanged = new Subject();
        this.destroy$ = new Subject();
    }
    ngAfterViewInit() {
        var _a;
        this.applyStyles();
        if (this.popoverConfig.submenuTriggeredItem) {
            this.popoverConfig.submenuTriggeredItem.element.nativeElement.classList.add('popover-menu-item--focused');
        }
        if (this.popoverConfig.innerClass) {
            this.popoverWrapperEl.nativeElement.classList.add(this.popoverConfig.innerClass);
        }
        this.listenForMouseEventOnHost();
        if (this.canListenForClickOutside()) {
            this.ngZone.runOutsideAngular(() => {
                setTimeout(() => {
                    this.listenForClickOutside();
                });
            });
        }
        if ((_a = this.popoverConfig.menuRef) === null || _a === void 0 ? void 0 : _a.menuItems) {
            this.listenForMenuItemTriggers();
            // Subscribe to click outside event again, when menu items changed - it's workaround to refresh host element content;
            this.popoverConfig.menuRef.menuItems.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
                this.menuItemsChanged.next();
                this.listenForMenuItemTriggers();
                this.popoverEventsService.unregister('click-outside', this.popoverService.getActive(this.componentRef));
                setTimeout(() => {
                    this.listenForClickOutside();
                    this.componentStyles.update();
                }, 0);
            });
        }
    }
    ngOnDestroy() {
        if (this.popoverConfig.submenuTriggeredItem) {
            this.popoverConfig.submenuTriggeredItem.element.nativeElement.classList.remove('popover-menu-item--focused');
        }
        this.destroy$.next();
        this.destroy$.complete();
    }
    get template() {
        var _a;
        return ((this.popoverConfig.content instanceof TemplateRef &&
            this.popoverConfig.content) || ((_a = this.popoverConfig.menuRef) === null || _a === void 0 ? void 0 : _a.templateRef));
    }
    animationEnd(event) {
        if (event.toState === 'open') {
            this.animationEnd$.next();
        }
    }
    applyStyles() {
        this.componentStyles = new PopoverStyles(this);
        this.componentStyles.init();
        setTimeout(() => {
            this.componentStyles.update();
            this.animationState = 'open';
            this.detectChanges();
        });
    }
    onClickMenuItem(item) {
        const hasItemNestedSubpopovers = !!item.submenu;
        if (!hasItemNestedSubpopovers) {
            if (this.popoverConfig.closeOnClickItem) {
                this.close();
            }
        }
    }
    onHoverMenuItem(item) {
        const canRemoveNestedSubmenus = !this.popoverService.activePopovers.find((popover) => popover.popoverRef.instance.popoverConfig.submenuTriggeredItem === item);
        const hasItemNestedSubpopovers = !!item.submenu;
        if (canRemoveNestedSubmenus) {
            this.popoverService.removeAllNestedPopovers(this.componentRef);
            this.detectChanges();
        }
        const isSubmenuExists = this.popoverService.isPopoverSubmenuExits(this.componentRef, this.parentPopoverRef);
        if (!isSubmenuExists && hasItemNestedSubpopovers && canRemoveNestedSubmenus) {
            this.createSubpopover(item);
        }
    }
    listenForClickOutside() {
        const activePopover = this.popoverService.getActive(this.componentRef);
        this.popoverEventsService.register('click-outside', activePopover, (event) => {
            const clickedElement = event.target;
            let clickedOutside = clickedElement !== this.element.nativeElement &&
                !this.element.nativeElement.contains(clickedElement) &&
                clickedElement !== this.popoverConfig.triggerElement.nativeElement &&
                !this.popoverConfig.triggerElement.nativeElement.contains(clickedElement);
            if (this.popoverConfig.type === 'context' &&
                (clickedElement === this.popoverConfig.triggerElement.nativeElement ||
                    this.popoverConfig.triggerElement.nativeElement.contains(clickedElement))) {
                clickedOutside = true;
            }
            if (clickedOutside) {
                this.close();
            }
        });
    }
    listenForMouseEventOnHost() {
        fromEvent(this.element.nativeElement, 'mouseenter')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            const enteredPopover = this.popoverService.getActive(this.componentRef);
            if (enteredPopover === null || enteredPopover === void 0 ? void 0 : enteredPopover.deepLevel) {
                this.popoverService.activePopovers.forEach((popover, index) => {
                    if (index <= enteredPopover.deepLevel) {
                        this.popoverEventsService.unsubscribe('click-outside', popover);
                    }
                    else {
                        this.popoverEventsService.subscribe('click-outside', popover);
                    }
                });
            }
        });
        fromEvent(this.element.nativeElement, 'mouseleave')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            this.popoverService.activePopovers.forEach((popover) => {
                this.popoverEventsService.subscribe('click-outside', popover);
            });
        });
    }
    listenForMenuItemTriggers() {
        this.popoverConfig.menuRef.menuItems.forEach((item) => {
            item.clicked$.pipe(takeUntil(this.destroy$), takeUntil(this.menuItemsChanged)).subscribe(() => {
                this.onClickMenuItem(item);
            });
            item.hovered$
                .pipe(takeUntil(this.destroy$), takeUntil(this.menuItemsChanged), debounceTime(0), skipUntil(this.animationEnd$))
                .subscribe(() => {
                this.onHoverMenuItem(item);
            });
        });
    }
    close() {
        if (this.isMenu()) {
            this.popoverService.subscribeToClickOutsideEventForParentPopover(this.componentRef);
            this.popoverService.removeMenu(this.parentPopoverRef);
        }
        else {
            this.popoverService.remove(this.componentRef);
        }
    }
    createSubpopover(item) {
        const factory = this.componentFactoryResolver.resolveComponentFactory(PopoverContentComponent);
        const bounds = item.element.nativeElement.getBoundingClientRect();
        const type = 'submenu';
        const options = new PopoverAppendOptions({ type });
        const providedValues = {
            bounds,
            type,
            submenuTriggeredItem: item,
            triggerElement: this.popoverConfig.triggerElement,
            closeOnClickItem: this.popoverConfig.closeOnClickItem,
        };
        if ((item === null || item === void 0 ? void 0 : item.submenu) instanceof PopoverMenuComponent) {
            providedValues.menuRef = item.submenu;
        }
        if ((item === null || item === void 0 ? void 0 : item.submenu) instanceof TemplateRef) {
            providedValues.content = item.submenu;
        }
        const injector = Injector.create([
            {
                provide: POPOVER_CONFIG,
                useValue: providedValues,
            },
        ]);
        this.subMenuComponentRef = this.popoverService.append(injector, null, options, this.parentPopoverRef);
        this.subMenuComponentRef.instance.componentRef = this.subMenuComponentRef;
        this.subMenuComponentRef.instance.parentPopoverRef = this.parentPopoverRef;
        this.subMenuComponentRef.hostView.detectChanges();
    }
    isMenu() {
        return (this.popoverConfig.type === 'menu' ||
            this.popoverConfig.type === 'context' ||
            this.popoverConfig.type === 'submenu');
    }
    canListenForClickOutside() {
        return (this.popoverConfig.closeOnClickOutside && (this.popoverConfig.trigger !== 'hover' || this.isMenu()));
    }
    detectChanges() {
        if (this.cdr && !this.cdr.destroyed) {
            this.cdr.detectChanges();
        }
    }
}
PopoverContentComponent.decorators = [
    { type: Component, args: [{
                selector: 'poppy-content',
                template: "<div\n  #popoverWrapperEl\n  class=\"popover-content\"\n  [@fadeIn]=\"animationState\"\n  (@fadeIn.done)=\"animationEnd($event)\"\n>\n  <ng-container *ngIf=\"template; else textContent\">\n    <ng-container *ngTemplateOutlet=\"template\"></ng-container>\n  </ng-container>\n\n  <ng-template #textContent>\n    {{ popoverConfig.content }}\n  </ng-template>\n</div>\n",
                animations: [fadeInAnimation],
                encapsulation: ViewEncapsulation.None,
                styles: ["poppy-content{position:absolute;visibility:visible}.popover-content{background-color:#fff;border-radius:2px;box-shadow:0 3.2px 7.2px 0 rgba(0,0,0,.133),0 .6px 1.8px 0 rgba(0,0,0,.11);box-sizing:border-box;max-height:400px;overflow:auto}.popover-menu-list{margin:0;padding:0}.popover-menu-item{align-items:center;background-color:transparent;border:0;box-sizing:border-box;color:#323130;cursor:pointer;display:flex;justify-content:space-between;list-style:none;outline:0;padding:9px 12px;position:relative;text-align:left;width:100%}.popover-menu-item:disabled{opacity:.5}.popover-menu-item--focused,.popover-menu-item--selected,.popover-menu-item:hover{background-color:#edebe9}.popover-menu-item--hidden{display:none}"]
            },] }
];
PopoverContentComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: ComponentFactoryResolver },
    { type: PopoverService },
    { type: PopoverEventsService },
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Inject, args: [POPOVER_CONFIG,] }] }
];
PopoverContentComponent.propDecorators = {
    popoverWrapperEl: [{ type: ViewChild, args: ['popoverWrapperEl',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1jb250ZW50LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS9mb2x0aS9Qcm9qZWN0cy9uZy1wb3BweS9wcm9qZWN0cy9uZy1wb3BweS9zcmMvIiwic291cmNlcyI6WyJsaWIvcG9wb3Zlci9jb21wb25lbnRzL3BvcG92ZXItY29udGVudC9wb3BvdmVyLWNvbnRlbnQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFFTCxpQkFBaUIsRUFDakIsU0FBUyxFQUNULHdCQUF3QixFQUV4QixVQUFVLEVBQ1YsTUFBTSxFQUNOLFFBQVEsRUFDUixNQUFNLEVBRU4sU0FBUyxFQUVULGlCQUFpQixFQUNqQixXQUFXLEdBQ1osTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDMUMsT0FBTyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEUsT0FBTyxFQUFFLGNBQWMsRUFBaUIsTUFBTSxxQkFBcUIsQ0FBQztBQUNwRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFFaEUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDakYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzNELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUNsRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUVyRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQVM5RSxNQUFNLE9BQU8sdUJBQXVCO0lBWWxDLFlBQ2tCLE9BQW1CLEVBQ2xCLE1BQWMsRUFDZCx3QkFBa0QsRUFDbEQsY0FBOEIsRUFDOUIsb0JBQTBDLEVBQzFDLEdBQXNCLEVBQ0MsYUFBNEI7UUFO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LFVBQVU7WUFHVixNQUFNO1lBTE4sd0JBQXdCO1lBaUJqQixjQUFjO1lBS2Qsb0JBQW9CO1lBeEIzQixpQkFBaUI7NENBc0RkLE1BQU0sU0FBQyxjQUFjOzs7K0JBbEJ2QixTQUFTLFNBQUMsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBDb21wb25lbnRSZWYsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5qZWN0b3IsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdSZWYsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBUZW1wbGF0ZVJlZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBbmltYXRpb25FdmVudCB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkZWJvdW5jZVRpbWUsIHNraXBVbnRpbCwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBQT1BPVkVSX0NPTkZJRywgUG9wb3ZlckNvbmZpZyB9IGZyb20gJy4uLy4uL3BvcG92ZXIudG9rZW4nO1xuaW1wb3J0IHsgUG9wb3ZlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9wb3BvdmVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9wb3ZlclR5cGUgfSBmcm9tICcuLi8uLi9wb3BvdmVyLmludGVyZmFjZSc7XG5pbXBvcnQgeyBQb3BvdmVyQXBwZW5kT3B0aW9ucyB9IGZyb20gJy4uLy4uL21vZGVscy9wb3BvdmVyLWFwcGVuZC1vcHRpb25zLm1vZGVsJztcbmltcG9ydCB7IGZhZGVJbkFuaW1hdGlvbiB9IGZyb20gJy4uLy4uL3BvcG92ZXIuYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBQb3BvdmVyU3R5bGVzIH0gZnJvbSAnLi4vLi4vbW9kZWxzL3BvcG92ZXItc3R5bGVzLm1vZGVsJztcbmltcG9ydCB7IFBvcG92ZXJFdmVudHNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZXZlbnRzLnNlcnZpY2UnO1xuaW1wb3J0IHsgUG9wb3Zlck1lbnVJdGVtRGlyZWN0aXZlIH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcy9wb3BvdmVyLW1lbnUtaXRlbS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgUG9wb3Zlck1lbnVDb21wb25lbnQgfSBmcm9tICcuLi9wb3BvdmVyLW1lbnUvcG9wb3Zlci1tZW51LmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3BvcHB5LWNvbnRlbnQnLFxuICB0ZW1wbGF0ZVVybDogJy4vcG9wb3Zlci1jb250ZW50LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcG9wb3Zlci1jb250ZW50LmNvbXBvbmVudC5zY3NzJ10sXG4gIGFuaW1hdGlvbnM6IFtmYWRlSW5BbmltYXRpb25dLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBQb3BvdmVyQ29udGVudENvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBWaWV3Q2hpbGQoJ3BvcG92ZXJXcmFwcGVyRWwnKSBwb3BvdmVyV3JhcHBlckVsOiBFbGVtZW50UmVmO1xuXG4gIGNvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmPFBvcG92ZXJDb250ZW50Q29tcG9uZW50PjtcbiAgcGFyZW50UG9wb3ZlclJlZjogQ29tcG9uZW50UmVmPFBvcG92ZXJDb250ZW50Q29tcG9uZW50PjtcbiAgYW5pbWF0aW9uU3RhdGU6ICdvcGVuJyB8ICdjbG9zZScgPSAnY2xvc2UnO1xuICBjb21wb25lbnRTdHlsZXM6IFBvcG92ZXJTdHlsZXM7XG4gIHByaXZhdGUgc3ViTWVudUNvbXBvbmVudFJlZjogQ29tcG9uZW50UmVmPFBvcG92ZXJDb250ZW50Q29tcG9uZW50PjtcbiAgcHJpdmF0ZSBhbmltYXRpb25FbmQkID0gbmV3IFN1YmplY3QoKTtcbiAgcHJpdmF0ZSBtZW51SXRlbXNDaGFuZ2VkID0gbmV3IFN1YmplY3QoKTtcbiAgcHJpdmF0ZSBkZXN0cm95JCA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHJlYWRvbmx5IGVsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSByZWFkb25seSBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcG9wb3ZlclNlcnZpY2U6IFBvcG92ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcG9wb3ZlckV2ZW50c1NlcnZpY2U6IFBvcG92ZXJFdmVudHNTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBASW5qZWN0KFBPUE9WRVJfQ09ORklHKSBwdWJsaWMgcmVhZG9ubHkgcG9wb3ZlckNvbmZpZzogUG9wb3ZlckNvbmZpZ1xuICApIHt9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuYXBwbHlTdHlsZXMoKTtcblxuICAgIGlmICh0aGlzLnBvcG92ZXJDb25maWcuc3VibWVudVRyaWdnZXJlZEl0ZW0pIHtcbiAgICAgIHRoaXMucG9wb3ZlckNvbmZpZy5zdWJtZW51VHJpZ2dlcmVkSXRlbS5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChcbiAgICAgICAgJ3BvcG92ZXItbWVudS1pdGVtLS1mb2N1c2VkJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wb3BvdmVyQ29uZmlnLmlubmVyQ2xhc3MpIHtcbiAgICAgIHRoaXMucG9wb3ZlcldyYXBwZXJFbC5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQodGhpcy5wb3BvdmVyQ29uZmlnLmlubmVyQ2xhc3MpO1xuICAgIH1cblxuICAgIHRoaXMubGlzdGVuRm9yTW91c2VFdmVudE9uSG9zdCgpO1xuXG4gICAgaWYgKHRoaXMuY2FuTGlzdGVuRm9yQ2xpY2tPdXRzaWRlKCkpIHtcbiAgICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5saXN0ZW5Gb3JDbGlja091dHNpZGUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wb3BvdmVyQ29uZmlnLm1lbnVSZWY/Lm1lbnVJdGVtcykge1xuICAgICAgdGhpcy5saXN0ZW5Gb3JNZW51SXRlbVRyaWdnZXJzKCk7XG5cbiAgICAgIC8vIFN1YnNjcmliZSB0byBjbGljayBvdXRzaWRlIGV2ZW50IGFnYWluLCB3aGVuIG1lbnUgaXRlbXMgY2hhbmdlZCAtIGl0J3Mgd29ya2Fyb3VuZCB0byByZWZyZXNoIGhvc3QgZWxlbWVudCBjb250ZW50O1xuICAgICAgdGhpcy5wb3BvdmVyQ29uZmlnLm1lbnVSZWYubWVudUl0ZW1zLmNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMubWVudUl0ZW1zQ2hhbmdlZC5uZXh0KCk7XG5cbiAgICAgICAgdGhpcy5saXN0ZW5Gb3JNZW51SXRlbVRyaWdnZXJzKCk7XG4gICAgICAgIHRoaXMucG9wb3ZlckV2ZW50c1NlcnZpY2UudW5yZWdpc3RlcihcbiAgICAgICAgICAnY2xpY2stb3V0c2lkZScsXG4gICAgICAgICAgdGhpcy5wb3BvdmVyU2VydmljZS5nZXRBY3RpdmUodGhpcy5jb21wb25lbnRSZWYpXG4gICAgICAgICk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMubGlzdGVuRm9yQ2xpY2tPdXRzaWRlKCk7XG4gICAgICAgICAgdGhpcy5jb21wb25lbnRTdHlsZXMudXBkYXRlKCk7XG4gICAgICAgIH0sIDApO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucG9wb3ZlckNvbmZpZy5zdWJtZW51VHJpZ2dlcmVkSXRlbSkge1xuICAgICAgdGhpcy5wb3BvdmVyQ29uZmlnLnN1Ym1lbnVUcmlnZ2VyZWRJdGVtLmVsZW1lbnQubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFxuICAgICAgICAncG9wb3Zlci1tZW51LWl0ZW0tLWZvY3VzZWQnXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xuICAgIHRoaXMuZGVzdHJveSQuY29tcGxldGUoKTtcbiAgfVxuXG4gIGdldCB0ZW1wbGF0ZSgpOiBUZW1wbGF0ZVJlZjxhbnk+IHtcbiAgICByZXR1cm4gKFxuICAgICAgKHRoaXMucG9wb3ZlckNvbmZpZy5jb250ZW50IGluc3RhbmNlb2YgVGVtcGxhdGVSZWYgJiZcbiAgICAgICAgKHRoaXMucG9wb3ZlckNvbmZpZy5jb250ZW50IGFzIFRlbXBsYXRlUmVmPGFueT4pKSB8fFxuICAgICAgdGhpcy5wb3BvdmVyQ29uZmlnLm1lbnVSZWY/LnRlbXBsYXRlUmVmXG4gICAgKTtcbiAgfVxuXG4gIGFuaW1hdGlvbkVuZChldmVudDogQW5pbWF0aW9uRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoZXZlbnQudG9TdGF0ZSA9PT0gJ29wZW4nKSB7XG4gICAgICB0aGlzLmFuaW1hdGlvbkVuZCQubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXBwbHlTdHlsZXMoKTogdm9pZCB7XG4gICAgdGhpcy5jb21wb25lbnRTdHlsZXMgPSBuZXcgUG9wb3ZlclN0eWxlcyh0aGlzKTtcbiAgICB0aGlzLmNvbXBvbmVudFN0eWxlcy5pbml0KCk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuY29tcG9uZW50U3R5bGVzLnVwZGF0ZSgpO1xuICAgICAgdGhpcy5hbmltYXRpb25TdGF0ZSA9ICdvcGVuJztcbiAgICAgIHRoaXMuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvbkNsaWNrTWVudUl0ZW0oaXRlbTogUG9wb3Zlck1lbnVJdGVtRGlyZWN0aXZlKTogdm9pZCB7XG4gICAgY29uc3QgaGFzSXRlbU5lc3RlZFN1YnBvcG92ZXJzID0gISFpdGVtLnN1Ym1lbnU7XG5cbiAgICBpZiAoIWhhc0l0ZW1OZXN0ZWRTdWJwb3BvdmVycykge1xuICAgICAgaWYgKHRoaXMucG9wb3ZlckNvbmZpZy5jbG9zZU9uQ2xpY2tJdGVtKSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uSG92ZXJNZW51SXRlbShpdGVtOiBQb3BvdmVyTWVudUl0ZW1EaXJlY3RpdmUpOiB2b2lkIHtcbiAgICBjb25zdCBjYW5SZW1vdmVOZXN0ZWRTdWJtZW51cyA9ICF0aGlzLnBvcG92ZXJTZXJ2aWNlLmFjdGl2ZVBvcG92ZXJzLmZpbmQoXG4gICAgICAocG9wb3ZlcikgPT4gcG9wb3Zlci5wb3BvdmVyUmVmLmluc3RhbmNlLnBvcG92ZXJDb25maWcuc3VibWVudVRyaWdnZXJlZEl0ZW0gPT09IGl0ZW1cbiAgICApO1xuICAgIGNvbnN0IGhhc0l0ZW1OZXN0ZWRTdWJwb3BvdmVycyA9ICEhaXRlbS5zdWJtZW51O1xuXG4gICAgaWYgKGNhblJlbW92ZU5lc3RlZFN1Ym1lbnVzKSB7XG4gICAgICB0aGlzLnBvcG92ZXJTZXJ2aWNlLnJlbW92ZUFsbE5lc3RlZFBvcG92ZXJzKHRoaXMuY29tcG9uZW50UmVmKTtcbiAgICAgIHRoaXMuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIGNvbnN0IGlzU3VibWVudUV4aXN0cyA9IHRoaXMucG9wb3ZlclNlcnZpY2UuaXNQb3BvdmVyU3VibWVudUV4aXRzKFxuICAgICAgdGhpcy5jb21wb25lbnRSZWYsXG4gICAgICB0aGlzLnBhcmVudFBvcG92ZXJSZWZcbiAgICApO1xuXG4gICAgaWYgKCFpc1N1Ym1lbnVFeGlzdHMgJiYgaGFzSXRlbU5lc3RlZFN1YnBvcG92ZXJzICYmIGNhblJlbW92ZU5lc3RlZFN1Ym1lbnVzKSB7XG4gICAgICB0aGlzLmNyZWF0ZVN1YnBvcG92ZXIoaXRlbSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBsaXN0ZW5Gb3JDbGlja091dHNpZGUoKTogdm9pZCB7XG4gICAgY29uc3QgYWN0aXZlUG9wb3ZlciA9IHRoaXMucG9wb3ZlclNlcnZpY2UuZ2V0QWN0aXZlKHRoaXMuY29tcG9uZW50UmVmKTtcblxuICAgIHRoaXMucG9wb3ZlckV2ZW50c1NlcnZpY2UucmVnaXN0ZXIoJ2NsaWNrLW91dHNpZGUnLCBhY3RpdmVQb3BvdmVyLCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGNsaWNrZWRFbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgbGV0IGNsaWNrZWRPdXRzaWRlID1cbiAgICAgICAgY2xpY2tlZEVsZW1lbnQgIT09IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50ICYmXG4gICAgICAgICF0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5jb250YWlucyhjbGlja2VkRWxlbWVudCkgJiZcbiAgICAgICAgY2xpY2tlZEVsZW1lbnQgIT09IHRoaXMucG9wb3ZlckNvbmZpZy50cmlnZ2VyRWxlbWVudC5uYXRpdmVFbGVtZW50ICYmXG4gICAgICAgICF0aGlzLnBvcG92ZXJDb25maWcudHJpZ2dlckVsZW1lbnQubmF0aXZlRWxlbWVudC5jb250YWlucyhjbGlja2VkRWxlbWVudCk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5wb3BvdmVyQ29uZmlnLnR5cGUgPT09ICdjb250ZXh0JyAmJlxuICAgICAgICAoY2xpY2tlZEVsZW1lbnQgPT09IHRoaXMucG9wb3ZlckNvbmZpZy50cmlnZ2VyRWxlbWVudC5uYXRpdmVFbGVtZW50IHx8XG4gICAgICAgICAgdGhpcy5wb3BvdmVyQ29uZmlnLnRyaWdnZXJFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoY2xpY2tlZEVsZW1lbnQpKVxuICAgICAgKSB7XG4gICAgICAgIGNsaWNrZWRPdXRzaWRlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChjbGlja2VkT3V0c2lkZSkge1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGxpc3RlbkZvck1vdXNlRXZlbnRPbkhvc3QoKTogdm9pZCB7XG4gICAgZnJvbUV2ZW50KHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnbW91c2VlbnRlcicpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgY29uc3QgZW50ZXJlZFBvcG92ZXIgPSB0aGlzLnBvcG92ZXJTZXJ2aWNlLmdldEFjdGl2ZSh0aGlzLmNvbXBvbmVudFJlZik7XG5cbiAgICAgICAgaWYgKGVudGVyZWRQb3BvdmVyPy5kZWVwTGV2ZWwpIHtcbiAgICAgICAgICB0aGlzLnBvcG92ZXJTZXJ2aWNlLmFjdGl2ZVBvcG92ZXJzLmZvckVhY2goKHBvcG92ZXIsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZiAoaW5kZXggPD0gZW50ZXJlZFBvcG92ZXIuZGVlcExldmVsKSB7XG4gICAgICAgICAgICAgIHRoaXMucG9wb3ZlckV2ZW50c1NlcnZpY2UudW5zdWJzY3JpYmUoJ2NsaWNrLW91dHNpZGUnLCBwb3BvdmVyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMucG9wb3ZlckV2ZW50c1NlcnZpY2Uuc3Vic2NyaWJlKCdjbGljay1vdXRzaWRlJywgcG9wb3Zlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIGZyb21FdmVudCh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ21vdXNlbGVhdmUnKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMucG9wb3ZlclNlcnZpY2UuYWN0aXZlUG9wb3ZlcnMuZm9yRWFjaCgocG9wb3ZlcikgPT4ge1xuICAgICAgICAgIHRoaXMucG9wb3ZlckV2ZW50c1NlcnZpY2Uuc3Vic2NyaWJlKCdjbGljay1vdXRzaWRlJywgcG9wb3Zlcik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGxpc3RlbkZvck1lbnVJdGVtVHJpZ2dlcnMoKTogdm9pZCB7XG4gICAgdGhpcy5wb3BvdmVyQ29uZmlnLm1lbnVSZWYubWVudUl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGl0ZW0uY2xpY2tlZCQucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCksIHRha2VVbnRpbCh0aGlzLm1lbnVJdGVtc0NoYW5nZWQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLm9uQ2xpY2tNZW51SXRlbShpdGVtKTtcbiAgICAgIH0pO1xuICAgICAgaXRlbS5ob3ZlcmVkJFxuICAgICAgICAucGlwZShcbiAgICAgICAgICB0YWtlVW50aWwodGhpcy5kZXN0cm95JCksXG4gICAgICAgICAgdGFrZVVudGlsKHRoaXMubWVudUl0ZW1zQ2hhbmdlZCksXG4gICAgICAgICAgZGVib3VuY2VUaW1lKDApLFxuICAgICAgICAgIHNraXBVbnRpbCh0aGlzLmFuaW1hdGlvbkVuZCQpXG4gICAgICAgIClcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5vbkhvdmVyTWVudUl0ZW0oaXRlbSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc01lbnUoKSkge1xuICAgICAgdGhpcy5wb3BvdmVyU2VydmljZS5zdWJzY3JpYmVUb0NsaWNrT3V0c2lkZUV2ZW50Rm9yUGFyZW50UG9wb3Zlcih0aGlzLmNvbXBvbmVudFJlZik7XG4gICAgICB0aGlzLnBvcG92ZXJTZXJ2aWNlLnJlbW92ZU1lbnUodGhpcy5wYXJlbnRQb3BvdmVyUmVmKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wb3BvdmVyU2VydmljZS5yZW1vdmUodGhpcy5jb21wb25lbnRSZWYpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlU3VicG9wb3ZlcihpdGVtOiBQb3BvdmVyTWVudUl0ZW1EaXJlY3RpdmUpOiB2b2lkIHtcbiAgICBjb25zdCBmYWN0b3J5ID0gdGhpcy5jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoUG9wb3ZlckNvbnRlbnRDb21wb25lbnQpO1xuICAgIGNvbnN0IGJvdW5kcyA9IGl0ZW0uZWxlbWVudC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHR5cGU6IFBvcG92ZXJUeXBlID0gJ3N1Ym1lbnUnO1xuICAgIGNvbnN0IG9wdGlvbnMgPSBuZXcgUG9wb3ZlckFwcGVuZE9wdGlvbnMoeyB0eXBlIH0pO1xuXG4gICAgY29uc3QgcHJvdmlkZWRWYWx1ZXM6IFBvcG92ZXJDb25maWcgPSB7XG4gICAgICBib3VuZHMsXG4gICAgICB0eXBlLFxuICAgICAgc3VibWVudVRyaWdnZXJlZEl0ZW06IGl0ZW0sXG4gICAgICB0cmlnZ2VyRWxlbWVudDogdGhpcy5wb3BvdmVyQ29uZmlnLnRyaWdnZXJFbGVtZW50LFxuICAgICAgY2xvc2VPbkNsaWNrSXRlbTogdGhpcy5wb3BvdmVyQ29uZmlnLmNsb3NlT25DbGlja0l0ZW0sXG4gICAgfTtcblxuICAgIGlmIChpdGVtPy5zdWJtZW51IGluc3RhbmNlb2YgUG9wb3Zlck1lbnVDb21wb25lbnQpIHtcbiAgICAgIHByb3ZpZGVkVmFsdWVzLm1lbnVSZWYgPSBpdGVtLnN1Ym1lbnU7XG4gICAgfVxuICAgIGlmIChpdGVtPy5zdWJtZW51IGluc3RhbmNlb2YgVGVtcGxhdGVSZWYpIHtcbiAgICAgIHByb3ZpZGVkVmFsdWVzLmNvbnRlbnQgPSBpdGVtLnN1Ym1lbnU7XG4gICAgfVxuXG4gICAgY29uc3QgaW5qZWN0b3IgPSBJbmplY3Rvci5jcmVhdGUoW1xuICAgICAge1xuICAgICAgICBwcm92aWRlOiBQT1BPVkVSX0NPTkZJRyxcbiAgICAgICAgdXNlVmFsdWU6IHByb3ZpZGVkVmFsdWVzLFxuICAgICAgfSxcbiAgICBdKTtcblxuICAgIHRoaXMuc3ViTWVudUNvbXBvbmVudFJlZiA9IHRoaXMucG9wb3ZlclNlcnZpY2UuYXBwZW5kKGluamVjdG9yLCBudWxsLCBvcHRpb25zLCB0aGlzLnBhcmVudFBvcG92ZXJSZWYpO1xuICAgIHRoaXMuc3ViTWVudUNvbXBvbmVudFJlZi5pbnN0YW5jZS5jb21wb25lbnRSZWYgPSB0aGlzLnN1Yk1lbnVDb21wb25lbnRSZWY7XG4gICAgdGhpcy5zdWJNZW51Q29tcG9uZW50UmVmLmluc3RhbmNlLnBhcmVudFBvcG92ZXJSZWYgPSB0aGlzLnBhcmVudFBvcG92ZXJSZWY7XG4gICAgdGhpcy5zdWJNZW51Q29tcG9uZW50UmVmLmhvc3RWaWV3LmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgaXNNZW51KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLnBvcG92ZXJDb25maWcudHlwZSA9PT0gJ21lbnUnIHx8XG4gICAgICB0aGlzLnBvcG92ZXJDb25maWcudHlwZSA9PT0gJ2NvbnRleHQnIHx8XG4gICAgICB0aGlzLnBvcG92ZXJDb25maWcudHlwZSA9PT0gJ3N1Ym1lbnUnXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgY2FuTGlzdGVuRm9yQ2xpY2tPdXRzaWRlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLnBvcG92ZXJDb25maWcuY2xvc2VPbkNsaWNrT3V0c2lkZSAmJiAodGhpcy5wb3BvdmVyQ29uZmlnLnRyaWdnZXIgIT09ICdob3ZlcicgfHwgdGhpcy5pc01lbnUoKSlcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBkZXRlY3RDaGFuZ2VzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNkciAmJiAhKHRoaXMuY2RyIGFzIFZpZXdSZWYpLmRlc3Ryb3llZCkge1xuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfVxufVxuIl19