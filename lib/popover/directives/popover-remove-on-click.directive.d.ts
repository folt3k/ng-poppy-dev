import { ElementRef } from '@angular/core';
import { PopoverService } from '../services/popover.service';
export declare class PopoverRemoveOnClickDirective {
    private host;
    private popoverService;
    onClick(): void;
    constructor(host: ElementRef, popoverService: PopoverService);
    remove(): void;
}
