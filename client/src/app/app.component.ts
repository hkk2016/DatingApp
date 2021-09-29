import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './models/User';
import { AccountService } from './_services/account.service';
import { PresenceService } from './_services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'client';
  users:any;
  constructor(private _http:HttpClient,
    private _accountservice:AccountService,
    private presence : PresenceService) {

  }

  setCurrentUser()
  {
    const user:User=JSON.parse(localStorage.getItem('user')??"");
    if(user)
    {
      this._accountservice.setCurrentUser(user);
      this.presence.createHubConnection(user);
    }
    
  }

  ngOnInit() {
    
    this.setCurrentUser();

    //this.getUsers();

  }



  private getUsers() {
    
    this._http.get("https://localhost:5001/api/Users").subscribe(
      response => {
        this.users = response;
        console.log(response);
      },
      console => {
      }

    );
  }
}
