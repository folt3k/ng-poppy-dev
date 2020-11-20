import { Component, HostBinding, Inject, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { LAYER_CONFIG } from './layer.token';
export class LayerComponent {
    constructor(config) {
        this.config = config;
    }
    get overlay() {
        return this.config.overlay;
    }
}
LayerComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'poppy-layer',
                template: "<ng-container #container></ng-container>\n",
                encapsulation: ViewEncapsulation.None,
                styles: ["poppy-layer{bottom:0;display:block;left:0;position:fixed;right:0;top:0;visibility:hidden;z-index:10000}.poppy-layer--overlay{background:rgba(0,0,0,.42);overflow-y:auto;visibility:visible}"]
            },] }
];
LayerComponent.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [LAYER_CONFIG,] }] }
];
LayerComponent.propDecorators = {
    container: [{ type: ViewChild, args: ['container', { read: ViewContainerRef },] }],
    overlay: [{ type: HostBinding, args: ['class.poppy-layer--overlay',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii9ob21lL2ZvbHRpL1Byb2plY3RzL25nLXBvcHB5L3Byb2plY3RzL25nLXBvcHB5L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9sYXllci9sYXllci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxXQUFXLEVBQ1gsTUFBTSxFQUNOLFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxZQUFZLEVBQWUsTUFBTSxlQUFlLENBQUM7QUFTMUQsTUFBTSxPQUFPLGNBQWM7SUFHekIsWUFBMEMsTUFBbUI7UUFBbkIsV0FBTSxHQUFOLE1BQU0sQ0FBYTtJQUFHLENBQUM7SUFFakUsSUFBK0MsT0FBTztRQUNwRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQzdCLENBQUM7OztZQWRGLFNBQVMsU0FBQztnQkFDVCw4Q0FBOEM7Z0JBQzlDLFFBQVEsRUFBRSxhQUFhO2dCQUN2QixzREFBcUM7Z0JBRXJDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzthQUN0Qzs7OzRDQUljLE1BQU0sU0FBQyxZQUFZOzs7d0JBRi9CLFNBQVMsU0FBQyxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUM7c0JBSWhELFdBQVcsU0FBQyw0QkFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEhvc3RCaW5kaW5nLFxuICBJbmplY3QsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IExBWUVSX0NPTkZJRywgTGF5ZXJDb25maWcgfSBmcm9tICcuL2xheWVyLnRva2VuJztcblxuQENvbXBvbmVudCh7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjb21wb25lbnQtc2VsZWN0b3JcbiAgc2VsZWN0b3I6ICdwb3BweS1sYXllcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9sYXllci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2xheWVyLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIExheWVyQ29tcG9uZW50IHtcbiAgQFZpZXdDaGlsZCgnY29udGFpbmVyJywgeyByZWFkOiBWaWV3Q29udGFpbmVyUmVmfSkgY29udGFpbmVyOiBWaWV3Q29udGFpbmVyUmVmO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoTEFZRVJfQ09ORklHKSBwcml2YXRlIGNvbmZpZzogTGF5ZXJDb25maWcpIHt9XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5wb3BweS1sYXllci0tb3ZlcmxheScpIGdldCBvdmVybGF5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNvbmZpZy5vdmVybGF5O1xuICB9XG59XG4iXX0=