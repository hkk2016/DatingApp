import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})
export class MembersListComponent implements OnInit {

  members:Member[]=[];

  constructor(private memberService:MembersService) { }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers()
  {
      this.memberService.getMembers().subscribe(members=>
        {
          this.members=members;
        })
  }
}
