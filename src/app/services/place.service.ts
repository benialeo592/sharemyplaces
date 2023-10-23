
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Place } from '../models/place';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  constructor(private afs : AngularFirestore) {

   }

   storePlace(place : Place){
    place.id = this.afs.createId();
    return this.afs.collection('/places').add(place);
   }

   getAllPlace(){
    return this.afs.collection('/places').snapshotChanges();
   }
}
