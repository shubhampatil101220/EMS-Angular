

import { Component, OnInit } from '@angular/core';
import {  FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  addDetailsGroup!: FormGroup;
  addUserGroup!: FormGroup;
  user:string=`${localStorage.getItem('user')}`;
  states: string[] = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
    "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi"
  ];
  selectedState: string='';
  errorMessage: string = '';
  createdDate = new FormControl();
  constructor(
    private router: Router 
    ) {
    this.createdDate.setValue(new Date().toISOString().split('T')[0]);
   }
  ngOnInit(): void {
    this.checkAdmin();
    
  }
  admin=false;
  checkAdmin(){
    if(localStorage.getItem('user')==='admin'){
    this.admin=true;
    
    }else{
      this.admin=false;
    }
  }

  
  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
 

}
