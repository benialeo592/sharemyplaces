import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private apiUrl: string = ' https://nominatim.openstreetmap.org/reverse?lat={LATITUDE}&lon={LONGITUDE}&format=jsonv2&accept-language=en';

  constructor(private http: HttpClient) { }

  public retrievePlaceInformation(latitude:number, longitude:number) : Observable<any>{
    this.apiUrl = this.apiUrl.replace('{LATITUDE}', latitude.toString()).replace('{LONGITUDE}', longitude.toString());
    return this.http.get(this.apiUrl);
  }


}
