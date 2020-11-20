import { ViewContainerRef } from '@angular/core';
import { LayerConfig } from './layer.token';
export declare class LayerComponent {
    private config;
    container: ViewContainerRef;
    constructor(config: LayerConfig);
    get overlay(): boolean;
}
