export interface ISchedule {
  type: string, 
  latitude: number, 
  longitude: number, 
  startTime: Date,
  endTime?: Date,
  endLatitude?: number, 
  endLongitude?: number, 
  typeFormatted?: string,
  startTimeFormatted?: string,
  endTimeFormatted?: string,
  startTimeISO?: string,
  endTimeISO?: string,
  googleMapsArray?: [] 
}