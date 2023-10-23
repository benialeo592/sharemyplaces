import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map, take } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Place } from 'src/app/models/place';
import { MapService } from 'src/app/services/map.service';
import { PlaceService } from 'src/app/services/place.service';

@Component({
  selector: 'app-share-place',
  templateUrl: './share-place.component.html',
  styleUrls: ['./share-place.component.css']
})
export class SharePlaceComponent implements OnInit {

  latitude!: number;
  longitude!: number;
  placeInfo!: { city: string, country: string}
  imgUrl: string = '';
  date: string = new Date().toLocaleDateString();
  placeObject: Place = {
    id: '',
    country: '',
    city: '',
    title: '',
    description: '',
    latitude: 0,
    longitude: 0,
    imgUrl: '',
    userId: '',
    stored_at: ''
  };

  errorMessage!: string;
  showForm: boolean = false;


  constructor(private mapService: MapService, private placeService: PlaceService) {

  }

  ngOnInit(): void {
    this.getLocation();
  }


  public newPlace(form : NgForm){

    if (form.value.title === null || form.value.title === '' || form.value.description === null || form.value.description === '' || this.placeInfo.country === '' || this.placeInfo.city === '' || this.latitude === 0 || this.longitude === 0 || form.value.imgUrl === null || form.value.imgUrl === ''){
      this.errorMessage = 'No one value mismatch is permitted';
      return;
    }

    this.placeObject.title = form.value.title;
    this.placeObject.description = form.value.description;
    this.placeObject.country = this.placeInfo.country;
    this.placeObject.city = this.placeInfo.city;
    this.placeObject.latitude = this.latitude;
    this.placeObject.longitude = this.longitude;
    this.placeObject.imgUrl = form.value.imgUrl;
    this.placeObject.stored_at = this.date;
    //user id
    this.placeService.storePlace(this.placeObject);
    this.errorMessage = ''
    form.reset();

  }

  private getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.getOpenSteetMapResult(this.latitude, this.longitude)
          this.showForm = true;
        },
        (error) => {
          this.showForm = false;
          this.errorMessage = `Error: ${error.message}`;
        }
      );
    } else {
      this.showForm = false;
      this.errorMessage = 'Geolocation is not supported by your browser.';
    }
  }

  private getOpenSteetMapResult(latitude: number, longitude: number){
    this.mapService.retrievePlaceInformation(latitude, longitude).subscribe(
      (success) => {
        this.placeInfo = {city: success.address.city, country: success.address.country}
      },
      (error) => {
        this.showForm = false;
        this.errorMessage = `Error: ${error.message}`;
      }
    );
  }
}
