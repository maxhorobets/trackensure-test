import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartSelectionChangedEvent } from 'angular-google-charts';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DriverScheduleTimingType } from '../enums/driver-schedule.enum';
import { ISchedule } from '../interfaces/schedule.interface';
import { formatDriverSchedulePipe } from '../rx-pipes/format-driver-schedule.rx-pipe';
import * as moment from 'moment';

@Component({
  selector: 'app-driver-schedule',
  templateUrl: './driver-schedule.component.html',
  styleUrls: ['./driver-schedule.component.scss']
})
export class DriverScheduleComponent implements OnInit {

  public driverSchedule: Array<ISchedule> = [
    {
      type: DriverScheduleTimingType.SleeperBerth, 
      latitude: 46.949295, 
      longitude: 32.070318, 
      startTime: moment(new Date(2020, 9, 8, 0, 0, 0)).toDate()
    },
    {
      type: DriverScheduleTimingType.OnDuty, 
      latitude: 46.949295, 
      longitude: 32.070318, 
      startTime: moment(new Date(2020, 9, 8, 6, 0, 0)).toDate()
    },
    {
      type: DriverScheduleTimingType.Driving, 
      latitude: 46.949295, 
      longitude: 32.070318, 
      startTime: moment(new Date(2020, 9, 8, 6, 30, 0)).toDate()
    },
    {
      type: DriverScheduleTimingType.OnDuty, 
      latitude: 46.691253, 
      longitude: 32.544955, 
      startTime: moment(new Date(2020, 9, 8, 8, 30, 0)).toDate()
    },
    {
      type: DriverScheduleTimingType.Driving, 
      latitude: 46.691253, 
      longitude: 32.544955, 
      startTime: moment(new Date(2020, 9, 8, 9, 0, 0)).toDate()
    },
    {
      type: DriverScheduleTimingType.OffDuty, 
      latitude: 47.886392, 
      longitude: 33.269159, 
      startTime: moment(new Date(2020, 9, 8, 14, 0, 0)).toDate()
    },
    {
      type: DriverScheduleTimingType.OnDuty, 
      latitude: 47.886392, 
      longitude: 33.269159, 
      startTime: moment(new Date(2020, 9, 8, 15, 0, 0)).toDate()
    },
    {
      type: DriverScheduleTimingType.Driving, 
      latitude: 47.886392, 
      longitude: 33.269159,
      startTime: moment(new Date(2020, 9, 8, 15, 30, 0)).toDate()
    },
    {
      type: DriverScheduleTimingType.SleeperBerth, 
      latitude: 48.441757, 
      longitude: 34.956170, 
      startTime: moment(new Date(2020, 9, 8, 22, 0, 0)).toDate()
    },
  ]
  public driverScheduleFormatted: Array<ISchedule> = [];
  public type='Timeline';
  public data = [];
  public options = {
    colors: ['#808080', '#ff9300', '#4caf4c', '#ff2f2f'], 
    is3D: true,
    timeline: { groupByRowLabel: true },
    hAxis: {
      minValue: new Date(2020, 9, 8),
      maxValue: new Date(2020, 9, 8)
    }
  };
  public width = 768;
  public height = 250;
  public selectedDriverScheduleItem: ISchedule;
  public isSelected: boolean = false;

  @ViewChild('chartContainer', {static: true}) chartContainer: ElementRef;
  constructor() { }

  ngOnInit(): void {
    this.formatSchedule()  ;  
  }

  formatSchedule() {
    of(this.driverSchedule)
      .pipe(
        formatDriverSchedulePipe(),
        tap(scheduleItems => {
          this.width = this.chartContainer.nativeElement.offsetWidth;

          return scheduleItems.forEach((element: ISchedule, index) => {
            this.data[index] = element.googleMapsArray;
          })
        })
      )
      .subscribe((scheduleItems: Array<ISchedule>) => {
        this.driverScheduleFormatted = scheduleItems;        
      }) 
  }

  onSelect(event: ChartSelectionChangedEvent) {
    const rowIndex = event.selection[0].row;

    this.selectedDriverScheduleItem = this.driverScheduleFormatted[rowIndex];
    this.isSelected = true;
  }

  onUpdateItem(schedule: ISchedule) {
    const changedIndex = this.driverSchedule.findIndex(
      ({ longitude, latitude, type }) => 
        longitude === schedule.longitude && 
        latitude === schedule.latitude && 
        type === schedule.type
    )

    if(changedIndex !== -1) {
      this.driverSchedule[changedIndex] = schedule;

      this.formatSchedule();
      this.data = Object.assign([], this.data);
      this.selectedDriverScheduleItem = null;
      this.isSelected = false;
    }
  }
}