import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from '../_services/account.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private _accountService:AccountService,private _toastr:ToastrService) {
  }
  canActivate(): Observable<boolean>{
    return this._accountService.currentUser$.pipe(
      map(user=>{
        if(user) return true;
        this._toastr.error("You shall not pass");
        return false;
      })
    );
  }
  
}
