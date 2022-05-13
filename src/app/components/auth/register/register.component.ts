import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  spots = ['Lacano', 'Anglet', 'Test'];
  username : string;
  password : string;
  email: string;
  userForm : FormGroup;

  constructor(private auth_svc: AuthService, private fb: FormBuilder) { 
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      spots: [''],
    });
  }

  ngOnInit(): void {
  }

  get f() { return this.userForm.controls; }

  onRegister() {
    console.log(this.userForm.value);
    this.auth_svc.register(this.userForm.value);
  }

}
