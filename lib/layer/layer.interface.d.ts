import { ComponentRef } from '@angular/core';
import { LayerComponent } from './layer.component';
import { LayerAppendOptions } from './layer.model';
export interface ActiveLayer<T> {
    ref: ComponentRef<LayerComponent>;
    appendComponentRef: ComponentRef<T>;
    options: LayerAppendOptions;
}
export interface ILayerAppendOptions {
    delayClose?: number;
    overlay?: boolean;
}
