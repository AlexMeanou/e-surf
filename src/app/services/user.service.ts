import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  filedata:any;

  constructor(private http: HttpClient) { }

  /* File onchange event */
  fileEvent(e:any){
    this.filedata = e.target.files[0];
  }

  save_img_bdd(formData: any) {
    console.log(formData)
    this.http.post('http://127.0.0.1:8000/users/images', formData).subscribe(data => {
      //Check success message
      console.log(data);
    });

  }
}
