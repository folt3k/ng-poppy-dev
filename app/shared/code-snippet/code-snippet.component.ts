import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as hljs from 'highlight.js';

import { FileContentService } from '../../core/file-content.service';

@Component({
  selector: 'code-snippet',
  templateUrl: './code-snippet.component.html',
  styleUrls: ['./code-snippet.component.scss'],
})
export class CodeSnippetComponent implements AfterViewInit {
  @ViewChild('pre') preElement: ElementRef<HTMLElement>;

  @Input() fromFile: string;

  snippet: string;
  show: boolean = false;

  constructor(private fileContentService: FileContentService) {}

  ngAfterViewInit(): void {
    if (this.fromFile) {
      this.setSnippetFromFile();
    }
  }

  setSnippetFromFile(): void {
    this.fileContentService.getFileContent(this.fromFile).subscribe((snippet) => {
      this.snippet = snippet;
      setTimeout(() => {
        hljs.highlightBlock(this.preElement.nativeElement);
        this.show = true;
      });
    });
  }
}
