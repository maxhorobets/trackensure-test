import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverScheduleRoutingModule } from './driver-schedule-routing.module';
import { DriverScheduleComponent } from './driver-schedule.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { DriverScheduleItemComponent } from './driver-schedule-item/driver-schedule-item.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [DriverScheduleComponent, DriverScheduleItemComponent],
  imports: [
    CommonModule,
    DriverScheduleRoutingModule,
    GoogleChartsModule,
    ReactiveFormsModule
  ]
})
export class DriverScheduleModule { }
