import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { Member } from 'src/app/models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  member: Member | any;
  galleryOptions: NgxGalleryOptions[] | any;
  galleryImages: NgxGalleryImage[] |any;

  constructor(private _memberService: MembersService,
    private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember();
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

  }

  loadMember() {
    this._memberService.getMember(this._route.snapshot.paramMap.get('username') ?? "").subscribe(mem => 
      {
        this.member = mem;
        this.galleryImages = this.getImages();
        //console.log("member="+ JSON.stringify(this.member));     
      }
        
      );

    
  }

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

}
