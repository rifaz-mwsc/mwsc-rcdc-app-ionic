import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Shared } from '../services/shared';
import { AppHeaderComponent } from '../components/app-header/app-header.component';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, AppHeaderComponent,RouterModule],
})
export class Tab4Page implements OnInit {
    reconnections: any[] = [];
    segmentValue = 'first'; 
    private sub!: Subscription;

  constructor(private shared: Shared, private api: ApiService) { }

  ngOnInit() {
  }
   async ionViewWillEnter() {
    // Subscribe to shared data
    this.sub = this.shared.reconnection$.subscribe(list => {
      this.reconnections = list;
    });

    // Load from API only if cache empty
    if (!this.reconnections.length) {
      try {
        const res: any = await this.api.get('reconnection-list');
        if (res?.isSuccessful) {
          await this.shared.setReconnectionList(res);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  ionViewWillLeave() {
    this.sub.unsubscribe(); // prevent memory leaks
  }

}
