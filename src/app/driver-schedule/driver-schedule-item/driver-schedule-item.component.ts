import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ISchedule } from 'src/app/interfaces/schedule.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-driver-schedule-item',
  templateUrl: './driver-schedule-item.component.html',
  styleUrls: ['./driver-schedule-item.component.scss']
})
export class DriverScheduleItemComponent implements OnInit {

  @Input() scheduleItem: ISchedule;
  @Output() update = new EventEmitter();
  
  @ViewChild('googleMap') public gmapElement: any;

  public changeTimeForm: FormGroup;

  private map: google.maps.Map;
  private mapOptions: google.maps.MapOptions;
  private marker: google.maps.Marker;
  private coordinates: google.maps.LatLng;
  private markerArray: google.maps.Marker[] = [];
  private directionsService: google.maps.DirectionsService;
  private directionsRenderer: google.maps.DirectionsRenderer;
  private stepDisplay: google.maps.InfoWindow;
  constructor(

  ) {
    const startTimeInput = new FormControl(),
    endTimeInput = new FormControl();

    this.changeTimeForm = new FormGroup({ startTimeInput, endTimeInput });

    startTimeInput.valueChanges
      .subscribe((value) => {
        this.scheduleItem.startTimeFormatted = moment(value).format('LT');
        this.scheduleItem.startTimeISO = moment(value).format("YYYY-MM-DD") + 'T' + moment(value).format("HH:mm");
        this.scheduleItem.startTime = moment(value).toDate();
      })

    endTimeInput.valueChanges
      .subscribe((value) => {
        this.scheduleItem.endTimeFormatted = moment(value).format('LT');
        this.scheduleItem.endTimeISO = moment(value).format("YYYY-MM-DD") + 'T' + moment(value).format("HH:mm");
        this.scheduleItem.endTime = moment(value).toDate();
      })
  }

  ngOnInit(): void {
    const url = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAHvRN5Xy3jBcpF6tkgCCaEhuz3yp98Icg'; 
    this.loadScript(url)
      .then(() => { 
        this.updateFormContorls();
        this.updateCoordinates();
        this.mapInitializer();
        if(this.scheduleItem.type === 'D') {
          this.initDirectionService();
        }
      })
      .catch((err) => console.log(err))    
  }

  ngAfterViewInit() {  
  
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.scheduleItem.previousValue) {
      this.updateCoordinates();

      if(this.directionsRenderer) this.directionsRenderer.setMap(null);
      this.map.setCenter(this.coordinates);
      this.marker.setPosition(this.coordinates);
      this.marker.setMap(this.map); 

      if(this.scheduleItem.type === 'D') {        
        this.initDirectionService();
      }
    }
  }

  private loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.text = ``;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    })
  }

  updateCoordinates() {
    if(this.marker) this.marker.setMap(null);

    this.coordinates = new google.maps.LatLng(this.scheduleItem.latitude, this.scheduleItem.longitude);

    this.mapOptions = {
      center: this.coordinates,
      zoom: 10,
    };

    this.marker = new google.maps.Marker({
      position: this.coordinates,
      map: this.map,
    });
  }

  mapInitializer() {
    this.map = new google.maps.Map(this.gmapElement.nativeElement, this.mapOptions);

    this.marker.setMap(this.map);
  }

  initDirectionService() {
    this.directionsService = new google.maps.DirectionsService();

    if(this.directionsRenderer) this.directionsRenderer.setMap(null);

    this.directionsRenderer = new google.maps.DirectionsRenderer({ map: this.map });

    this.stepDisplay = new google.maps.InfoWindow();

    this.calculateAndDisplayRoute(
      this.directionsRenderer,
      this.directionsService,
      this.markerArray,
      this.stepDisplay,
      this.map
    );
  }

  calculateAndDisplayRoute(
    directionsRenderer: google.maps.DirectionsRenderer,
    directionsService: google.maps.DirectionsService,
    markerArray: google.maps.Marker[],
    stepDisplay: google.maps.InfoWindow,
    map: google.maps.Map
  ) {
    for (let i = 0; i < markerArray.length; i++) {
      markerArray[i].setMap(null);
    }
    directionsService.route(
      {
        origin: new google.maps.LatLng(this.scheduleItem.latitude, this.scheduleItem.longitude),
        destination: new google.maps.LatLng(this.scheduleItem.endLatitude, this.scheduleItem.endLongitude),
        travelMode: google.maps.TravelMode.WALKING,
      },
      (
        result: google.maps.DirectionsResult,
        status: google.maps.DirectionsStatus
      ) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  }

  showSteps(
    directionResult: google.maps.DirectionsResult,
    markerArray: google.maps.Marker[],
    stepDisplay: google.maps.InfoWindow,
    map: google.maps.Map
  ) {
    const myRoute = directionResult.routes[0].legs[0];
  
    for (let i = 0; i < myRoute.steps.length; i++) {
      const marker = (markerArray[i] =
        markerArray[i] || new google.maps.Marker());
      marker.setMap(map);
      marker.setPosition(myRoute.steps[i].start_location);
      this.attachInstructionText(
        stepDisplay,
        marker,
        myRoute.steps[i].instructions,
        map
      );
    }
  }

  attachInstructionText(
    stepDisplay: google.maps.InfoWindow,
    marker: google.maps.Marker,
    text: string,
    map: google.maps.Map
  ) {
    google.maps.event.addListener(marker, "click", () => {
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    });
  }

  updateFormContorls() {
    this.changeTimeForm.controls.startTimeInput.setValue(this.scheduleItem.startTimeISO);
    this.changeTimeForm.controls.endTimeInput.setValue(this.scheduleItem.endTimeISO);
  }

  saveTimeChanges() {
    this.update.emit(this.scheduleItem)
  }
}