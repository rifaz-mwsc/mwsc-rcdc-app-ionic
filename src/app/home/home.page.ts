import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppHeaderComponent } from '../components/app-header/app-header.component';
import { ApiService } from '../services/api';
import { Shared } from '../services/shared';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule,AppHeaderComponent],
})
export class HomePage implements OnInit {

requestList: any[] = [];
totalrequestList: number = 0;


  constructor(private api: ApiService, private shared: Shared, private router : Router) { }

    async ionViewWillEnter() {
      this.loadRequests();
      this.shared.meterReaders$.subscribe(readers => {
  console.log('Meter Readers:', readers);
});
  }

  ngOnInit() {
  }
  close() {
    // Close logic here
    // go back to previous page
    this.router.navigate(['/tabs/tab3']);
 
  }
  async loadRequests() {
    try {
      const res: any = await this.api.get('reconnection/request-list');
      if (res?.isSuccessful) {
        this.requestList = res.data || [];
        this.totalrequestList = this.requestList.length;
      } else {
        console.error('Failed to load request list:', res?.message);
      } 
    } catch (err) {
      console.error('Error fetching request list:', err);
    }
  }



}
