import { Route } from '@angular/compiler/src/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlContainer, FormBuilder, FormControl, FormGroup, MaxLengthValidator, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() outPutFromRegister = new EventEmitter();
  registerForm: FormGroup;
  maxDate:Date;
  validationErrors:string[]=[];

  initializeForm() {
    this.registerForm = this._fb.group({

      gender:['male'],
      username:['', Validators.required],
      knownAs:['', Validators.required],
      dateOfBirth:['', Validators.required],
      city:['', Validators.required],
      country:['', Validators.required],
      password:['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword:['', [Validators.required,this.matchValues('password')]]
    })

    this.registerForm.controls.password.valueChanges.subscribe(()=>
    {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : { isMatching: true };
    };
  }
  constructor(private _accountSerivce: AccountService, 
    private _toastr: ToastrService,
    private _fb:FormBuilder,
    private _router:Router) { }

  ngOnInit(): void {

    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
  }

  register() {
    //console.log(this.registerForm.value);

    this._accountSerivce.register(this.registerForm.value).subscribe(
      response=>
      {
      this._router.navigateByUrl('/members');
      },
      error=>
      {
        this.validationErrors=error;
      })

  }

  cancel() {
    this.outPutFromRegister.emit(false);
  }
}
