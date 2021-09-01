import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model:any={};
  @Output() outPutFromRegister=new EventEmitter();

  constructor(private _accountSerivce:AccountService) { }

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
      })
      
  }

  cancel()
  {
    this.outPutFromRegister.emit(false);
  }
}
