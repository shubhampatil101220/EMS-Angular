import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginAuthService } from '../services/login-auth.service';
import { NgToastService } from 'ng-angular-popup';
import emailjs from '@emailjs/browser';
import { JwtService } from '../services/jwt.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  

  loginform!:FormGroup
 
  verifyemailLoginForm!:FormGroup
  verifyOtpGroup!:FormGroup
 

  email: string='';
  userName:string=''
  enteredOTP: string='';
  adminData:any={firstName:"admin",
                  userId: 1};
 
  constructor(private router:Router,
             private fb: FormBuilder, 
             private loginService:LoginAuthService,
             private toast:NgToastService
          
             ){
                        
             }

  ngOnInit(): void {
    //removing otp from localstorage
   
   this.loginform = this.fb.group({
    emaillogin: ['', Validators.required],
    password: ['', Validators.required]
   });
 

   //Separeate  form group for OTP verification
  this.verifyemailLoginForm = this.fb.group({
    otpemaillogin: ['', Validators.required],
   });
   this.verifyOtpGroup = this.fb.group({
    enteredOTP: ['', Validators.required]
   });


  }


  login(){
    if(this.loginform.valid){
      this.loginService.loginChecker(this.loginform.value.emaillogin,this.loginform.value.password)
      .subscribe(user=>{
     
      if(user){    
        console.log(user);
          
        console.log(user[0].firstName);
                       
          localStorage.setItem('user', `${user[0].firstName}`);
          localStorage.setItem('id',`${user[0].userId}`)
          // this.toast.success({detail:'Success',summary:`${user[0].firstName} Successfully logged in`,duration:8000});
          this.loginform.reset();
          this.router.navigate(['/dashboard']);
        
          localStorage.setItem('token',"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c")
          
      }else{
             
        this.toast.warning({detail:'Invalid',summary:'Invalid email or password',duration:8000});

      }
       
    })
    }else{
      this.toast.error({detail:'Error Message',summary:'Please enter valid details',duration:8000});

    }
}
  
  login_OTP=true;
  toggle(){
    this.login_OTP=!this.login_OTP;
  }


   randomDecimal: number=0;
   sendEmail:string='';
   checkFound:boolean=true;
  generateOTP() {

    this.loginService.mailChecker( this.verifyemailLoginForm.value.otpemaillogin ).subscribe(
      (data:Boolean) => {
      if(data){
     
      console.log( this.verifyemailLoginForm.value.otpemaillogin );
      
      this.sendEmail= this.verifyemailLoginForm.value.otpemaillogin ;
      this.randomDecimal = Math.floor(Math.random() * 900000) + 100000;
      console.log(this.randomDecimal);
   
     localStorage.setItem( 'otp', this.randomDecimal.toString());
     this.SendOTP();
     this.toggle();
        
     this.toast.success({ detail: 'Success', summary: 'OTP sent to You...', duration: 8000 });


   }else{
    this.toast.error({detail:"User Not Found", summary:"No User Found With This Email" , duration : 4000})
   }
    

    });
  }

  SendOTP(){
    emailjs.init('KrPM7ojDGK0a6_sDr')
    emailjs.send("service_rf6t59g","template_qcax1in",{
      from_name: "RBIS",
      to_name: "User",
      otp: `${this.randomDecimal}`,
      reply_to: `${this.sendEmail}`,
      });
  }


  
 user: any=[];
  verifyOTP() {
    debugger
      if(this.verifyOtpGroup.valid){
        if(!this.randomDecimal){
          this.toast.warning({ detail: 'Success', summary: 'You did not generated OTP Successfully!', duration: 8000 });
        }else{
          if(localStorage.getItem('otp') ==this.verifyOtpGroup.value.enteredOTP){
            debugger
            this.loginService.DataForOTP(this.verifyemailLoginForm.value.otpemaillogin).subscribe((res) => {
              console.log(res);
             console.log(this.verifyOtpGroup.value.enteredOTP);
             
              this.user = res;
            console.log(this.user);
            
            localStorage.setItem('user', `${this.user.firstName}`);
            // localStorage.setItem('id',`${this.user.userId}`);
            // localStorage.setItem('mail',`${this.user.email}`);
            this.loginform.reset();
            this.verifyOtpGroup.reset();
            this.router.navigate(['/dashboard']);
            localStorage.removeItem('otp');
            localStorage.setItem('token',`${this.user.token}`);
            console.log(this.user.token);
            
            });
          }else{
            this.toast.error({ detail: 'Invalid', summary: 'OTP is Invalid!', duration: 8000 });
          }
        }
      
        
  
      }


  }
}
