import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  changeButton: boolean;

  route : string;

  constructor(
    private authService : AuthService,
    private router : Router
  ) {
  }
  
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log(event);
        this.route = event['url'];          
        if (this.route == "/user") {
          this.changeButton = false;
        } else {
          this.changeButton = true
        }
      }
    });
  }

  isLogged() : boolean {
    return this.authService.isLogged
  }

  logOff() {
    this.authService.logOff();
    this.router.navigate(['signin']);
  }

  onUser(){
    this.changeButton = true;
    this.router.navigate(['user']);
  }

  onHome() {
    this.changeButton = false;
    this.router.navigate(['home'])
  }

}
