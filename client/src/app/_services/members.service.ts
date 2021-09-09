import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member';

// const httpOptions={
//   headers:new HttpHeaders({

//     Authorization:'Bearer '+JSON.parse(localStorage.getItem('user')??"{}")?.token

//   })
// }
@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl=environment.apiUrl;

  constructor(private _http:HttpClient) { }

  getMembers()
  {
    return this._http.get<Member[]>(this.baseUrl+'users')
  }

  getMember(username:string)
  {
    return this._http.get<Member>(this.baseUrl+'users/'+username);
  }
}
