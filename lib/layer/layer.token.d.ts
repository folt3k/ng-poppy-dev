import { InjectionToken } from '@angular/core';
export declare const LAYER_CONFIG: InjectionToken<LayerConfig>;
export interface LayerConfig {
    overlay?: boolean;
}
