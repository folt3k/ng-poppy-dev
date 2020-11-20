import { PopoverSelectComponent } from '../components/popover-select/popover-select.component';
export declare class PopoverChipRemoveDirective {
    private selectComponentRef;
    poppyChipRemove: any;
    onClick(event: Event): void;
    constructor(selectComponentRef: PopoverSelectComponent);
    remove(event: Event): void;
}
