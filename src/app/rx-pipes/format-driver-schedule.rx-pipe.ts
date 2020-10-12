import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { DriverScheduleTimingType } from '../enums/driver-schedule.enum';
import { ISchedule } from '../interfaces/schedule.interface';
import * as moment from 'moment';

export const formatDriverSchedulePipe = () =>
  pipe(
    map((data: Array<ISchedule>) =>
      formatDriverSchedulePipeFromArray(data)
    ),
  );

const formatDriverSchedulePipeFromArray = (array: Array<ISchedule>) => {
  if (array.length === 0) return array;

  return array.map((element, index) => 
    formatDriverSchedulePipeFromObject(
      element,
      array[index+1] ? array[index + 1] : { startTime: new Date(2020, 9, 8, 24, 0, 0) }
      // array[index+1] ? array[index + 1] : { startTime: new Date() })   
    ));
};

const formatDriverSchedulePipeFromObject = (schedule: ISchedule, nextSchedule: ISchedule | any) => {
  let scheduleType,
      endTime = nextSchedule.startTime,
      endLatitude = nextSchedule.latitude,
      endLongitude = nextSchedule.longitude,
      googleMapsArray = [],
      startTimeFormatted,
      endTimeFormatted,
      startTimeISO,
      endTimeISO;

  googleMapsArray.push(schedule.type, schedule.startTime, nextSchedule.startTime);

  startTimeFormatted = moment(schedule.startTime).format('LT');
  endTimeFormatted = moment(endTime).format('LT');
  startTimeISO = moment(schedule.startTime).format("YYYY-MM-DD") + 'T' + moment(schedule.startTime).format("HH:mm");
  endTimeISO = moment(endTime).format("YYYY-MM-DD") + 'T' + moment(endTime).format("HH:mm");

  switch (schedule.type) {
    case DriverScheduleTimingType.SleeperBerth:
      scheduleType = 'Sleeper Berth'
      break;
    case DriverScheduleTimingType.OffDuty:
      scheduleType = 'Off Duty'
      break;
    case DriverScheduleTimingType.OnDuty:
      scheduleType = 'On Duty'
      break;
    case DriverScheduleTimingType.Driving:
      scheduleType = 'Driving'
      break;
    default:
      scheduleType = undefined
      break;
  }

  return Object.assign(schedule, { typeFormatted: scheduleType, endTime, googleMapsArray, endLatitude, endLongitude, startTimeFormatted, endTimeFormatted, startTimeISO, endTimeISO });
};