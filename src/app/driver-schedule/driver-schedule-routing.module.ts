import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverScheduleComponent } from './driver-schedule.component';


const routes: Routes = [
  {
    path: '',
    component: DriverScheduleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverScheduleRoutingModule { }
