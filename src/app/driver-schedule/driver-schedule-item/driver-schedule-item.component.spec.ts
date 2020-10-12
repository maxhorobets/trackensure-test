import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverScheduleItemComponent } from './driver-schedule-item.component';

describe('DriverScheduleItemComponent', () => {
  let component: DriverScheduleItemComponent;
  let fixture: ComponentFixture<DriverScheduleItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverScheduleItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverScheduleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
