import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  busyRequestCount=0;

  constructor(private _spinnerService
    :NgxSpinnerService) { }

  busy()
  {
    this.busyRequestCount++;
    this._spinnerService.show(undefined,
      {
        type:'line-scale-party',
        bdColor:'rgba(255,255,255,0)',
        color:'#333333'
      });
  }

  idle()
  {
    this.busyRequestCount--;
    if(this.busyRequestCount<=0)
    {
      this._spinnerService.hide();
    }
  }
}
