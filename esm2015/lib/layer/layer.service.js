import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector, } from '@angular/core';
import { LayerComponent } from './layer.component';
import { LAYER_CONFIG } from './layer.token';
import * as i0 from "@angular/core";
export class LayerService {
    constructor(componentFactoryResolver, appRef) {
        this.componentFactoryResolver = componentFactoryResolver;
        this.appRef = appRef;
        this.activeLayers = [];
    }
    appendToBody(component, options, injector) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(LayerComponent);
        const componentRef = componentFactory.create(Injector.create([
            {
                provide: LAYER_CONFIG,
                useValue: options,
            },
        ]));
        componentRef.changeDetectorRef.detectChanges();
        const appendComponentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        const appendComponentRef = componentRef.instance.container.createComponent(appendComponentFactory, null, injector);
        this.activeLayers.push({
            ref: componentRef,
            appendComponentRef,
            options,
        });
        this.appRef.attachView(componentRef.hostView);
        const domElem = componentRef.hostView.rootNodes[0];
        document.body.appendChild(domElem);
        return appendComponentRef;
    }
    removeFromBody(componentRef) {
        const layers = this.activeLayers.filter((layer) => layer.appendComponentRef === componentRef);
        layers.forEach((layer) => {
            const delayClose = layer.options.delayClose;
            if (delayClose !== null) {
                setTimeout(() => {
                    this.removeLayer(layer);
                }, delayClose);
            }
            else {
                this.removeLayer(layer);
            }
        });
        this.activeLayers = this.activeLayers.filter((layer) => layer.appendComponentRef !== componentRef);
    }
    removeLayer(layer) {
        this.appRef.detachView(layer.ref.hostView);
        layer.ref.changeDetectorRef.detectChanges();
        layer.ref.destroy();
    }
}
LayerService.ɵprov = i0.ɵɵdefineInjectable({ factory: function LayerService_Factory() { return new LayerService(i0.ɵɵinject(i0.ComponentFactoryResolver), i0.ɵɵinject(i0.ApplicationRef)); }, token: LayerService, providedIn: "root" });
LayerService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
LayerService.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: ApplicationRef }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIvaG9tZS9mb2x0aS9Qcm9qZWN0cy9uZy1wb3BweS9wcm9qZWN0cy9uZy1wb3BweS9zcmMvIiwic291cmNlcyI6WyJsaWIvbGF5ZXIvbGF5ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsY0FBYyxFQUNkLHdCQUF3QixFQUd4QixVQUFVLEVBQ1YsUUFBUSxHQUVULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUduRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUs3QyxNQUFNLE9BQU8sWUFBWTtJQUd2QixZQUNtQix3QkFBa0QsRUFDbEQsTUFBc0I7UUFEdEIsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUEwQjtRQUNsRCxXQUFNLEdBQU4sTUFBTSxDQUFnQjtRQUpqQyxpQkFBWSxHQUF1QixFQUFFLENBQUM7SUFLM0MsQ0FBQztJQUVKLFlBQVksQ0FBSSxTQUFrQixFQUFFLE9BQTJCLEVBQUUsUUFBUztRQUN4RSxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMvRixNQUFNLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQzFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDZDtnQkFDRSxPQUFPLEVBQUUsWUFBWTtnQkFDckIsUUFBUSxFQUFFLE9BQU87YUFDbEI7U0FDRixDQUFDLENBQ0gsQ0FBQztRQUVGLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUUvQyxNQUFNLHNCQUFzQixHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNoRyxNQUFNLGtCQUFrQixHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FDeEUsc0JBQXNCLEVBQ3RCLElBQUksRUFDSixRQUFRLENBQ1QsQ0FBQztRQUVGLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO1lBQ3JCLEdBQUcsRUFBRSxZQUFZO1lBQ2pCLGtCQUFrQjtZQUNsQixPQUFPO1NBQ1IsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sT0FBTyxHQUFJLFlBQVksQ0FBQyxRQUFxQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQWdCLENBQUM7UUFDaEcsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFbkMsT0FBTyxrQkFBa0IsQ0FBQztJQUM1QixDQUFDO0lBRUQsY0FBYyxDQUFJLFlBQTZCO1FBQzdDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEtBQUssWUFBWSxDQUFDLENBQUM7UUFFOUYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ3ZCLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1lBQzVDLElBQUksVUFBVSxLQUFLLElBQUksRUFBRTtnQkFDdkIsVUFBVSxDQUFDLEdBQUcsRUFBRTtvQkFDZCxJQUFJLENBQUMsV0FBVyxDQUFJLEtBQUssQ0FBQyxDQUFDO2dCQUM3QixDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7YUFDaEI7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLFdBQVcsQ0FBSSxLQUFLLENBQUMsQ0FBQzthQUM1QjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLGtCQUFrQixLQUFLLFlBQVksQ0FBQyxDQUFDO0lBQ3JHLENBQUM7SUFFTyxXQUFXLENBQUksS0FBcUI7UUFDMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQyxLQUFLLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzVDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDdEIsQ0FBQzs7OztZQWpFRixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7OztZQWRDLHdCQUF3QjtZQUR4QixjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQXBwbGljYXRpb25SZWYsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgQ29tcG9uZW50UmVmLFxuICBFbWJlZGRlZFZpZXdSZWYsXG4gIEluamVjdGFibGUsXG4gIEluamVjdG9yLFxuICBUeXBlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IExheWVyQ29tcG9uZW50IH0gZnJvbSAnLi9sYXllci5jb21wb25lbnQnO1xuaW1wb3J0IHsgQWN0aXZlTGF5ZXIgfSBmcm9tICcuL2xheWVyLmludGVyZmFjZSc7XG5pbXBvcnQgeyBMYXllckFwcGVuZE9wdGlvbnMgfSBmcm9tICcuL2xheWVyLm1vZGVsJztcbmltcG9ydCB7IExBWUVSX0NPTkZJRyB9IGZyb20gJy4vbGF5ZXIudG9rZW4nO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgTGF5ZXJTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBhY3RpdmVMYXllcnM6IEFjdGl2ZUxheWVyPGFueT5bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcHJpdmF0ZSByZWFkb25seSBhcHBSZWY6IEFwcGxpY2F0aW9uUmVmXG4gICkge31cblxuICBhcHBlbmRUb0JvZHk8VD4oY29tcG9uZW50OiBUeXBlPFQ+LCBvcHRpb25zOiBMYXllckFwcGVuZE9wdGlvbnMsIGluamVjdG9yPyk6IENvbXBvbmVudFJlZjxUPiB7XG4gICAgY29uc3QgY29tcG9uZW50RmFjdG9yeSA9IHRoaXMuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KExheWVyQ29tcG9uZW50KTtcbiAgICBjb25zdCBjb21wb25lbnRSZWYgPSBjb21wb25lbnRGYWN0b3J5LmNyZWF0ZShcbiAgICAgIEluamVjdG9yLmNyZWF0ZShbXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBMQVlFUl9DT05GSUcsXG4gICAgICAgICAgdXNlVmFsdWU6IG9wdGlvbnMsXG4gICAgICAgIH0sXG4gICAgICBdKVxuICAgICk7XG5cbiAgICBjb21wb25lbnRSZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gICAgY29uc3QgYXBwZW5kQ29tcG9uZW50RmFjdG9yeSA9IHRoaXMuY29tcG9uZW50RmFjdG9yeVJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KGNvbXBvbmVudCk7XG4gICAgY29uc3QgYXBwZW5kQ29tcG9uZW50UmVmID0gY29tcG9uZW50UmVmLmluc3RhbmNlLmNvbnRhaW5lci5jcmVhdGVDb21wb25lbnQoXG4gICAgICBhcHBlbmRDb21wb25lbnRGYWN0b3J5LFxuICAgICAgbnVsbCxcbiAgICAgIGluamVjdG9yXG4gICAgKTtcblxuICAgIHRoaXMuYWN0aXZlTGF5ZXJzLnB1c2goe1xuICAgICAgcmVmOiBjb21wb25lbnRSZWYsXG4gICAgICBhcHBlbmRDb21wb25lbnRSZWYsXG4gICAgICBvcHRpb25zLFxuICAgIH0pO1xuXG4gICAgdGhpcy5hcHBSZWYuYXR0YWNoVmlldyhjb21wb25lbnRSZWYuaG9zdFZpZXcpO1xuICAgIGNvbnN0IGRvbUVsZW0gPSAoY29tcG9uZW50UmVmLmhvc3RWaWV3IGFzIEVtYmVkZGVkVmlld1JlZjx1bmtub3duPikucm9vdE5vZGVzWzBdIGFzIEhUTUxFbGVtZW50O1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZG9tRWxlbSk7XG5cbiAgICByZXR1cm4gYXBwZW5kQ29tcG9uZW50UmVmO1xuICB9XG5cbiAgcmVtb3ZlRnJvbUJvZHk8VD4oY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWY8VD4pOiB2b2lkIHtcbiAgICBjb25zdCBsYXllcnMgPSB0aGlzLmFjdGl2ZUxheWVycy5maWx0ZXIoKGxheWVyKSA9PiBsYXllci5hcHBlbmRDb21wb25lbnRSZWYgPT09IGNvbXBvbmVudFJlZik7XG5cbiAgICBsYXllcnMuZm9yRWFjaCgobGF5ZXIpID0+IHtcbiAgICAgIGNvbnN0IGRlbGF5Q2xvc2UgPSBsYXllci5vcHRpb25zLmRlbGF5Q2xvc2U7XG4gICAgICBpZiAoZGVsYXlDbG9zZSAhPT0gbnVsbCkge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUxheWVyPFQ+KGxheWVyKTtcbiAgICAgICAgfSwgZGVsYXlDbG9zZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbW92ZUxheWVyPFQ+KGxheWVyKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuYWN0aXZlTGF5ZXJzID0gdGhpcy5hY3RpdmVMYXllcnMuZmlsdGVyKChsYXllcikgPT4gbGF5ZXIuYXBwZW5kQ29tcG9uZW50UmVmICE9PSBjb21wb25lbnRSZWYpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVMYXllcjxUPihsYXllcjogQWN0aXZlTGF5ZXI8VD4pOiB2b2lkIHtcbiAgICB0aGlzLmFwcFJlZi5kZXRhY2hWaWV3KGxheWVyLnJlZi5ob3N0Vmlldyk7XG4gICAgbGF5ZXIucmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICBsYXllci5yZWYuZGVzdHJveSgpO1xuICB9XG59XG4iXX0=