import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model:any={};
  @Output() outPutFromRegister=new EventEmitter();

  constructor(private _accountSerivce:AccountService,private _toastr:ToastrService) { }

  ngOnInit(): void {
  }

  register()
  {
    this._accountSerivce.register(this.model).subscribe(
      response=>
      {
        
        console.log(this.model);
        this.cancel();
      },
      error=>
      {
        console.log(error);
        //this._toastr.error(error.error);
      })
      
  }

  cancel()
  {
    this.outPutFromRegister.emit(false);
  }
}
