import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CodeSnippetComponent } from './code-snippet/code-snippet.component';
import { DemoWidgetComponent } from './demo-widget/demo-widget.component';

@NgModule({
  declarations: [CodeSnippetComponent, DemoWidgetComponent],
  imports: [CommonModule],
  exports: [CodeSnippetComponent, DemoWidgetComponent],
})
export class SharedModule {}
