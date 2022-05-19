import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  // raw_data = {}

  constructor(private http: HttpClient, private auth_svc: AuthService) { }

  get_data_meteo(spot_name : string) {
    let url = `http://127.0.0.1:8000/meteo/fulldata/${spot_name}`
    const header = {
      'Authorization': `${this.auth_svc.user.token}`,
    }
    return this.http.get(url, {headers:header});
  }

  // call_api_data_meteo() {
  //   let url = 'http://127.0.0.1:8000/meteo/fulldata'
  //   this.http.get(url).subscribe(res => {
  //     return res
  //   })
  // }

}
