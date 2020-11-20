import { PopoverContentComponent } from '../components/popover-content/popover-content.component';
export declare class PopoverStyles {
    private popover;
    private hostElement;
    private config;
    private type;
    private initHostElementWidth;
    constructor(popover: PopoverContentComponent);
    init(): void;
    update(): void;
    private setTopPosition;
    private setLeftPosition;
    private setWidth;
    private setPositionStyle;
    private get defaultLeftPosition();
    private get canAssignPadding();
    private get isContextType();
    private get isMenuType();
    private get isSubmenuType();
    private get isTooltip();
}
