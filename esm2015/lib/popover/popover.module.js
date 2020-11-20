import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverContentComponent } from './components/popover-content/popover-content.component';
import { LayerModule } from '../layer/layer.module';
import { PopoverMenuComponent } from './components/popover-menu/popover-menu.component';
import { PopoverSelectComponent } from './components/popover-select/popover-select.component';
import { TooltipDirective, PopoverDirective, PopoverChipDirective, PopoverChipRemoveDirective, PopoverMenuDirective, PopoverMenuItemDirective, PopoverOptionDirective, PopoverRemoveOnClickDirective, } from './directives';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
export class PopoverModule {
}
PopoverModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    PopoverDirective,
                    PopoverMenuDirective,
                    PopoverContentComponent,
                    PopoverMenuItemDirective,
                    PopoverMenuComponent,
                    PopoverSelectComponent,
                    PopoverChipDirective,
                    PopoverChipRemoveDirective,
                    PopoverRemoveOnClickDirective,
                    PopoverOptionDirective,
                    TooltipDirective,
                ],
                imports: [CommonModule, BrowserAnimationsModule, LayerModule],
                exports: [
                    PopoverDirective,
                    PopoverMenuDirective,
                    PopoverMenuItemDirective,
                    PopoverMenuComponent,
                    PopoverSelectComponent,
                    PopoverChipDirective,
                    PopoverChipRemoveDirective,
                    PopoverRemoveOnClickDirective,
                    PopoverOptionDirective,
                    TooltipDirective,
                ],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvZm9sdGkvUHJvamVjdHMvbmctcG9wcHkvcHJvamVjdHMvbmctcG9wcHkvc3JjLyIsInNvdXJjZXMiOlsibGliL3BvcG92ZXIvcG9wb3Zlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sd0RBQXdELENBQUM7QUFDakcsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3BELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDO0FBQzlGLE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIsZ0JBQWdCLEVBQ2hCLG9CQUFvQixFQUNwQiwwQkFBMEIsRUFDMUIsb0JBQW9CLEVBQ3BCLHdCQUF3QixFQUN4QixzQkFBc0IsRUFDdEIsNkJBQTZCLEdBQzlCLE1BQU0sY0FBYyxDQUFDO0FBQ3RCLE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBOEI3RSxNQUFNLE9BQU8sYUFBYTs7O1lBNUJ6QixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLGdCQUFnQjtvQkFDaEIsb0JBQW9CO29CQUNwQix1QkFBdUI7b0JBQ3ZCLHdCQUF3QjtvQkFDeEIsb0JBQW9CO29CQUNwQixzQkFBc0I7b0JBQ3RCLG9CQUFvQjtvQkFDcEIsMEJBQTBCO29CQUMxQiw2QkFBNkI7b0JBQzdCLHNCQUFzQjtvQkFDdEIsZ0JBQWdCO2lCQUNqQjtnQkFDRCxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsdUJBQXVCLEVBQUUsV0FBVyxDQUFDO2dCQUM3RCxPQUFPLEVBQUU7b0JBQ1AsZ0JBQWdCO29CQUNoQixvQkFBb0I7b0JBQ3BCLHdCQUF3QjtvQkFDeEIsb0JBQW9CO29CQUNwQixzQkFBc0I7b0JBQ3RCLG9CQUFvQjtvQkFDcEIsMEJBQTBCO29CQUMxQiw2QkFBNkI7b0JBQzdCLHNCQUFzQjtvQkFDdEIsZ0JBQWdCO2lCQUNqQjthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IFBvcG92ZXJDb250ZW50Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3BvcG92ZXItY29udGVudC9wb3BvdmVyLWNvbnRlbnQuY29tcG9uZW50JztcbmltcG9ydCB7IExheWVyTW9kdWxlIH0gZnJvbSAnLi4vbGF5ZXIvbGF5ZXIubW9kdWxlJztcbmltcG9ydCB7IFBvcG92ZXJNZW51Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3BvcG92ZXItbWVudS9wb3BvdmVyLW1lbnUuY29tcG9uZW50JztcbmltcG9ydCB7IFBvcG92ZXJTZWxlY3RDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvcG9wb3Zlci1zZWxlY3QvcG9wb3Zlci1zZWxlY3QuY29tcG9uZW50JztcbmltcG9ydCB7XG4gIFRvb2x0aXBEaXJlY3RpdmUsXG4gIFBvcG92ZXJEaXJlY3RpdmUsXG4gIFBvcG92ZXJDaGlwRGlyZWN0aXZlLFxuICBQb3BvdmVyQ2hpcFJlbW92ZURpcmVjdGl2ZSxcbiAgUG9wb3Zlck1lbnVEaXJlY3RpdmUsXG4gIFBvcG92ZXJNZW51SXRlbURpcmVjdGl2ZSxcbiAgUG9wb3Zlck9wdGlvbkRpcmVjdGl2ZSxcbiAgUG9wb3ZlclJlbW92ZU9uQ2xpY2tEaXJlY3RpdmUsXG59IGZyb20gJy4vZGlyZWN0aXZlcyc7XG5pbXBvcnQge0Jyb3dzZXJBbmltYXRpb25zTW9kdWxlfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBQb3BvdmVyRGlyZWN0aXZlLFxuICAgIFBvcG92ZXJNZW51RGlyZWN0aXZlLFxuICAgIFBvcG92ZXJDb250ZW50Q29tcG9uZW50LFxuICAgIFBvcG92ZXJNZW51SXRlbURpcmVjdGl2ZSxcbiAgICBQb3BvdmVyTWVudUNvbXBvbmVudCxcbiAgICBQb3BvdmVyU2VsZWN0Q29tcG9uZW50LFxuICAgIFBvcG92ZXJDaGlwRGlyZWN0aXZlLFxuICAgIFBvcG92ZXJDaGlwUmVtb3ZlRGlyZWN0aXZlLFxuICAgIFBvcG92ZXJSZW1vdmVPbkNsaWNrRGlyZWN0aXZlLFxuICAgIFBvcG92ZXJPcHRpb25EaXJlY3RpdmUsXG4gICAgVG9vbHRpcERpcmVjdGl2ZSxcbiAgXSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgQnJvd3NlckFuaW1hdGlvbnNNb2R1bGUsIExheWVyTW9kdWxlXSxcbiAgZXhwb3J0czogW1xuICAgIFBvcG92ZXJEaXJlY3RpdmUsXG4gICAgUG9wb3Zlck1lbnVEaXJlY3RpdmUsXG4gICAgUG9wb3Zlck1lbnVJdGVtRGlyZWN0aXZlLFxuICAgIFBvcG92ZXJNZW51Q29tcG9uZW50LFxuICAgIFBvcG92ZXJTZWxlY3RDb21wb25lbnQsXG4gICAgUG9wb3ZlckNoaXBEaXJlY3RpdmUsXG4gICAgUG9wb3ZlckNoaXBSZW1vdmVEaXJlY3RpdmUsXG4gICAgUG9wb3ZlclJlbW92ZU9uQ2xpY2tEaXJlY3RpdmUsXG4gICAgUG9wb3Zlck9wdGlvbkRpcmVjdGl2ZSxcbiAgICBUb29sdGlwRGlyZWN0aXZlLFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBQb3BvdmVyTW9kdWxlIHt9XG4iXX0=