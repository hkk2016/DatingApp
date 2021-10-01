import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { Pagination } from '../models/pagination';
import { ConfirmService } from '../_services/confirm.service';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages: Message[] = [];
  pagination: Pagination;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  constructor(private _messageService: MessageService,
    private confirmService: ConfirmService) { }

  ngOnInit(): void {

    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;

    this._messageService
      .getMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe(response => {
        this.messages = response.result;
        this.pagination = response.pagination;
        this.loading = false;
      });

  }

  deleteMessage(id: number) {
    this.confirmService.confirm('Confirm Delete Message', 'This Cannot be undone')
      .subscribe(result => {
        if (result) {
          this._messageService.deleteMessage(id)
            .subscribe(() => {
              this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
            })
        }
      })


  }
  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadMessages();
  }
}
