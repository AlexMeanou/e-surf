import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  sanitizer : DomSanitizer 

  file : any; 

  
  constructor(private http:HttpClient, public user_svc: UserService) {
  }

  ngOnInit(): void {
  }

  onFileChanged(event: any) {
    this.file = event.target.files[0];
  }
  
  onUpload() {
    const formData = new FormData();
    console.log(this.file)
    formData.append("file", this.file);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    this.http.post('http://127.0.0.1:8000/users/images', formData, {
      headers : headers
    }).subscribe((data:any) => {
      //Check success message
      console.log(data);
      const body = {
        pathfile : data.pathfile,
      }
      this.http.post('http://127.0.0.1:8000/users/update', body).subscribe((data:any) => {
        console.log(data)
      })
    });
    // this.user_svc.save_img_bdd(formData)
  }

  
  /* Upload button functioanlity */
  onSubmitform(f: NgForm) {
    this.onUpload()
    // this.user_svc.save_img_bdd(this.user_svc.filedata)
  }


  sanitize (url:string ) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  } 

}
