import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FileContentService {
  constructor(private http: HttpClient) {}

  getFileContent(filePath: string): Observable<string> {
    const prefix = 'app';
    return this.http.get(`${prefix}/${filePath}`, { responseType: 'text' }).pipe(tap(console.log));
  }
}
