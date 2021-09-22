import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { Member } from '../models/member';
import { MembersService } from '../_services/members.service';

@Injectable({
  providedIn: 'root'
})
export class MemberDetailedResolver implements Resolve<Member> {
  
  constructor(private _memberService:MembersService) {
  }
  resolve(route: ActivatedRouteSnapshot): Observable<Member> {
    return this._memberService.getMember(route.paramMap.get('username'));
  }

  
}
