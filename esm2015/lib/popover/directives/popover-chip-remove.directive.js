import { Directive, Input, HostListener } from '@angular/core';
import { PopoverSelectComponent } from '../components/popover-select/popover-select.component';
export class PopoverChipRemoveDirective {
    constructor(selectComponentRef) {
        this.selectComponentRef = selectComponentRef;
    }
    onClick(event) {
        this.remove(event);
    }
    remove(event) {
        if (this.selectComponentRef) {
            this.selectComponentRef.closeChip(this.poppyChipRemove, event);
        }
    }
}
PopoverChipRemoveDirective.decorators = [
    { type: Directive, args: [{
                selector: '[poppyChipRemove]'
            },] }
];
PopoverChipRemoveDirective.ctorParameters = () => [
    { type: PopoverSelectComponent }
];
PopoverChipRemoveDirective.propDecorators = {
    poppyChipRemove: [{ type: Input }],
    onClick: [{ type: HostListener, args: ['click', ['$event'],] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1jaGlwLXJlbW92ZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvZm9sdGkvUHJvamVjdHMvbmctcG9wcHkvcHJvamVjdHMvbmctcG9wcHkvc3JjLyIsInNvdXJjZXMiOlsibGliL3BvcG92ZXIvZGlyZWN0aXZlcy9wb3BvdmVyLWNoaXAtcmVtb3ZlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDL0QsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sdURBQXVELENBQUM7QUFLL0YsTUFBTSxPQUFPLDBCQUEwQjtJQVFyQyxZQUFvQixrQkFBMEM7UUFBMUMsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUF3QjtJQUFHLENBQUM7SUFKbEUsT0FBTyxDQUFDLEtBQVk7UUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBSUQsTUFBTSxDQUFDLEtBQVk7UUFDakIsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDM0IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2hFO0lBQ0gsQ0FBQzs7O1lBakJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsbUJBQW1CO2FBQzlCOzs7WUFKUSxzQkFBc0I7Ozs4QkFNNUIsS0FBSztzQkFFTCxZQUFZLFNBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBJbnB1dCwgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQb3BvdmVyU2VsZWN0Q29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9wb3BvdmVyLXNlbGVjdC9wb3BvdmVyLXNlbGVjdC5jb21wb25lbnQnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbcG9wcHlDaGlwUmVtb3ZlXSdcbn0pXG5leHBvcnQgY2xhc3MgUG9wb3ZlckNoaXBSZW1vdmVEaXJlY3RpdmUge1xuICBASW5wdXQoKSBwb3BweUNoaXBSZW1vdmU6IGFueTtcblxuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pXG4gIG9uQ2xpY2soZXZlbnQ6IEV2ZW50KSB7XG4gICAgdGhpcy5yZW1vdmUoZXZlbnQpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzZWxlY3RDb21wb25lbnRSZWY6IFBvcG92ZXJTZWxlY3RDb21wb25lbnQpIHt9XG5cbiAgcmVtb3ZlKGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNlbGVjdENvbXBvbmVudFJlZikge1xuICAgICAgdGhpcy5zZWxlY3RDb21wb25lbnRSZWYuY2xvc2VDaGlwKHRoaXMucG9wcHlDaGlwUmVtb3ZlLCBldmVudCk7XG4gICAgfVxuICB9XG59XG4iXX0=