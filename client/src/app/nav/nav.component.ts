import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  
  model:any={};


  constructor(public _accountService:AccountService,private _router:Router,private _toastr:ToastrService) { }

  ngOnInit(): void {


  }

   login()
   {
      //console.log(this.model);

      this._accountService.login(this.model).subscribe(response=>
        {
          this._router.navigateByUrl('/members');
        },
        error=>
        {
          console.log(error);
          //this._toastr.error(error.error);
          
        } )

   }

   logout()
   {
     this._accountService.logout();
     this._router.navigateByUrl('/');
   }

  
}
