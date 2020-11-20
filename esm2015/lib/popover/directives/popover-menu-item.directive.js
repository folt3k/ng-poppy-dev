import { Directive, ElementRef, EventEmitter, Output, Input, HostBinding, } from '@angular/core';
import { fromEvent } from 'rxjs';
import { tap } from 'rxjs/operators';
export class PopoverMenuItemDirective {
    constructor(element) {
        this.element = element;
        this.selected = false;
        this.hidden = false;
        this.clicked = new EventEmitter();
    }
    get selectedClass() {
        return this.selected;
    }
    get hiddenClass() {
        return this.hidden;
    }
    ngOnInit() {
        this.clicked$ = fromEvent(this.element.nativeElement, 'click').pipe(tap(() => {
            this.clicked.emit();
        }));
        this.hovered$ = fromEvent(this.element.nativeElement, 'mousemove');
        // this.global$ = fromEvent<MouseEvent>(document, 'click').pipe(tap(() => console.log('clicked window')));
    }
    ngAfterViewInit() {
        this.element.nativeElement.classList.add('popover-menu-item');
    }
}
PopoverMenuItemDirective.decorators = [
    { type: Directive, args: [{
                selector: '[poppy-menu-item]',
            },] }
];
PopoverMenuItemDirective.ctorParameters = () => [
    { type: ElementRef }
];
PopoverMenuItemDirective.propDecorators = {
    submenu: [{ type: Input }],
    selected: [{ type: Input }],
    hidden: [{ type: Input }],
    clicked: [{ type: Output }],
    selectedClass: [{ type: HostBinding, args: ['class.popover-menu-item--selected',] }],
    hiddenClass: [{ type: HostBinding, args: ['class.popover-menu-item--hidden',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1tZW51LWl0ZW0uZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL2ZvbHRpL1Byb2plY3RzL25nLXBvcHB5L3Byb2plY3RzL25nLXBvcHB5L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9wb3BvdmVyL2RpcmVjdGl2ZXMvcG9wb3Zlci1tZW51LWl0ZW0uZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFFWixNQUFNLEVBQ04sS0FBSyxFQUVMLFdBQVcsR0FHWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFjLE1BQU0sTUFBTSxDQUFDO0FBRTdDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUtyQyxNQUFNLE9BQU8sd0JBQXdCO0lBb0JuQyxZQUFtQixPQUFtQjtRQUFuQixZQUFPLEdBQVAsT0FBTyxDQUFZO1FBbEI3QixhQUFRLEdBQVksS0FBSyxDQUFDO1FBQzFCLFdBQU0sR0FBWSxLQUFLLENBQUM7UUFDdkIsWUFBTyxHQUF1QixJQUFJLFlBQVksRUFBRSxDQUFDO0lBZ0JsQixDQUFDO0lBZDFDLElBQ0ksYUFBYTtRQUNmLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFDSSxXQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFRRCxRQUFRO1FBQ04sSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQWEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUM3RSxHQUFHLENBQUMsR0FBRyxFQUFFO1lBQ1AsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FDSCxDQUFDO1FBQ0YsSUFBSSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDbkUsMEdBQTBHO0lBQzVHLENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7OztZQXJDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjthQUM5Qjs7O1lBaEJDLFVBQVU7OztzQkFrQlQsS0FBSzt1QkFDTCxLQUFLO3FCQUNMLEtBQUs7c0JBQ0wsTUFBTTs0QkFFTixXQUFXLFNBQUMsbUNBQW1DOzBCQUsvQyxXQUFXLFNBQUMsaUNBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEFmdGVyVmlld0luaXQsXG4gIE91dHB1dCxcbiAgSW5wdXQsXG4gIFRlbXBsYXRlUmVmLFxuICBIb3N0QmluZGluZyxcbiAgT25Jbml0LFxuICBPbkNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBQb3BvdmVyTWVudUNvbXBvbmVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMvcG9wb3Zlci1tZW51L3BvcG92ZXItbWVudS5jb21wb25lbnQnO1xuaW1wb3J0IHsgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbcG9wcHktbWVudS1pdGVtXScsXG59KVxuZXhwb3J0IGNsYXNzIFBvcG92ZXJNZW51SXRlbURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBJbnB1dCgpIHN1Ym1lbnU6IFBvcG92ZXJNZW51Q29tcG9uZW50IHwgVGVtcGxhdGVSZWY8YW55PjtcbiAgQElucHV0KCkgc2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgaGlkZGVuOiBib29sZWFuID0gZmFsc2U7XG4gIEBPdXRwdXQoKSBjbGlja2VkOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wb3BvdmVyLW1lbnUtaXRlbS0tc2VsZWN0ZWQnKVxuICBnZXQgc2VsZWN0ZWRDbGFzcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RlZDtcbiAgfVxuXG4gIEBIb3N0QmluZGluZygnY2xhc3MucG9wb3Zlci1tZW51LWl0ZW0tLWhpZGRlbicpXG4gIGdldCBoaWRkZW5DbGFzcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5oaWRkZW47XG4gIH1cblxuICBjbGlja2VkJDogT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PjtcbiAgaG92ZXJlZCQ6IE9ic2VydmFibGU8TW91c2VFdmVudD47XG4gIGdsb2JhbCQ6IE9ic2VydmFibGU8TW91c2VFdmVudD47XG5cbiAgY29uc3RydWN0b3IocHVibGljIGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5jbGlja2VkJCA9IGZyb21FdmVudDxNb3VzZUV2ZW50Pih0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2NsaWNrJykucGlwZShcbiAgICAgIHRhcCgoKSA9PiB7XG4gICAgICAgIHRoaXMuY2xpY2tlZC5lbWl0KCk7XG4gICAgICB9KVxuICAgICk7XG4gICAgdGhpcy5ob3ZlcmVkJCA9IGZyb21FdmVudCh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCwgJ21vdXNlbW92ZScpO1xuICAgIC8vIHRoaXMuZ2xvYmFsJCA9IGZyb21FdmVudDxNb3VzZUV2ZW50Pihkb2N1bWVudCwgJ2NsaWNrJykucGlwZSh0YXAoKCkgPT4gY29uc29sZS5sb2coJ2NsaWNrZWQgd2luZG93JykpKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdwb3BvdmVyLW1lbnUtaXRlbScpO1xuICB9XG59XG4iXX0=