import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class MasterServiceService {
  customerUrl:string='https://localhost:7047/api/Customer';
  userUrl:string ='https://localhost:7047/api/User';
  constructor(private http: HttpClient) { }
 
  

  getUserByID(id:any):Observable<any>{
    const url=this.customerUrl+'/GetCustomerById/'+id;
    return this.http.get(url);
  }
  //get all customer data to admin
  getAllCustomerAdminCount(){
    const url = `${this.customerUrl}/GetAllCustomerCount`;
    return this.http.get(url);
  }
  //get all user data count to admin
  getAllUserCount(){
   // https://localhost:7047/api/User/GetAllUserCount
    const url = `${this.userUrl}/GetAllUserCount`;
    return this.http.get(url);
  }
  //getting customer data in  paginated form for server side paging
  getAllCustomerPaginatedData(page: number, pageSize: number): Observable<any> {
   const url = `${this.customerUrl}/GetAllCustomerByFilter?page=${page}&pageSize=${pageSize}`;
    return this.http.get(url);
  }
    //getting user data in  paginated form for server side paging
  getAllUserPaginatedData(page: number, pageSize: number): Observable<any> {
    const url = `${this.userUrl}/GetUserByFilter?page=${page}&pageSize=${pageSize}`;
    return this.http.get(url);
     }
    //get customers created by  a particular user
    getUserPaginatedData(page: number, pageSize: number,UserId:number): Observable<any> {
    // https://localhost:7047/api/Customer/GetUserCustomerByFilter?page=1&pageSize=10&UserId=1
    const url = `${this.customerUrl}/GetUserCustomerByFilter?page=${page}&pageSize=${pageSize}&CreatedBy=${UserId}`;
    return this.http.get(url);
     }
    //get customers count created by  a particular user
  getPerticularUsersData(UID:string): Observable<any> {
    // https://localhost:7047/api/Customer/GetAllCustomerOfUserByCreatedId/1
   const url = `${this.customerUrl}/GetAllCustomerOfUserByCreatedId/`+UID;
    return this.http.get(url);
     }
     
        //get customers count created by  a particular user
  getPerticularUsersDataCount(UID:string): Observable<any> {
    
    // https://localhost:7047/api/Customer/GetAllCustomerOfUserByCreatedIdCount/1
    const url = `${this.customerUrl}/GetAllCustomerOfUserByCreatedIdCount/`+UID;
     return this.http.get(url);
      }
    //adding customer to datatables
  addDetailsCustomer(data:any){
    const url = `${this.customerUrl}/CreateCustomer`;
    return this.http.post(url,data);
  }
  // //getting user details by id
  // getUserDetailsM(userId: number) {
   
  //   return this.http.get(`${this.customerUrl}/GetCustomerById/${userId}`);
  // }
  //Remove user from Data
  removeUserDetailsM(userId:number){
    return this.http.get(`${this.userUrl}/RemoveUser/${userId}`);
  }
   //Remove Customer from Data
  removeCustomerDetailsM(userId:number){
    return this.http.get(`${this.customerUrl}/RemoveCustomer/${userId}`);
  }
  //update customer from data
  upDetailsM(data:any){
    return this.http.put(`${this.customerUrl}/UpdateCustomer`,data);
  }
  //update user from data
  updateUserM(data:any){
    return this.http.put(`${this.userUrl}/UpdateUser`,data);
  }

  //USER apis
  addDetailsUser(data:any){
    debugger
    // https://localhost:7047/api/User/CreateUser
    const url = `${this.userUrl}/CreateUser`;
    return this.http.post(url,data);
  }


}
