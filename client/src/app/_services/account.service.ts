import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl=environment.apiUrl;

  private currentUserSource=new ReplaySubject<User>(1);

  currentUser$=this.currentUserSource.asObservable();

  constructor(private _http:HttpClient) { }

  login(model:any)
  {
    return this._http.post<User>(this.baseUrl+"account/login",model)
    .pipe(

      map((response:User)=>
      {
        const user=response;
        if(user)
        {
          this.setCurrentUser(user);
          // localStorage.setItem('user',JSON.stringify(user));
          // this.currentUserSource.next(user);
        }
      })
    )
  }

  setCurrentUser(user:User)
  {
    localStorage.setItem('user',JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout()
  {
    localStorage.removeItem('user');
    this.currentUserSource.next();
  }

  register(model:any)
  {
    return this._http.post<User>(this.baseUrl+"account/register",model)
    .pipe(

      map((user:User)=>
      {
        if(user)
        {
          this.setCurrentUser(user);
          //this.currentUserSource.next(user);
        }
      })
    )
  }
}
