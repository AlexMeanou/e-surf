import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  username : string;
  password : string;
  userForm : FormGroup;

  constructor(public auth_svc: AuthService, private fb: FormBuilder) { 
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  get f() { return this.userForm.controls; }

  onLogin() {
    console.log(this.userForm.value);
    this.auth_svc.login(this.userForm.value);
  }

}
