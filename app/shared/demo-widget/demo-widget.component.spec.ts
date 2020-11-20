import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoWidgetComponent } from './demo-widget.component';

describe('DemoWidgetComponent', () => {
  let component: DemoWidgetComponent;
  let fixture: ComponentFixture<DemoWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
