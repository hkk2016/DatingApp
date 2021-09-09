import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { User } from '../models/User';
import { take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private _accountService:AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser:User|undefined|null;

    this._accountService.currentUser$.pipe(take(1)).subscribe(user => currentUser = user);
    
    if(currentUser!=null && currentUser!=undefined)
    {
      request= request.clone({
        setHeaders:{
          Authorization:`Bearer ${currentUser.token}`
        }
      })
    }
    return next.handle(request);
  }
}
