import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuth: boolean = false;
  admin: boolean = false;
  user : User = null;

  constructor(private http: HttpClient, private router: Router) {
    this.initUser()
  }

  initUser() {
    const user = JSON.parse(localStorage.getItem('user')) 
    if (user) {
      this.isAuth = true;
      this.user = new User(user.username,user.token, user.spot)
    }

  }

  get isLogged() : boolean {
    return this.user !== null;
  }

  login(user: any) {
    const url = 'http://localhost:8000/user/login'

    const body = {
      username: user.username,
      password: user.password,
    }

    this.http.post(url, body).subscribe((res : any) => {
        if (res.data.token != null) {
          this.isAuth = true;
          localStorage.setItem("user", JSON.stringify({
            "username" : res.data.username,
            "token" : res.data.token,
            "isLogged" : true,
            "spot" : res.data.spot
          }));

          this.user = new User(res.data.username,res.data.token, res.data.spot)
          this.router.navigate(['home']);
        } else {
          console.log("Error auth 1");
        }
      },
      erreur => {
        console.log("Error auth 2", erreur);
      }
    )
  }

  register(user: any) {
    const url = 'http://localhost:8000/user/register'

    const body = {
      username: user.username,
      password: user.password,
      spot: user.spot
    }

    this.http.post(url, body).subscribe(res => {
      this.router.navigate(['signin']);
    })
  }

  logOff(){
    localStorage.removeItem("user");
    localStorage.removeItem("data_meteo")
    localStorage.removeItem("data_news")
    this.user = null;
    this.isAuth = false;
  }
}
