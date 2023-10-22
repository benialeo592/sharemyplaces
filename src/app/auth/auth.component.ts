import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { AuthResponseData } from './auth-response-data';
import { Observable, map, take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent  {

  public isLogin:boolean = true;
  public message!: {
    text: string;
    style: string;
  };
  public authResponse!: Observable<AuthResponseData>;

  constructor(private authService: AuthService, private router: Router){}

  public changeAuth(){
    this.message = { text: '', style: ''};
    this.isLogin = !this.isLogin;
  }

  public onSubmit(form: NgForm){

    if(!this.isLogin){
      if (this.emailValidation(form.value.email) && this.passwordValidation(form.value.password, form.value.passwordConfirmation)){
        this.authResponse = this.authService.registration(form.value.email, form.value.password );
      }
    }else{
      this.authResponse = this.authService.login(form.value.email, form.value.password);
    }
    if(this.authResponse){
      this.authResponse.subscribe(
        () => (
          this.router.navigate(['/'])
          ),
        (errorResp) => (this.message = { text: errorResp.error.error.message, style: 'text-red-500'}));
      }
    form.reset();
  }

  private passwordValidation(
    password: string,
    confirmedPassword: string
  ): boolean {
    if (!password || !confirmedPassword) {
      this.message = {text:'Password must not be empty', style: 'text-red-500'};
      return false;
    } else if (password !== confirmedPassword) {
      this.message = { text: 'Password must be the same', style: 'text-red-500' };
      return false;
    } else if (password.length < 6) {
      this.message = { text: 'Password must be longer than 5 characters', style: 'text-red-500' };
      return false;
    }
    return true;
  }

  private emailValidation(email: string){
    if(!email){
      this.message = { text: 'Email cannot be null', style: 'text-red-500' };
      return false;
    }else{
      return true;
    }
  }

}
