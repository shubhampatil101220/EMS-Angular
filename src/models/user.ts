export class CustomerModel{
  leadId: number=0
  firstName: string=''
  lastName: string=''
  middleName: string=''
  jobTitle: string=''
  personalEmail: string=''
  workEmail: string=''
  companyContactEmail: string=''
  country: string=''
  state: string=''
  city: string=''
  linkedin: string=''
  createdDate: string=''
  createdBy: string=''
  status: string=''
  isDeleted:string=''
}
export class UserModel{
  userId: number=0
  firstName: string=''
  lastName: string=''
  middleName: string=''
  email: string=''
  password: string=''
  createdDate: string=''
  isActive: string=''
}

export class loginModel{
  email:string = '';
  password:string = '';
}