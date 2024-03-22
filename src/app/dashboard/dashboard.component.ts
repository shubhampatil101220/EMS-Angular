
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MasterServiceService } from '../services/master-service.service';
import { CustomerModel, UserModel } from 'src/models/user';
import { NgToastService } from 'ng-angular-popup';
import emailjs from '@emailjs/browser';
import { LoginAuthService } from '../services/login-auth.service';
import { JwtService } from '../services/jwt.service';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})
export class DashboardComponent implements OnInit {
  userDetails: Array<UserModel> = [];
  userDetailsTemp:Array<UserModel>=[] ;
  customerDetails: Array<CustomerModel> = [];
  customerDetailsTemp: Array<CustomerModel> = [];
  


  Dashboard:boolean=true;
 
 

  updateCustomerGroup!: FormGroup;
  addCustomerGroup!: FormGroup;
  addUserGroup!: FormGroup;
  updateUserGroup!: FormGroup;

  states: string[] = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
    "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi"
  ];

  selectedState: string = '';


  constructor(private fb: FormBuilder,
    private toast: NgToastService
    , private masterService: MasterServiceService,
    private loginService:LoginAuthService,
    private jwtService: JwtService

  ) {
   

  }


  

  ngOnInit(): void {
   
    this.checkUser();
   
    this.addUserGroup = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      roleId: ['', Validators.required],
      token:['']
    });
    this.updateUserGroup = this.fb.group({
      userId:['',Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      roleId: ['', Validators.required],
      token:['']
    });

    this.addCustomerGroup = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      companyContactEmail: ['', Validators.required],
      workEmail: ['', Validators.required],
      personalEmail: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      linkedin: ['', Validators.required],
      createdBy: [''],
      createdId:[''],
      status: ['', Validators.required]
    });

    this.updateCustomerGroup = this.fb.group({
      leadId: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middleName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      companyContactEmail: ['', Validators.required],
      workEmail: ['', Validators.required],
      personalEmail: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      linkedin: ['', Validators.required],
      createdBy: ['', Validators.required],
      status: ['', Validators.required],

    });

  }
  searchText: string = '';
  filteredCustomer: any[] = this.customerDetails;
  CustomerSearch(): void {    
    console.log("se",this.searchText);
    
    this.filteredCustomer = this.customerDetailsTemp.filter((item) =>
      item.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||  item.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||  item.createdBy.toLowerCase().includes(this.searchText.toLowerCase())
    );
   this.customerDetails=this.filteredCustomer
    }
    userSearch(){
      console.log("se",this.searchText);
    
      this.filteredCustomer = this.userDetailsTemp.filter((item) =>
        item.firstName.toLowerCase().includes(this.searchText.toLowerCase()) ||  item.lastName.toLowerCase().includes(this.searchText.toLowerCase())
      );
     this.userDetails=this.filteredCustomer
    }

    changeDashboard(){
      this.Dashboard=!this.Dashboard;
      this.getAllUserData(this.currentPage, this.pageSize);
      this.pageSizeChanged();
    }
    LeadDashboard(){
      this.Dashboard=true;
      this.getAllCustomerData(this.currentPage, this.pageSize);
      this.pageSizeChanged();
    }
    UserDashboard(){
      this.Dashboard=false;
      this.getAllUserData(this.currentPage, this.pageSize);
      this.pageSizeChanged();
    }
      admin = false;
      user: any=[]; 

      userMail:any='';
      userIdentity: string = ''
      userName:string='';
  checkUser() {
    debugger
     // Get the JWT token from localStorage
     const token: string | null = localStorage.getItem('token');
    
     if (token) {
       // Decode the JWT token
       const decodedToken: any = this.jwtService.decodeToken(token);
 
       // Extract the username from the decoded token
        this.userIdentity =decodedToken.nameid;  // Assuming "sub" claim contains the username
      
        this.userMail = decodedToken.email; // Assuming "sub" claim contains the username

        this.userName =decodedToken.unique_name;  // Assuming "sub" claim contains the username

       // Use the username as needed
       
     } else {
       console.log("Token not found in localStorage");
       
     }
    this.loginService.DataForOTP(this.userMail).subscribe(data=>{
     let user:any=data;
     if(user){
      console.log(user);
      console.log(user.roleId);

      
      if (user.roleId === 1) {
        this.userDetails = [];
        this.admin = true;
        // this.userIdentity=this.UID
       if(!this.Dashboard){
        this.getAllUserData(this.currentPage, this.pageSize);
       }else {
        this.getAllCustomerData(this.currentPage, this.pageSize);
       }
        
      }else if(user.roleId === 2) {
        this.admin = false;
        // this.userIdentity=this.UID
        this.customerDetails = [];
        this.getUserAddedData(this.currentPage, this.pageSize,this.userIdentity);
        console.log(this.getUserAddedData);
        
      }

    }
    })
  

  }

  
  //get All Customer Data count for Admin
  getAllAdminCustomerDataCount() {
    this.masterService.getAllCustomerAdminCount()
      .subscribe((data: any ) => {
         this.totalItems = data;
        this.totalPagesArray = Array.from({ length: Math.ceil(this.totalItems / this.pageSize) }, (_, i) => i + 1);
      });
  }
    //get All Customer Data count for Admin
    getAllAdminUserDataCount() {
      this.masterService.getAllUserCount()
        .subscribe((data:any) => {
           this.totalItems = data;
          this.totalPagesArray = Array.from({ length: Math.ceil(this.totalItems / this.pageSize) }, (_, i) => i + 1);
        });
  
    }
     //get user added Customer Data count 
     getUserAddedDataCount() {
      this.masterService.getPerticularUsersDataCount(this.userIdentity)
      .subscribe((data: any| []) => {
         this.totalItems = data;
        console.log(this.totalItems);
        
          this.totalPagesArray = Array.from({ length: Math.ceil(this.totalItems / this.pageSize) }, (_, i) => i + 1);
        });
  
    }
  





  //get All Customer  Data For Admin
  getAllCustomerData(currentPage: any, pageSize: any) {
    this.currentPage = currentPage;
    this.pageSize = pageSize;
    console.log('get all data Page size'+pageSize);
    
   
    this.masterService.getAllCustomerPaginatedData(currentPage, pageSize)
      .subscribe((data: any) => {
        console.log('Default Page Size:'+pageSize);
        //get All Customer Data count for Admin
        this.getAllAdminCustomerDataCount();
        this.customerDetails = data as CustomerModel[];
        this.customerDetailsTemp = data as CustomerModel[];     
        this.currentPageRecordCount =this.customerDetails.length;
      });
  }
  //get AllUser Data For Admin
  getAllUserData(currentPage: any, pageSize: any) {
    this.currentPage = currentPage;
    this.pageSize = pageSize;
    console.log('get all data Page size'+pageSize);

    this.masterService.getAllUserPaginatedData(currentPage, pageSize)
      .subscribe((data: any) => {
        console.log('Default Page Size:'+pageSize);
        //get All Customer Data count for Admin
        this.getAllAdminUserDataCount();
        this.userDetails = data as UserModel[];
        this.userDetailsTemp = data as UserModel[];
        console.log(this.userDetails);
        this.currentPageRecordCount =this.userDetails.length;
      });
  }


  // get user created customer
  getUserAddedData(currentPage: any, pageSize: any,userIdentity:any) {
       console.log(pageSize);
       this.currentPage = currentPage;
       this.pageSize = pageSize;
       this.userIdentity=userIdentity;
   
    this.masterService.getUserPaginatedData(currentPage, pageSize,userIdentity)
      .subscribe((data: any) => {
       
        this.getUserAddedDataCount()
        this.customerDetails = data as CustomerModel[];
        this.customerDetailsTemp = data as CustomerModel[];
        console.log(this.customerDetails);
        this.currentPageRecordCount =this.customerDetails.length;
      });
  }

  //server side Pagination
  currentPage = 1;
  currentPageRecordCount=1;
  pageSize = 10; // Adjust as needed
  totalPagesArray: number[] = [];
  totalItems=1;
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.checkUser();
    }
  }
  nextPage() {
    // You should check if there are more pages before incrementing
    if (this.currentPage < this.totalPagesArray.length) {
      this.currentPage++;
      this.checkUser();
    }
  }
  pageSizeChanged() {
    // Reload data when page size changes
   
    this.currentPage = 1;
    this.customerDetails = [];
    this.userDetails =[];
   this.checkUser();
   
   
  }


  //send Email through EmailJs
  sendEmail() {
    debugger;
    emailjs.init('KrPM7ojDGK0a6_sDr')
    emailjs.send("service_rf6t59g", "template_2bkni6d", {
      from_name: "RBIS",
      to_name: this.To_name,
      userName: this.UserName,
      password: this.Password,
      reply_to: this.Reply_to,
    });
  
    this.toast.success({ detail: 'Success', summary: 'User Created Successfully!', duration: 8000 });
  }
  // adding data to emailservice
  To_name: string = '';
  UserName: string = '';
  Password: string = '';
  Reply_to: string = '';

  //adding new user by customer
  addUser() {
    debugger;
    // Stop here if form is invalid
    if (this.addUserGroup.valid) {
      debugger
      const formData = this.addUserGroup.value;
      formData.token=localStorage.getItem('token');
      this.To_name = formData.firstName;
      this.UserName = formData.email;
      this.Password = formData.password;
      this.Reply_to = formData.email;


      console.log(formData);

      this.masterService.addDetailsUser(formData).subscribe({
        next: () => {
          debugger;
          this.addUserGroup.reset();
          this.toast.success({ detail: 'Success', summary: 'Data Added Successfully!', duration: 8000 });
          this.sendEmail();
          this.checkUser();
        },
        error: (err) => {
          console.log(err);
          
          this.toast.error({ detail: 'Error Message', summary: 'Data not Added', duration: 8000 });
        }
      });
    } else {
      alert('form is invalid')
    }
  }

  //adding new customer
  addCustomer() {
    debugger;
    console.log(this.addCustomerGroup);

    // Stop here if form is invalid
    if (this.addCustomerGroup.valid) {

      const formData = this.addCustomerGroup.value;
      formData.createdBy = this.userName;
      formData.createdId = this.userIdentity;
      this.masterService.addDetailsCustomer(formData).subscribe({
        next: () => {

          this.addCustomerGroup.reset();
          this.toast.success({ detail: 'Success', summary: 'Data Added Successfully!', duration: 8000 });
          this.checkUser();
       
        },
        error: (err) => {
          this.toast.error({ detail: 'Error Message', summary: 'Data not Added', duration: 8000 });
          console.log(err);

        },
      });
    } else {
      alert('form is invalid')
    }
  }

  //adding details to update form of customer
  updateExistingCustomerForm(user: any) {
    console.log(user);
    this.updateCustomerGroup.patchValue({
      leadId: user.leadId,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      jobTitle: user.jobTitle,
      companyContactEmail: user.companyContactEmail,
      workEmail: user.workEmail,
      personalEmail: user.personalEmail,
      country: user.country,
      state: user.state,
      city: user.city,
      linkedin: user.linkedin,
      createdBy: user.createdBy,
      status: user.status

    });
    console.log(this.updateCustomerGroup);

  }
  //updating the new values of customer
  updateExistingCustomer() {
    if (this.updateCustomerGroup.valid) {
      const formData = this.updateCustomerGroup.value;
      
      this.masterService.upDetailsM(formData).subscribe((data: any) => {

        this.toast.success({ detail: 'Success', summary: 'User Details Updated Successfully', duration: 8000 });
        this.checkUser();
    
   
      }, err => {
        this.toast.error({ detail: 'Error Message', summary: 'User Details not Updated ', duration: 8000 });
        console.log(err);
      }
      );

    } else {
      this.toast.warning({ detail: 'Invalid', summary: 'Invalid form data', duration: 8000 });

    }
  }
    //adding user details to update form of customer
    updateExistingUserForm(user: any) {
      console.log(user);
      this.updateUserGroup.patchValue({
        userId:user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        email: user.email,
        password:user.password,
        roleId:user.roleId,
        token:localStorage.getItem('token')
      });
      console.log(this.updateUserGroup);
  
    }
    //reset the form
    resetAddCustomerForm(){
      this.addCustomerGroup.reset();
    }
    updateUser(){
      if (this.updateUserGroup.valid) {
        debugger;
        const formData = this.updateUserGroup.value;
        formData.token=localStorage.getItem('token');
        console.log(formData);
        
        this.masterService.updateUserM(formData).subscribe((data: any) => {
  
  
          this.toast.success({ detail: 'Success', summary: 'User Details Updated Successfully', duration: 8000 });
          this.checkUser();
      
       
        }, err => {
          this.toast.error({ detail: 'Error Message', summary: 'User Details not Updated ', duration: 8000 });
          console.log(err);
        }
        );
  
      } else {
        this.toast.warning({ detail: 'Invalid', summary: 'Invalid form data', duration: 8000 });
  
      }
    }


  DeleteAlertConfirmationCustomer(leadId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'If Click yes user will be Deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think',
    }).then((result) => {
      if (result.value) {
        this.masterService.removeCustomerDetailsM(leadId).subscribe();
        this.toast.success({ detail: 'Success', summary: 'customer Removed Successfully!', duration: 8000 });
        this.checkUser();
      } 
      
  
    });

  }
  DeleteAlertConfirmationUser(userId:any){
    Swal.fire({
      title: 'Are you sure?',
      text: 'If Click yes user will be Deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think',
    }).then((result) => {
      if (result.value) {
        this.masterService.removeUserDetailsM(userId).subscribe();
        this.toast.success({detail:'Delete User',summary:'User has been deleted successfully' ,duration:4000});
        this.checkUser();
      } 
      this.checkUser();
  
    });

  }
}