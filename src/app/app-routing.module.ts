import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriverScheduleComponent } from './driver-schedule/driver-schedule.component';
import { DriverScheduleModule } from './driver-schedule/driver-schedule.module';


const routes: Routes = [
  {
    path: '',
    // loadChildren: () => import('./driver-schedule/driver-schedule.module').then(m => m.DriverScheduleModule)
    component: DriverScheduleComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
