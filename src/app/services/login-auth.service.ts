import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginAuthService {
  customerUrl:string='https://localhost:7047/api/Customer';
  userUrl:string ='https://localhost:7047/api/User';
  loginUrl:string='https://localhost:7047/api/Login'

  constructor(private http: HttpClient) {}

  loginChecker(email:string,password:string){
    const data={email : email , password : password};
    // https://localhost:7047/api/Login/loginUser
    return this.http.post<any>(this.loginUrl+'/loginUser',data);
  }
  mailChecker(mail: string){
    debugger;
    const data={email : mail};
    // https://localhost:7047/api/Login/checkMail
    return this.http.post<any>(this.loginUrl+'/checkMail',data);
  } 

  DataForOTP(mail: string){
    const data={email : mail };
    // https://localhost:7047/api/Login/checkMail
    return this.http.post<any>(this.loginUrl+'/verifyOTP',data);
  }


  generateAndSendOTP(email: string) {
    const url = `${this.customerUrl}/api/auth/generate-otp`;
    return this.http.post(url, { email });
  }
  verifyOTP(data:any) {
    const url = `${this.customerUrl}/api/auth/verify-otp`;
    return this.http.post(url, { data});
  }
  //Getting user data for login
  login(){
    const url = `${this.userUrl}/GetAllUser`;
    return this.http.get<any>(url);
  }
  isLoggedIn(){
    return !! localStorage.getItem('token')
  }
}
