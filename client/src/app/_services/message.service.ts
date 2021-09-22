import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Message } from '../models/message';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl=environment.apiUrl;

  constructor(private _http: HttpClient) { }

  getMessages(pageNumber,pageSize,container)
  {
    let params = getPaginationHeaders(pageNumber,pageSize);
    params = params.append('Container',container);

    return getPaginatedResult<Message[]>(this.baseUrl +'messages',params,this._http);
  }

  getMessageThread(username:string)
  {
    return this._http.get<Message[]>(this.baseUrl+'messages/thread/'+username);
  }

  sendMessage(username:string,content:string)
  {
    return this._http.post<Message>(this.baseUrl+'messages',{recipientusername:username,content});
  }

  deleteMessage(id:number)
  {
    return this._http.delete(this.baseUrl + 'messages/' +id);
  }
}
