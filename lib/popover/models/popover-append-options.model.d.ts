import { IPopoverAppendOptions, PopoverTrigger, PopoverType } from '../popover.interface';
export declare class PopoverAppendOptions {
    type: PopoverType;
    triggeredBy: PopoverTrigger;
    closeOnScroll: boolean;
    delayClose: number;
    closeOnTriggerAgain: boolean;
    hideOnScroll: boolean;
    constructor(options: IPopoverAppendOptions);
}
