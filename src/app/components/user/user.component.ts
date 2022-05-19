import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  sanitizer : DomSanitizer 
  userForm : FormGroup;
  file : any; 
  images: any;
  imageSrc: string = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png";

  error : any = {isError : false}
  
  constructor(private http:HttpClient, public user_svc: UserService, private auth_svc: AuthService) {
  }

  ngOnInit(): void {
    this.get_images()
  }

  onFileChanged(event: any) {
    this.file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.imageSrc = reader.result as string;
    };
  }
  
  onUpload() {
    const formData = new FormData();
    console.log(this.file)
    formData.append("file", this.file);
    let username = this.auth_svc.user.username
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    this.http.post('http://127.0.0.1:8000/users/images', formData, {
      headers : headers
    }).subscribe((data:any) => {
      //Check success message
      console.log(data);
      const body = {
        pathfile : data.pathfile,
        user: username,
      }
      this.http.post('http://127.0.0.1:8000/users/update', body).subscribe((data:any) => {
        if (data.error) {
          this.error.isError = true
          this.error.message = data.error.message
        } else {
          this.get_images()
        }
      })
    });
    // this.user_svc.save_img_bdd(formData)
  }

  get_images() {
    let url = 'http://127.0.0.1:8000/user/'+ this.auth_svc.user.username +'/images'
    const header = {
      'Authorization': `${this.auth_svc.user.token}`,
    }
    this.http.get(url, {headers:header}).subscribe(res => {
      console.log(res);
      this.images = res
    })
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
