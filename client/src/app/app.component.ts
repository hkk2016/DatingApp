import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'client';
  users:any;
  constructor(private _http:HttpClient) {

  }
  ngOnInit() {
    
    this._http.get("https://localhost:5001/api/Users").subscribe(
      response =>
      {
        this.users=response;
        console.log(response);
      }
      ,console=>
      {
        
      }
      
    )

  }


}
