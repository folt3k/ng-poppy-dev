import { ElementRef, EventEmitter, AfterViewInit, TemplateRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PopoverMenuComponent } from '../components/popover-menu/popover-menu.component';
export declare class PopoverMenuItemDirective implements OnInit, AfterViewInit {
    element: ElementRef;
    submenu: PopoverMenuComponent | TemplateRef<any>;
    selected: boolean;
    hidden: boolean;
    clicked: EventEmitter<void>;
    get selectedClass(): boolean;
    get hiddenClass(): boolean;
    clicked$: Observable<MouseEvent>;
    hovered$: Observable<MouseEvent>;
    global$: Observable<MouseEvent>;
    constructor(element: ElementRef);
    ngOnInit(): void;
    ngAfterViewInit(): void;
}
