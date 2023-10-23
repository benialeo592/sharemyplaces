import { Component, OnInit } from '@angular/core';
import { Place } from 'src/app/models/place';
import { MapService } from 'src/app/services/map.service';
import { PlaceService } from 'src/app/services/place.service';

@Component({
  selector: 'app-listing-place',
  templateUrl: './listing-place.component.html',
  styleUrls: ['./listing-place.component.css']
})
export class ListingPlaceComponent implements OnInit {

  places : Array<Place> = [];
  latitude!: number;
  longitude!: number;
  userCoordinates!: {city: string, country: string};
  closestToUser:boolean = false;

  constructor(private placeService : PlaceService, private mapService : MapService){}

  ngOnInit(): void {
    this.getLocation();
    this.retrievePlaces();

  }

  private retrievePlaces(){
    this.placeService.getAllPlace().subscribe(
      (res) => {
        this.places = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        });
        if(this.closestToUser){
          this.places = this.places.filter(place => place.city === this.userCoordinates.city && place.country === this.userCoordinates.country);

        }
      },
      (error) => {
        console.error(error);
      }
    );

  }


  private getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.closestToUser = true;
        },
        (error) => {
          this.closestToUser = false;
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      this.closestToUser = false;
    }

  }




}
