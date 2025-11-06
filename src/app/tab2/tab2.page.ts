import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Shared } from '../services/shared';
import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
import { IonSegmentContent, IonSegmentView } from '@ionic/angular/standalone';
import { AppHeaderComponent } from '../components/app-header/app-header.component';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
    standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, AppHeaderComponent,RouterModule],
})
export class Tab2Page {
  disconnections: any[] = [];
    segmentValue = 'first'; 
    private sub!: Subscription;

  constructor(private shared: Shared, private api: ApiService) {}

  async ionViewWillEnter() {
    // Subscribe to shared data
    this.sub = this.shared.disconnection$.subscribe(list => {
      this.disconnections = list;
    });

    // Load from API only if cache empty
    if (!this.disconnections.length) {
      try {
        const res: any = await this.api.get('disconnection-list');
        if (res?.isSuccessful) {
          await this.shared.setDisconnectionList(res);
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
