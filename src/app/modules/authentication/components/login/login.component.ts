import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {ApiService } from 'src/app/services/api.service';
import { AuthService } from "src/app/services/auth.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showLoginForm: boolean = false;
  wrongUser: boolean | any;
  toggleSpinner: boolean | any;
  hide: boolean = true;
  accBlocked: boolean | any;
  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService, public auth: AuthService) {
    if(this.auth.isAuthenticated()){
      // let user: any = this.auth.getUser();
      console.log("authenticated")
      let role = localStorage.getItem('userRole');
      console.log(role)
      if(role === 'admin') this.router.navigate(['/homepage']);
      if(!role) {
        console.log("not user Role")
        this.showLoginForm = true;
      }
    } else{
      console.log("not logingin in");
      this.showLoginForm = true;
    }
    this.loginForm = this.formBuilder.group({
      email: [null, Validators.required,],
      password: [null,[Validators.required],
      ],
    });
  }

  ngOnInit(): void {}

  get email() {
    return this.loginForm.get("email");
  }

  get password() {
    return this.loginForm.get("password");
  }

  submitClick(): void {
    this.toggleSpinner = true;
    let invalidLoginStatus: any = localStorage.getItem('invalidLoginStatus');
    if (invalidLoginStatus) { 
      invalidLoginStatus = JSON.parse(invalidLoginStatus);
      if (invalidLoginStatus.attempt === 2 && this.checkTimeDifference(invalidLoginStatus?.time) && this.loginForm?.value?.email === invalidLoginStatus.email) {
        this.loginForm.value.lock = true; // third attempt
        localStorage.removeItem('invalidLoginStatus');
      } else {
        this.loginForm.value.lock = false;
      }
    }

    let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDg4MDQ5ODksImlhdCI6MTY0ODc5Nzc4OSwic3ViIjoiZjUxYjQ2YjQtZjc2ZC00OTExLThhMWQtMjU3MDAxNGI0NzYzIiwidXNlcklkIjoxLCJyb2xlIjoiYWRtaW4iLCJmaXJzdE5hbWUiOiJBZG1pbiIsImxhc3ROYW1lIjoiR1MxIn0.DjkxJRpUTdV8-3dYYfHaG9rsKpgASR0U1nPji1TeL7k";

    console.log(this.loginForm?.value?.email)
    console.log(this.loginForm?.value);
    if(this.loginForm?.value?.email.toLowerCase()==='admin' && this.loginForm?.value?.password==='12345678'){
      this.toggleSpinner = false;
      localStorage.setItem('userToken', token);
      localStorage.setItem('userRole', 'admin');
      if(this.loginForm?.value?.email === 'admin') this.router.navigate(['/homepage']);
    }
    else{
      this.wrongUser=true;
      this.toggleSpinner = false;
    }


    // this.apiService.post(`${environment.userApiUrl}/auth/login?code=${environment.userApiFunctionKey}`, this.loginForm.value).subscribe((data:any) => {
    //   this.wrongUser = false;
    //   if (data?.token) { //receiver, register, vendor, admin
    //     this.toggleSpinner = false;
        
    //     localStorage.setItem('userToken', data?.token);
    //     localStorage.setItem('userRole', data?.user?.role);
    //     if(data?.user?.role === 'receiver') this.router.navigate(['/receiving/home']);
    //     else if(data?.user?.role === 'register') this.router.navigate(['/registration/home']);
    //     else if(data?.user?.role === 'photographer') this.router.navigate(['/photographer']);
    //     else if(data?.user?.role === 'vendor') this.router.navigate(['/vendor']);
    //     else this.router.navigate(['/dashboard']);
    //   }
    // }, (err) => {
    //   this.wrongUser=true;
    //   this.toggleSpinner = false;
    //   if (err?.error?.blocked) this.accBlocked = true;
    //   if (!err?.error?.blocked && err?.error?.status === false) {
    //     this.setInvalidLogin();
    //     this.accBlocked = false;
    //   }
    // })
  }

  // setInvalidLogin(): void {
  //   let invalidLoginStatus: any = localStorage.getItem('invalidLoginStatus');
  //   if (invalidLoginStatus) {
  //     invalidLoginStatus = JSON.parse(invalidLoginStatus);
  //     if (!this.checkTimeDifference(invalidLoginStatus?.time) || invalidLoginStatus.attempt === 3 || this.loginForm?.value?.email !== invalidLoginStatus.email) {
  //       invalidLoginStatus.attempt = 1;
  //       invalidLoginStatus.email = this.loginForm?.value?.email;
  //     }
  //     else invalidLoginStatus.attempt = invalidLoginStatus.attempt + 1;
  //     invalidLoginStatus.time = new Date();
  //     this.storeInvalidLogin(invalidLoginStatus);
  //   } else {
  //     let values = { attempt: 1, time: new Date(), email: this.loginForm?.value?.email };
  //     this.storeInvalidLogin(values);
  //   }
  // }

  checkTimeDifference(oldTime:any) {
    const currentDate: any = new Date();
    oldTime = new Date(oldTime)
    const diffMs = (currentDate - oldTime); // milliseconds between now & old
    let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    return diffMins < 10 ? true : false;
  }

  // storeInvalidLogin(values:any): void {
  //   this.tostr.warning('You have ' + (3 - values?.attempt) + ' remaining attempt')
  //   localStorage.setItem('invalidLoginStatus', JSON.stringify(values));
  // }

  RemoveInvalidErr(): void {
    this.wrongUser = false;
  }

}
