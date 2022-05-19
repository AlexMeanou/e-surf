import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  current_spot :string;
  hours : number[];
  hoursForm: FormGroup;
  spotForm: FormGroup;
  hour: string;
  saved: boolean = false;
  hour_display: any;
  raw_data: any = null;
  raw_news: any = null;
  current_index: number;

  data_hours = []
  data_winds_forecast = []
  data_winds_directions = []
  data_winds_speed = []
  data_winds_gust = []
  data_waves_forecast = []
  data_temperatures = []
  data_houle_moy = []
  data_pressures = []
  data_waves_min = []
  data_waves_max = []

  current_hour : string
  current_winds_directions : string
  current_winds_speed : string
  current_winds_gust : string
  current_temperatures : string
  current_houle_moy : string
  current_pressures : any
  news_img: any;
  news_titles: any;
  news_url: any;
  news: any;
  hour_zizi: number;
  current_color_temp: string
  current_color_wave: string
  current_color_wind: string
  current_waves_min: string;
  current_waves_max: string;
  spots: any[];
  spot: string;
  // current_winds_forecast = []
  // current_waves_forecast = []

  constructor(private home_svc: HomeService, public auth_svc: AuthService, private http: HttpClient, private formBuilder: FormBuilder) { 
    this.hoursForm = this.formBuilder.group({
      hour: ['1', Validators.required],
    });
    console.log(this.auth_svc.user);
    this.spotForm = this.formBuilder.group({
      spotfc: ['Choisir un spot', Validators.required],
    });
    this.spot = this.auth_svc.user.spot
    this.hour_zizi = 1;
    this.hours = [1,2,3,4,5,6,7,8];
  }
  
  ngOnInit(): void {
    if (this.isLogged()) {
      this.get_spots()
      if (this.isDataPresent()) {
        this.get_news_storage()
        this.get_meteo_data_via_storage()
      } else {
        this.call_api_data_meteo()
        this.get_news()
      }
    }
  }

  isLogged(): boolean {
    return this.auth_svc.isLogged;
  }

  isDataPresent(): boolean {
    return localStorage.getItem("data_meteo") != null
  }

  getCurrentSpot(username: string) {
    const url = 'http://localhost:8000/user/'+ username +'/spot'
    return this.http.get(url).subscribe((res : string) => {
      this.current_spot = res;
    })
  }

  updateCurrentSpot() {
    let url = 'http://localhost:8000/user/spot/update'

    const header = {
      'Authorization': `${this.auth_svc.user.token}`,
    }
    console.log(header);
    const body = {
      username: this.auth_svc.user.username,
      spot: this.spot
    }

    this.http.post(url, body, {headers:header}).subscribe(res => {
      console.log(res);
      this.auth_svc.user.spot = this.spot
      localStorage.setItem("user", JSON.stringify({
        "username" : this.auth_svc.user.username,
        "token" : this.auth_svc.user.token,
        "isLogged" : true,
        "spot" : this.auth_svc.user.spot
      }));
    })

    this.call_api_data_meteo()
  }

  refresh_new_hour() {
    this.saved = true;
    this.hour_display = this.hoursForm.value['hour'];
    let tmp : number = this.get_current_hour() + this.hour_display;
    let res = tmp + 'h'
    this.current_index = this.get_current_index(res); 
    this.get_current_data_by_index()
  }

  // async get_data_meteo() {
  //   this.raw_data = await this.home_svc.call_api_data_meteo()
  //   console.log(this.raw_data)
  // }

  call_api_data_meteo() {
    this.home_svc.get_data_meteo(this.spot).subscribe(res => {
      console.log(res)
      this.raw_data = res
      localStorage.setItem("data_meteo", JSON.stringify(this.raw_data));
      this.data_hours = this.raw_data['hours'];
      this.data_winds_forecast = this.raw_data['winds_forecast'];
      this.data_winds_directions = this.raw_data['winds_directions'];
      this.data_winds_speed = this.raw_data['winds_speed'];
      this.data_winds_gust = this.raw_data['winds_gust'];
      this.data_temperatures = this.raw_data['temperatures'];
      this.data_houle_moy = this.raw_data['houle_moy'];
      this.data_waves_forecast = this.raw_data['waves_forecast'];
      this.data_pressures = this.raw_data['pressures']
      this.data_waves_min = this.raw_data['waves_min']
      this.data_waves_max = this.raw_data['waves_max']
      // console.log(this.data_hours);
      // console.log(this.data_houle_moy);
      // console.log(this.data_temperatures);
      this.current_hour = this.get_current_hour() + 'h';
      this.current_index = this.get_current_index(this.current_hour)
      this.get_current_data_by_index()
    });
    // console.log(this.current_pressures);
    // console.log(res);
  }

  get_meteo_data_via_storage() {
    this.raw_data = JSON.parse(localStorage.getItem('data_meteo'));
    console.log(this.raw_data);
    this.data_hours = this.raw_data['hours'];
    this.data_winds_forecast = this.raw_data['winds_forecast'];
    this.data_winds_directions = this.raw_data['winds_directions'];
    this.data_winds_speed = this.raw_data['winds_speed'];
    this.data_winds_gust = this.raw_data['winds_gust'];
    this.data_temperatures = this.raw_data['temperatures'];
    this.data_houle_moy = this.raw_data['houle_moy'];
    this.data_waves_forecast = this.raw_data['waves_forecast'];
    this.data_pressures = this.raw_data['pressures']
    this.data_waves_min = this.raw_data['waves_min']
    this.data_waves_max = this.raw_data['waves_max']
    // console.log(this.data_hours);
    // console.log(this.data_houle_moy);
    // console.log(this.data_temperatures);
    this.current_hour = this.get_current_hour() + 'h';
    this.current_index = this.get_current_index(this.current_hour)
    this.get_current_data_by_index()
  }

  get_current_hour() {
    const now = new Date().getHours();
    // console.log(now);
    return now;
  }

  get_current_index(index: string) {
    return this.data_hours.indexOf(index);
  }

  get_current_data_by_index() {
    this.current_winds_directions = this.data_winds_directions[this.current_index];
    this.current_winds_speed = this.data_winds_speed[this.current_index];
    this.current_winds_gust = this.data_winds_gust[this.current_index];
    this.current_temperatures = this.data_temperatures[this.current_index];
    this.current_houle_moy = this.data_houle_moy[this.current_index];
    this.current_pressures = this.data_pressures[this.current_index];
    this.current_waves_min = this.data_waves_min[this.current_index]
    this.current_waves_max = this.data_waves_max[this.current_index]
    
    // Color gestion 
    if (Number(this.current_temperatures) >= 25) {
      this.current_color_temp = "tres_chaud"
    } else if (Number(this.current_temperatures) >= 20) {
      this.current_color_temp = "chaud"
    } else if (Number(this.current_temperatures) < 10) {
      this.current_color_temp = "froid"
    } else {
      this.current_color_temp = "normal"
    }
    // console.log(this.current_waves_max);
    
  }

  get_news() {
    let url = 'http://127.0.0.1:8000/news'
    const header = {
      'Authorization': `${this.auth_svc.user.token}`,
    }
    this.http.get(url, {headers:header}).subscribe(res => {
      this.news = res
      localStorage.setItem("data_news", JSON.stringify(this.news))
      // console.log(this.news);
    })
  }

  get_news_storage() {
    this.news = JSON.parse(localStorage.getItem("data_news"))
  }

  refresh_data_spot() {
    console.log("test");
  }

  get_spots() {
    let url = 'http://127.0.0.1:8000/spots'
    this.http.get(url).subscribe((res:any[]) => {
      console.log(res);
      this.spots = res
    })
  }

  reset_current() {
    console.log('test');
    this.saved = false;
    this.current_hour = this.get_current_hour() + 'h';
    this.current_index = this.get_current_index(this.current_hour)
    this.get_current_data_by_index()
  }

}
