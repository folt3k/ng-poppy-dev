import { Component, ViewEncapsulation, forwardRef, Input, ViewChild, ChangeDetectorRef, ContentChild, ChangeDetectionStrategy, Output, EventEmitter, Optional, Host, SkipSelf, } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlContainer, NG_VALIDATORS } from '@angular/forms';
import { debounceTime, map, take, takeUntil, tap } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
import { PopoverChipDirective, PopoverMenuDirective, PopoverOptionDirective } from '../../directives';
export class PopoverSelectComponent {
    constructor(cdr, controlContainer) {
        this.cdr = cdr;
        this.controlContainer = controlContainer;
        this.options = [];
        this.bindLabel = 'label';
        this.multiselect = false;
        this.clearable = true;
        this.searchable = true;
        this.placeholder = 'Wybierz..';
        this.notFoundText = 'Nie znaleziono wyników';
        this.changed = new EventEmitter();
        this.selectedOptions = [];
        this.displayedOptions = [];
        this.displayedChips = [];
        this.asyncLoading = false;
        this.isMenuOpen = false;
        this.destroy$ = new Subject();
        this.propagateChange = (value) => { };
    }
    ngOnInit() { }
    ngOnChanges(changes) {
        if (changes.options && changes.options.previousValue !== changes.options.currentValue) {
            this.onOptionsChange();
        }
        if (changes.value && changes.value.previousValue !== changes.value.currentValue) {
            this.writeValue(this.value);
        }
    }
    ngAfterViewInit() {
        this.menuRef.afterClose.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.isMenuOpen = false;
            if (!this.multiselect) {
                this.onCloseMenu();
            }
            this.cdr.detectChanges();
        });
        this.menuRef.afterShow.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.isMenuOpen = true;
            this.cdr.detectChanges();
        });
        this.menuRef.afterClose.pipe(take(1)).subscribe(() => {
            // TODO: mark as touched..
            // if (this.control) {
            //   this.control.markAsTouched();
            //   this.control.updateValueAndValidity();
            // }
        });
        if (this.async) {
            this.loadAsyncOptions(null, { firstLoad: true });
        }
        if (this.searchable) {
            this.onInputKeyUp();
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    get noItemsFound() {
        return !this.displayedOptions.length || !!this.displayedOptions.every((opt) => opt.hidden);
    }
    writeValue(value) {
        if (value !== undefined) {
            if (this.multiselect) {
                this.updateSelectedItemsForMultiSelection(value);
            }
            else {
                this.updateSelectedItemsForSingleSelection(value);
            }
        }
        else {
            this.reset();
        }
        setTimeout(() => {
            this.cdr.detectChanges();
        });
    }
    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched() { }
    setDisabledState(isDisabled) { }
    getDisplayLabel(option) {
        return this.bindLabel ? option[this.bindLabel] : '';
    }
    onClickItem(clickedOption) {
        this.selectedOptions = [];
        this.displayedOptions.forEach((option, index) => {
            if (this.matchByValueOrReference(option, clickedOption)) {
                this.displayedOptions[index].selected = this.multiselect ? !option.selected : true;
                this.displayedOptions[index].hidden = this.multiselect ? !option.hidden : false;
            }
            else {
                if (!this.multiselect) {
                    this.displayedOptions[index].selected = false;
                }
            }
            if (this.displayedOptions[index].selected) {
                this.selectedOptions.push(this.options[index]);
            }
        });
        if (this.multiselect) {
            this.updateDisplayedChips();
        }
        if (!this.multiselect) {
            this.inputEl.nativeElement.value = this.bindLabel ? this.selectedOptions[0][this.bindLabel] : '';
        }
        this.emitChange();
        this.cdr.detectChanges();
    }
    onChangeInput(target) {
        const value = target.value;
        if (this.bindLabel) {
            if (this.async) {
                this.loadAsyncOptions(value);
            }
            else {
                this.displayedOptions.forEach((option, index) => {
                    this.displayedOptions[index].hidden = !option[this.bindLabel].includes(value);
                });
                this.cdr.detectChanges();
            }
        }
    }
    clear(event) {
        event.stopPropagation();
        this.reset();
        this.emitChange();
    }
    getDisplayValue() {
        if (!!this.selectedOptions.length) {
            if (this.multiselect) {
                return '';
            }
            if (typeof this.selectedOptions[0] === 'object' && this.bindLabel) {
                return this.selectedOptions[0][this.bindLabel];
            }
            return '';
        }
        return '';
    }
    closeChip(chip, event) {
        this.selectedOptions = [];
        this.displayedOptions.forEach((option, index) => {
            if (this.matchByValueOrReference(option, chip)) {
                this.displayedOptions[index].selected = false;
                this.displayedOptions[index].hidden = false;
            }
            if (this.displayedOptions[index].selected) {
                this.selectedOptions.push(this.options[index]);
            }
        });
        this.updateDisplayedChips();
        this.emitChange();
        if (event) {
            event.stopPropagation();
        }
        this.cdr.detectChanges();
    }
    onOptionsChange() {
        this.displayedOptions = [...this.options].map((option) => (Object.assign(Object.assign({}, option), { selected: false, hidden: false })));
    }
    onInputKeyUp() {
        fromEvent(this.inputEl.nativeElement, 'keyup')
            .pipe(tap(() => {
            if (this.async) {
                this.asyncLoading = true;
            }
        }), debounceTime(!!this.async ? 500 : 0), map((event) => event.target), takeUntil(this.destroy$))
            .subscribe((target) => {
            this.onChangeInput(target);
        });
    }
    reset() {
        this.displayedOptions.forEach((option, index) => {
            this.displayedOptions[index].hidden = false;
            this.displayedOptions[index].selected = false;
        });
        this.selectedOptions = [];
        if (this.multiselect) {
            this.displayedChips = [];
        }
    }
    emitChange() {
        const value = this.getPropagateValue();
        this.propagateChange(value);
        this.changed.emit(value);
    }
    getPropagateValue() {
        if (!this.selectedOptions.length) {
            return this.multiselect ? [] : null;
        }
        if (this.multiselect) {
            return this.bindValue
                ? this.selectedOptions.map((option) => option[this.bindValue])
                : this.selectedOptions;
        }
        return this.bindValue ? this.selectedOptions[0][this.bindValue] : this.selectedOptions[0];
    }
    onCloseMenu() {
        this.inputEl.nativeElement.value = !!this.selectedOptions.length
            ? this.selectedOptions[0][this.bindLabel]
            : null;
        this.displayedOptions.forEach((option, index) => {
            this.displayedOptions[index].hidden = false;
        });
    }
    loadAsyncOptions(searchPhrase, options = {}) {
        this.asyncLoading = !options.firstLoad;
        this.async(searchPhrase).subscribe((results) => {
            this.options = results;
            this.onOptionsChange();
            this.asyncLoading = false;
            this.cdr.detectChanges();
        });
    }
    updateSelectedItemsForMultiSelection(value) {
        if (!Array.isArray(value)) {
            if (value !== null) {
                throw Error('Initial value for multiselect must be an array!');
            }
            else {
                value = [];
            }
        }
        this.selectedOptions = [];
        this.displayedChips = [];
        this.options.forEach((option, index) => {
            const matchOption = !!value.find((v) => this.matchByValueOrReference(option, v));
            if (matchOption) {
                this.selectedOptions.push(option);
                this.displayedOptions[index].selected = true;
                this.displayedOptions[index].hidden = true;
            }
            else {
                this.displayedOptions[index].selected = false;
                this.displayedOptions[index].hidden = false;
            }
        });
        this.updateDisplayedChips();
    }
    updateSelectedItemsForSingleSelection(value) {
        this.options.forEach((option, index) => {
            if (this.matchByValueOrReference(option, value)) {
                this.selectedOptions = [option];
                this.displayedOptions[index].selected = true;
            }
            else {
                this.displayedOptions[index].selected = false;
            }
        });
        if (!value) {
            this.selectedOptions = [];
        }
    }
    updateDisplayedChips() {
        this.displayedOptions
            .filter((option) => option.selected)
            .forEach((option) => {
            const chipIndex = this.displayedChips.findIndex((chip) => this.matchByValueOrReference(chip, option));
            if (chipIndex === -1) {
                this.displayedChips.push(option);
            }
        });
        this.displayedChips.forEach((chip, index) => {
            const option = this.displayedOptions
                .filter((opt) => opt.selected)
                .find((opt) => this.matchByValueOrReference(chip, opt));
            if (!option) {
                this.displayedChips.splice(index, 1);
            }
        });
        if (this.menuRef) {
            setTimeout(() => {
                this.menuRef.updateContentPosition();
            });
        }
    }
    matchByValueOrReference(item, comparedTo) {
        if (this.bindValue) {
            if (comparedTo && comparedTo[this.bindValue] !== undefined) {
                // tslint:disable-next-line:triple-equals
                return item[this.bindValue] == comparedTo[this.bindValue];
            }
            // tslint:disable-next-line:triple-equals
            return item[this.bindValue] == comparedTo;
        }
        return item === comparedTo;
    }
}
PopoverSelectComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'poppy-select',
                template: "  <div class=\"poppy-select\" [poppyMenu]=\"menu\" [closeOnClickItem]=\"!multiselect\">\n    <div class=\"poppy-select__content\">\n      <div *ngIf=\"multiselect\" class=\"poppy-select__multiselect\">\n        <div *ngFor=\"let chip of displayedChips\" class=\"poppy-select__chip\">\n          <ng-container *ngIf=\"chipTemplate\">\n            <ng-container\n              [ngTemplateOutlet]=\"chipTemplate.template\"\n              [ngTemplateOutletContext]=\"{ $implicit: chip }\"\n            ></ng-container>\n          </ng-container>\n          <div *ngIf=\"!chipTemplate\" class=\"poppy-chip\">\n            <div class=\"poppy-chip__content\">{{ getDisplayLabel(chip) }}</div>\n            <div class=\"poppy-chip__close\" (click)=\"closeChip(chip, $event)\">\n              &#10006;\n            </div>\n          </div>\n        </div>\n        <span class=\"poppy-select__placeholder\" *ngIf=\"!selectedOptions.length\">{{ placeholder }}</span>\n      </div>\n\n      <input\n        #input\n        [hidden]=\"multiselect\"\n        [placeholder]=\"placeholder\"\n        [value]=\"getDisplayValue()\"\n        [readOnly]=\"!searchable\"\n        type=\"text\"\n      />\n\n      <div *ngIf=\"clearable && !multiselect && !!getDisplayValue()\" class=\"poppy-select__clear\">\n        <button class=\"clear-btn\" (click)=\"clear($event)\">&times;</button>\n      </div>\n\n      <div *ngIf=\"!asyncLoading\" class=\"poppy-select__arrow\">\n        <span *ngIf=\"isMenuOpen\" class=\"material-icons\">\n          keyboard_arrow_up\n        </span>\n        <span *ngIf=\"!isMenuOpen\" class=\"material-icons\">\n          keyboard_arrow_down\n        </span>\n      </div>\n\n      <ng-container *ngIf=\"asyncLoading\">\n        <div class=\"poppy-select__loader\">\n          loader..\n        </div>\n      </ng-container>\n    </div>\n  </div>\n\n<poppy-menu #menu=\"poppyMenu\">\n  <li\n    *ngFor=\"let option of displayedOptions\"\n    poppy-menu-item\n    [hidden]=\"option.hidden\"\n    [selected]=\"option.selected\"\n    (clicked)=\"onClickItem(option)\"\n  >\n    <ng-container *ngIf=\"optionTemplate\">\n      <ng-container\n        [ngTemplateOutlet]=\"optionTemplate.template\"\n        [ngTemplateOutletContext]=\"{ $implicit: option }\"\n      ></ng-container>\n    </ng-container>\n    <ng-container *ngIf=\"!optionTemplate\">\n      {{ getDisplayLabel(option) }}\n    </ng-container>\n  </li>\n  <div class=\"poppy__no-items\" *ngIf=\"noItemsFound\">{{ notFoundText }}</div>\n</poppy-menu>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => PopoverSelectComponent),
                        multi: true,
                    },
                    {
                        provide: NG_VALIDATORS,
                        useExisting: forwardRef(() => PopoverSelectComponent),
                        multi: true,
                    },
                ],
                styles: [".poppy-select{align-items:center;box-sizing:border-box;cursor:pointer;display:flex;min-height:42px}.poppy-select__content{min-height:18px;position:relative;width:100%}.poppy-select__content input{cursor:pointer;padding-right:2rem}.poppy-select__chips{height:100%;margin-bottom:-6px}.poppy-select__multiselect{align-items:center;border:2px solid #282828;border-radius:4px;display:flex;flex-wrap:wrap;min-height:44px;padding:.18rem .8rem;width:100%}.poppy-select__chip{display:inline-block;margin-bottom:4px;margin-right:6px;margin-top:4px}.poppy-select__arrow{color:#f6f6f6;position:absolute;right:8px;top:12px}.poppy-select__clear{color:#f6f6f6;position:absolute;right:32px;top:9px}.poppy-chip{align-items:stretch;background-color:#edebe9;border-radius:16px;cursor:pointer;display:flex;font-size:.92em;height:26px;line-height:1;overflow:hidden}.poppy-chip__content{align-items:center;display:flex;font-size:inherit;line-height:1rem;margin-right:4px;padding:0 0 0 10px}.poppy-chip__close{align-items:center;background-color:#343333;border-radius:16px;display:flex;font-size:.86em;justify-content:center;padding-top:1px;width:26px}.poppy-chip__close:hover{background-color:#f6f6f6}.poppy__no-items{padding:14px 10px}.poppy-select__placeholder{color:#f6f6f6}.poppy-select__loader{position:absolute;right:15px;top:12px}"]
            },] }
];
PopoverSelectComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ControlContainer, decorators: [{ type: Optional }, { type: Host }, { type: SkipSelf }] }
];
PopoverSelectComponent.propDecorators = {
    options: [{ type: Input }],
    async: [{ type: Input }],
    value: [{ type: Input }],
    bindLabel: [{ type: Input }],
    bindValue: [{ type: Input }],
    multiselect: [{ type: Input }],
    clearable: [{ type: Input }],
    searchable: [{ type: Input }],
    placeholder: [{ type: Input }],
    notFoundText: [{ type: Input }],
    changed: [{ type: Output }],
    inputEl: [{ type: ViewChild, args: ['input',] }],
    menuRef: [{ type: ViewChild, args: [PopoverMenuDirective,] }],
    chipTemplate: [{ type: ContentChild, args: [PopoverChipDirective,] }],
    optionTemplate: [{ type: ContentChild, args: [PopoverOptionDirective,] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1zZWxlY3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii9ob21lL2ZvbHRpL1Byb2plY3RzL25nLXBvcHB5L3Byb2plY3RzL25nLXBvcHB5L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9wb3BvdmVyL2NvbXBvbmVudHMvcG9wb3Zlci1zZWxlY3QvcG9wb3Zlci1zZWxlY3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBRVQsaUJBQWlCLEVBQ2pCLFVBQVUsRUFDVixLQUFLLEVBQ0wsU0FBUyxFQUVULGlCQUFpQixFQUNqQixZQUFZLEVBRVosdUJBQXVCLEVBQ3ZCLE1BQU0sRUFDTixZQUFZLEVBSVosUUFBUSxFQUNSLElBQUksRUFDSixRQUFRLEdBQ1QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGlCQUFpQixFQUF3QixnQkFBZ0IsRUFBRSxhQUFhLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMxRyxPQUFPLEVBQUUsWUFBWSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxTQUFTLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBR3RELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxvQkFBb0IsRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBc0J0RyxNQUFNLE9BQU8sc0JBQXNCO0lBMEJqQyxZQUNVLEdBQXNCLEVBSXRCLGdCQUFrQztRQUpsQyxRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQUl0QixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBOUJuQyxZQUFPLEdBQW1CLEVBQUUsQ0FBQztRQUc3QixjQUFTLEdBQVcsT0FBTyxDQUFDO1FBRTVCLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBQzdCLGNBQVMsR0FBWSxJQUFJLENBQUM7UUFDMUIsZUFBVSxHQUFZLElB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QUFDO2dCQUNULDhDQUE4QztnQkFDOUMsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLG8rRUFBOEM7Z0JBRTlDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsU0FBUyxFQUFFO29CQUNUO3dCQUNFLE9BQU8sRUFBRSxpQkFBaUI7d0JBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsc0JBQXNCLENBQUM7d0JBQ3JELEtBQUssRUFBRSxJQUFJO3FCQUNaO29CQUNEO3dCQUNFLE9BQU8sRUFBRSxhQUFhO3dCQUN0QixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLHNCQUFzQixDQUFDO3dCQUNyRCxLQUFLLEVBQUUsSUFBSTtxQkFDWjtpQkFDRjs7YUFDRjs7O1lBdkNDLGlCQUFpQjtZQWErQixnQkFBZ0IsdUJBdUQ3RCxRQUFRLFlBQ1IsSUFBSSxZQUNKLFFBQVE7OztzQkE3QlYsS0FBSztvQkFDTCxLQUFLO29CQUNMLEtBQUs7d0JBQ0wsS0FBSzt3QkFDTCxLQUFLOzBCQUNMLEtBQUs7d0JBQ0wsS0FBSzt5QkFDTCxLQUFLOzBCQUNMLEtBQUs7MkJBQ0wsS0FBSztzQkFFTCxNQUFNO3NCQUVOLFNBQVMsU0FBQyxPQUFPO3NCQUNqQixTQUFTLFNBQUMsb0JBQW9COzJCQUM5QixZQUFZLFNBQUMsb0JBQW9COzZCQUNqQyxZQUFZLFNBQUMsc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBPbkluaXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBmb3J3YXJkUmVmLFxuICBJbnB1dCxcbiAgVmlld0NoaWxkLFxuICBFbGVtZW50UmVmLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29udGVudENoaWxkLFxuICBPbkRlc3Ryb3ksXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBBZnRlclZpZXdJbml0LFxuICBPcHRpb25hbCxcbiAgSG9zdCxcbiAgU2tpcFNlbGYsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBDb250cm9sQ29udGFpbmVyLCBOR19WQUxJREFUT1JTIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgZGVib3VuY2VUaW1lLCBtYXAsIHRha2UsIHRha2VVbnRpbCwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IFNlbGVjdE9wdGlvbiwgRGlzcGxheWVkU2VsZWN0T3B0aW9uIH0gZnJvbSAnLi9wb3BvdmVyLXNlbGVjdC5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgUG9wb3ZlckNoaXBEaXJlY3RpdmUsIFBvcG92ZXJNZW51RGlyZWN0aXZlLCBQb3BvdmVyT3B0aW9uRGlyZWN0aXZlIH0gZnJvbSAnLi4vLi4vZGlyZWN0aXZlcyc7XG5cbkBDb21wb25lbnQoe1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y29tcG9uZW50LXNlbGVjdG9yXG4gIHNlbGVjdG9yOiAncG9wcHktc2VsZWN0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL3BvcG92ZXItc2VsZWN0LmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vcG9wb3Zlci1zZWxlY3QuY29tcG9uZW50LnNjc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUG9wb3ZlclNlbGVjdENvbXBvbmVudCksXG4gICAgICBtdWx0aTogdHJ1ZSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBQb3BvdmVyU2VsZWN0Q29tcG9uZW50KSxcbiAgICAgIG11bHRpOiB0cnVlLFxuICAgIH0sXG4gIF0sXG59KVxuZXhwb3J0IGNsYXNzIFBvcG92ZXJTZWxlY3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBBZnRlclZpZXdJbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIEBJbnB1dCgpIG9wdGlvbnM6IFNlbGVjdE9wdGlvbltdID0gW107XG4gIEBJbnB1dCgpIGFzeW5jOiAoc2VhcmNoUGhyYXNlPzogc3RyaW5nKSA9PiBPYnNlcnZhYmxlPGFueT47XG4gIEBJbnB1dCgpIHZhbHVlOiBhbnk7XG4gIEBJbnB1dCgpIGJpbmRMYWJlbDogc3RyaW5nID0gJ2xhYmVsJztcbiAgQElucHV0KCkgYmluZFZhbHVlOiBzdHJpbmc7XG4gIEBJbnB1dCgpIG11bHRpc2VsZWN0OiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIGNsZWFyYWJsZTogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIHNlYXJjaGFibGU6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXQoKSBwbGFjZWhvbGRlcjogc3RyaW5nID0gJ1d5YmllcnouLic7XG4gIEBJbnB1dCgpIG5vdEZvdW5kVGV4dDogc3RyaW5nID0gJ05pZSB6bmFsZXppb25vIHd5bmlrw7N3JztcblxuICBAT3V0cHV0KCkgY2hhbmdlZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAVmlld0NoaWxkKCdpbnB1dCcpIGlucHV0RWw6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoUG9wb3Zlck1lbnVEaXJlY3RpdmUpIG1lbnVSZWY6IFBvcG92ZXJNZW51RGlyZWN0aXZlO1xuICBAQ29udGVudENoaWxkKFBvcG92ZXJDaGlwRGlyZWN0aXZlKSBjaGlwVGVtcGxhdGU6IFBvcG92ZXJDaGlwRGlyZWN0aXZlO1xuICBAQ29udGVudENoaWxkKFBvcG92ZXJPcHRpb25EaXJlY3RpdmUpIG9wdGlvblRlbXBsYXRlOiBQb3BvdmVyT3B0aW9uRGlyZWN0aXZlO1xuXG4gIHNlbGVjdGVkT3B0aW9uczogU2VsZWN0T3B0aW9uW10gPSBbXTtcbiAgZGlzcGxheWVkT3B0aW9uczogRGlzcGxheWVkU2VsZWN0T3B0aW9uW10gPSBbXTtcbiAgZGlzcGxheWVkQ2hpcHM6IFNlbGVjdE9wdGlvbltdID0gW107XG4gIGFzeW5jTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xuICBpc01lbnVPcGVuOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdCgpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBIb3N0KClcbiAgICBAU2tpcFNlbGYoKVxuICAgIHByaXZhdGUgY29udHJvbENvbnRhaW5lcjogQ29udHJvbENvbnRhaW5lclxuICApIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7fVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlcy5vcHRpb25zICYmIGNoYW5nZXMub3B0aW9ucy5wcmV2aW91c1ZhbHVlICE9PSBjaGFuZ2VzLm9wdGlvbnMuY3VycmVudFZhbHVlKSB7XG4gICAgICB0aGlzLm9uT3B0aW9uc0NoYW5nZSgpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLnZhbHVlICYmIGNoYW5nZXMudmFsdWUucHJldmlvdXNWYWx1ZSAhPT0gY2hhbmdlcy52YWx1ZS5jdXJyZW50VmFsdWUpIHtcbiAgICAgIHRoaXMud3JpdGVWYWx1ZSh0aGlzLnZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5tZW51UmVmLmFmdGVyQ2xvc2UucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmlzTWVudU9wZW4gPSBmYWxzZTtcbiAgICAgIGlmICghdGhpcy5tdWx0aXNlbGVjdCkge1xuICAgICAgICB0aGlzLm9uQ2xvc2VNZW51KCk7XG4gICAgICB9XG4gICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm1lbnVSZWYuYWZ0ZXJTaG93LnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5pc01lbnVPcGVuID0gdHJ1ZTtcbiAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9KTtcblxuICAgIHRoaXMubWVudVJlZi5hZnRlckNsb3NlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIC8vIFRPRE86IG1hcmsgYXMgdG91Y2hlZC4uXG4gICAgICAvLyBpZiAodGhpcy5jb250cm9sKSB7XG4gICAgICAvLyAgIHRoaXMuY29udHJvbC5tYXJrQXNUb3VjaGVkKCk7XG4gICAgICAvLyAgIHRoaXMuY29udHJvbC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCk7XG4gICAgICAvLyB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5hc3luYykge1xuICAgICAgdGhpcy5sb2FkQXN5bmNPcHRpb25zKG51bGwsIHsgZmlyc3RMb2FkOiB0cnVlIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNlYXJjaGFibGUpIHtcbiAgICAgIHRoaXMub25JbnB1dEtleVVwKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gICAgdGhpcy5kZXN0cm95JC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgZ2V0IG5vSXRlbXNGb3VuZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMuZGlzcGxheWVkT3B0aW9ucy5sZW5ndGggfHwgISF0aGlzLmRpc3BsYXllZE9wdGlvbnMuZXZlcnkoKG9wdCkgPT4gb3B0LmhpZGRlbik7XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHRoaXMubXVsdGlzZWxlY3QpIHtcbiAgICAgICAgdGhpcy51cGRhdGVTZWxlY3RlZEl0ZW1zRm9yTXVsdGlTZWxlY3Rpb24odmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy51cGRhdGVTZWxlY3RlZEl0ZW1zRm9yU2luZ2xlU2VsZWN0aW9uKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH1cblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5wcm9wYWdhdGVDaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKCk6IHZvaWQge31cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHt9XG5cbiAgcHJvcGFnYXRlQ2hhbmdlID0gKHZhbHVlKSA9PiB7fTtcblxuICBnZXREaXNwbGF5TGFiZWwob3B0aW9uOiBTZWxlY3RPcHRpb24pOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmJpbmRMYWJlbCA/IG9wdGlvblt0aGlzLmJpbmRMYWJlbF0gOiAnJztcbiAgfVxuXG4gIG9uQ2xpY2tJdGVtKGNsaWNrZWRPcHRpb246IFNlbGVjdE9wdGlvbik6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0ZWRPcHRpb25zID0gW107XG4gICAgdGhpcy5kaXNwbGF5ZWRPcHRpb25zLmZvckVhY2goKG9wdGlvbiwgaW5kZXgpID0+IHtcbiAgICAgIGlmICh0aGlzLm1hdGNoQnlWYWx1ZU9yUmVmZXJlbmNlKG9wdGlvbiwgY2xpY2tlZE9wdGlvbikpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5ZWRPcHRpb25zW2luZGV4XS5zZWxlY3RlZCA9IHRoaXMubXVsdGlzZWxlY3QgPyAhb3B0aW9uLnNlbGVjdGVkIDogdHJ1ZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ZWRPcHRpb25zW2luZGV4XS5oaWRkZW4gPSB0aGlzLm11bHRpc2VsZWN0ID8gIW9wdGlvbi5oaWRkZW4gOiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghdGhpcy5tdWx0aXNlbGVjdCkge1xuICAgICAgICAgIHRoaXMuZGlzcGxheWVkT3B0aW9uc1tpbmRleF0uc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZGlzcGxheWVkT3B0aW9uc1tpbmRleF0uc2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZE9wdGlvbnMucHVzaCh0aGlzLm9wdGlvbnNbaW5kZXhdKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLm11bHRpc2VsZWN0KSB7XG4gICAgICB0aGlzLnVwZGF0ZURpc3BsYXllZENoaXBzKCk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm11bHRpc2VsZWN0KSB7XG4gICAgICB0aGlzLmlucHV0RWwubmF0aXZlRWxlbWVudC52YWx1ZSA9IHRoaXMuYmluZExhYmVsID8gdGhpcy5zZWxlY3RlZE9wdGlvbnNbMF1bdGhpcy5iaW5kTGFiZWxdIDogJyc7XG4gICAgfVxuXG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgb25DaGFuZ2VJbnB1dCh0YXJnZXQ6IEV2ZW50VGFyZ2V0KTogdm9pZCB7XG4gICAgY29uc3QgdmFsdWUgPSAodGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xuXG4gICAgaWYgKHRoaXMuYmluZExhYmVsKSB7XG4gICAgICBpZiAodGhpcy5hc3luYykge1xuICAgICAgICB0aGlzLmxvYWRBc3luY09wdGlvbnModmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5ZWRPcHRpb25zLmZvckVhY2goKG9wdGlvbiwgaW5kZXgpID0+IHtcbiAgICAgICAgICB0aGlzLmRpc3BsYXllZE9wdGlvbnNbaW5kZXhdLmhpZGRlbiA9ICFvcHRpb25bdGhpcy5iaW5kTGFiZWxdLmluY2x1ZGVzKHZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjbGVhcihldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB0aGlzLnJlc2V0KCk7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBnZXREaXNwbGF5VmFsdWUoKTogc3RyaW5nIHtcbiAgICBpZiAoISF0aGlzLnNlbGVjdGVkT3B0aW9ucy5sZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLm11bHRpc2VsZWN0KSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5zZWxlY3RlZE9wdGlvbnNbMF0gPT09ICdvYmplY3QnICYmIHRoaXMuYmluZExhYmVsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNlbGVjdGVkT3B0aW9uc1swXVt0aGlzLmJpbmRMYWJlbF07XG4gICAgICB9XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIGNsb3NlQ2hpcChjaGlwOiBTZWxlY3RPcHRpb24sIGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0ZWRPcHRpb25zID0gW107XG4gICAgdGhpcy5kaXNwbGF5ZWRPcHRpb25zLmZvckVhY2goKG9wdGlvbiwgaW5kZXgpID0+IHtcbiAgICAgIGlmICh0aGlzLm1hdGNoQnlWYWx1ZU9yUmVmZXJlbmNlKG9wdGlvbiwgY2hpcCkpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5ZWRPcHRpb25zW2luZGV4XS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRpc3BsYXllZE9wdGlvbnNbaW5kZXhdLmhpZGRlbiA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZGlzcGxheWVkT3B0aW9uc1tpbmRleF0uc2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZE9wdGlvbnMucHVzaCh0aGlzLm9wdGlvbnNbaW5kZXhdKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMudXBkYXRlRGlzcGxheWVkQ2hpcHMoKTtcbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcblxuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBvbk9wdGlvbnNDaGFuZ2UoKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwbGF5ZWRPcHRpb25zID0gWy4uLnRoaXMub3B0aW9uc10ubWFwKChvcHRpb24pID0+ICh7XG4gICAgICAuLi5vcHRpb24sXG4gICAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgICBoaWRkZW46IGZhbHNlLFxuICAgIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgb25JbnB1dEtleVVwKCk6IHZvaWQge1xuICAgIGZyb21FdmVudCh0aGlzLmlucHV0RWwubmF0aXZlRWxlbWVudCwgJ2tleXVwJylcbiAgICAgIC5waXBlKFxuICAgICAgICB0YXAoKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmFzeW5jKSB7XG4gICAgICAgICAgICB0aGlzLmFzeW5jTG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgICAgZGVib3VuY2VUaW1lKCEhdGhpcy5hc3luYyA/IDUwMCA6IDApLFxuICAgICAgICBtYXAoKGV2ZW50OiBFdmVudCkgPT4gZXZlbnQudGFyZ2V0KSxcbiAgICAgICAgdGFrZVVudGlsKHRoaXMuZGVzdHJveSQpXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKCh0YXJnZXQpID0+IHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZUlucHV0KHRhcmdldCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVzZXQoKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwbGF5ZWRPcHRpb25zLmZvckVhY2goKG9wdGlvbiwgaW5kZXgpID0+IHtcbiAgICAgIHRoaXMuZGlzcGxheWVkT3B0aW9uc1tpbmRleF0uaGlkZGVuID0gZmFsc2U7XG4gICAgICB0aGlzLmRpc3BsYXllZE9wdGlvbnNbaW5kZXhdLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgfSk7XG4gICAgdGhpcy5zZWxlY3RlZE9wdGlvbnMgPSBbXTtcbiAgICBpZiAodGhpcy5tdWx0aXNlbGVjdCkge1xuICAgICAgdGhpcy5kaXNwbGF5ZWRDaGlwcyA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZW1pdENoYW5nZSgpOiB2b2lkIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZ2V0UHJvcGFnYXRlVmFsdWUoKTtcbiAgICB0aGlzLnByb3BhZ2F0ZUNoYW5nZSh2YWx1ZSk7XG4gICAgdGhpcy5jaGFuZ2VkLmVtaXQodmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQcm9wYWdhdGVWYWx1ZSgpOiBhbnkgfCBhbnlbXSB7XG4gICAgaWYgKCF0aGlzLnNlbGVjdGVkT3B0aW9ucy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0aGlzLm11bHRpc2VsZWN0ID8gW10gOiBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5tdWx0aXNlbGVjdCkge1xuICAgICAgcmV0dXJuIHRoaXMuYmluZFZhbHVlXG4gICAgICAgID8gdGhpcy5zZWxlY3RlZE9wdGlvbnMubWFwKChvcHRpb24pID0+IG9wdGlvblt0aGlzLmJpbmRWYWx1ZV0pXG4gICAgICAgIDogdGhpcy5zZWxlY3RlZE9wdGlvbnM7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmJpbmRWYWx1ZSA/IHRoaXMuc2VsZWN0ZWRPcHRpb25zWzBdW3RoaXMuYmluZFZhbHVlXSA6IHRoaXMuc2VsZWN0ZWRPcHRpb25zWzBdO1xuICB9XG5cbiAgcHJpdmF0ZSBvbkNsb3NlTWVudSgpOiB2b2lkIHtcbiAgICB0aGlzLmlucHV0RWwubmF0aXZlRWxlbWVudC52YWx1ZSA9ICEhdGhpcy5zZWxlY3RlZE9wdGlvbnMubGVuZ3RoXG4gICAgICA/IHRoaXMuc2VsZWN0ZWRPcHRpb25zWzBdW3RoaXMuYmluZExhYmVsXVxuICAgICAgOiBudWxsO1xuICAgIHRoaXMuZGlzcGxheWVkT3B0aW9ucy5mb3JFYWNoKChvcHRpb24sIGluZGV4KSA9PiB7XG4gICAgICB0aGlzLmRpc3BsYXllZE9wdGlvbnNbaW5kZXhdLmhpZGRlbiA9IGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2FkQXN5bmNPcHRpb25zKHNlYXJjaFBocmFzZT86IHN0cmluZywgb3B0aW9uczogeyBmaXJzdExvYWQ/OiBib29sZWFuIH0gPSB7fSk6IHZvaWQge1xuICAgIHRoaXMuYXN5bmNMb2FkaW5nID0gIW9wdGlvbnMuZmlyc3RMb2FkO1xuICAgIHRoaXMuYXN5bmMoc2VhcmNoUGhyYXNlKS5zdWJzY3JpYmUoKHJlc3VsdHMpID0+IHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IHJlc3VsdHM7XG4gICAgICB0aGlzLm9uT3B0aW9uc0NoYW5nZSgpO1xuICAgICAgdGhpcy5hc3luY0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlU2VsZWN0ZWRJdGVtc0Zvck11bHRpU2VsZWN0aW9uKHZhbHVlOiBTZWxlY3RPcHRpb25bXSk6IHZvaWQge1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIGlmICh2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBFcnJvcignSW5pdGlhbCB2YWx1ZSBmb3IgbXVsdGlzZWxlY3QgbXVzdCBiZSBhbiBhcnJheSEnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gW107XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZWxlY3RlZE9wdGlvbnMgPSBbXTtcbiAgICB0aGlzLmRpc3BsYXllZENoaXBzID0gW107XG4gICAgdGhpcy5vcHRpb25zLmZvckVhY2goKG9wdGlvbiwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IG1hdGNoT3B0aW9uID0gISF2YWx1ZS5maW5kKCh2KSA9PiB0aGlzLm1hdGNoQnlWYWx1ZU9yUmVmZXJlbmNlKG9wdGlvbiwgdikpO1xuXG4gICAgICBpZiAobWF0Y2hPcHRpb24pIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZE9wdGlvbnMucHVzaChvcHRpb24pO1xuICAgICAgICB0aGlzLmRpc3BsYXllZE9wdGlvbnNbaW5kZXhdLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ZWRPcHRpb25zW2luZGV4XS5oaWRkZW4gPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5ZWRPcHRpb25zW2luZGV4XS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRpc3BsYXllZE9wdGlvbnNbaW5kZXhdLmhpZGRlbiA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy51cGRhdGVEaXNwbGF5ZWRDaGlwcygpO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVTZWxlY3RlZEl0ZW1zRm9yU2luZ2xlU2VsZWN0aW9uKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9wdGlvbnMuZm9yRWFjaCgob3B0aW9uLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKHRoaXMubWF0Y2hCeVZhbHVlT3JSZWZlcmVuY2Uob3B0aW9uLCB2YWx1ZSkpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZE9wdGlvbnMgPSBbb3B0aW9uXTtcbiAgICAgICAgdGhpcy5kaXNwbGF5ZWRPcHRpb25zW2luZGV4XS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRpc3BsYXllZE9wdGlvbnNbaW5kZXhdLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkT3B0aW9ucyA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlRGlzcGxheWVkQ2hpcHMoKTogdm9pZCB7XG4gICAgdGhpcy5kaXNwbGF5ZWRPcHRpb25zXG4gICAgICAuZmlsdGVyKChvcHRpb24pID0+IG9wdGlvbi5zZWxlY3RlZClcbiAgICAgIC5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICAgICAgY29uc3QgY2hpcEluZGV4ID0gdGhpcy5kaXNwbGF5ZWRDaGlwcy5maW5kSW5kZXgoKGNoaXApID0+IHRoaXMubWF0Y2hCeVZhbHVlT3JSZWZlcmVuY2UoY2hpcCwgb3B0aW9uKSk7XG4gICAgICAgIGlmIChjaGlwSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgdGhpcy5kaXNwbGF5ZWRDaGlwcy5wdXNoKG9wdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIHRoaXMuZGlzcGxheWVkQ2hpcHMuZm9yRWFjaCgoY2hpcCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IG9wdGlvbiA9IHRoaXMuZGlzcGxheWVkT3B0aW9uc1xuICAgICAgICAuZmlsdGVyKChvcHQpID0+IG9wdC5zZWxlY3RlZClcbiAgICAgICAgLmZpbmQoKG9wdCkgPT4gdGhpcy5tYXRjaEJ5VmFsdWVPclJlZmVyZW5jZShjaGlwLCBvcHQpKTtcbiAgICAgIGlmICghb3B0aW9uKSB7XG4gICAgICAgIHRoaXMuZGlzcGxheWVkQ2hpcHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLm1lbnVSZWYpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLm1lbnVSZWYudXBkYXRlQ29udGVudFBvc2l0aW9uKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG1hdGNoQnlWYWx1ZU9yUmVmZXJlbmNlKGl0ZW06IFNlbGVjdE9wdGlvbiwgY29tcGFyZWRUbzogU2VsZWN0T3B0aW9uKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuYmluZFZhbHVlKSB7XG4gICAgICBpZiAoY29tcGFyZWRUbyAmJiBjb21wYXJlZFRvW3RoaXMuYmluZFZhbHVlXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp0cmlwbGUtZXF1YWxzXG4gICAgICAgIHJldHVybiBpdGVtW3RoaXMuYmluZFZhbHVlXSA9PSBjb21wYXJlZFRvW3RoaXMuYmluZFZhbHVlXTtcbiAgICAgIH1cbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp0cmlwbGUtZXF1YWxzXG4gICAgICByZXR1cm4gaXRlbVt0aGlzLmJpbmRWYWx1ZV0gPT0gY29tcGFyZWRUbztcbiAgICB9XG5cbiAgICByZXR1cm4gaXRlbSA9PT0gY29tcGFyZWRUbztcbiAgfVxufVxuIl19