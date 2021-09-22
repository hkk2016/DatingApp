import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/models/member';
import { Message } from 'src/app/models/message';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  @ViewChild('memberTabs',{static:true}) memberTabs :TabsetComponent;

  member: Member | any;
  galleryOptions: NgxGalleryOptions[] | any;
  galleryImages: NgxGalleryImage[] |any;
  activeTab:TabDirective;
  messages:Message[]=[];

  constructor(private _memberService: MembersService,
    private _route: ActivatedRoute,private _messageService:MessageService) { }

  ngOnInit(): void {

    //this.loadMember();
    this._route.data.subscribe(data => {
        this.member = data.member;
    })

    this._route.queryParams.subscribe(params => {
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    })
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false

      }
    ];

    this.galleryImages = this.getImages();

  }

  // loadMember() {
  //   this._memberService.getMember(this._route.snapshot.paramMap.get('username') ?? "").subscribe(mem => 
  //     {
  //       this.member = mem;
  //       //this.galleryImages = this.getImages();
  //       //console.log("member="+ JSON.stringify(this.member));     
  //     }
        
  //     );

    
  // }

  getImages(): NgxGalleryImage[] {
    const imageUrl = [];

   console.log("getImages()="+ JSON.stringify(this.member) );

    if(this.member !=null)
    {
      for (const photo of this.member.photos) {
        imageUrl.push({
          small: photo?.url,
          medium: photo?.url,
          big: photo?.url
  
  
        })
      }
    }

    console.log(imageUrl);
    return imageUrl;
  }

  onTabActivated(data:TabDirective)
  {
    this.activeTab =data;
    if(this.activeTab.heading === 'Messages' && this.messages.length === 0)
    {
      this.loadMessages();
    }
  }
  selectTab(tabId:number)
  {
    this.memberTabs.tabs[tabId].active = true;
  }
  loadMessages()
  {
    this._messageService.getMessageThread(this.member.username)
      .subscribe(messages =>
        {
          this.messages = messages;
        })
  }
}
