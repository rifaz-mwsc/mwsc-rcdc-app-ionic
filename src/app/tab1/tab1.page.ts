import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // ✅ Import IonicModule
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  RefresherCustomEvent,
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api';
import { Shared } from '../services/shared';
import { AppHeaderComponent } from '../components/app-header/app-header.component';
import { Subscription } from 'rxjs';
import { Auth } from '../services/auth';
import {
  
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonText
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { chevronForward, listCircle } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, AppHeaderComponent],
})
export class Tab1Page {
  disconnections: any[] = [];
  reconnections: any[] = [];
  totalDisconnections: number = 0;
  totalReconnections: number = 0;
  user: any = null;
  private discSub!: Subscription;
  private reconSub!: Subscription;

    handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      this.loadDisconnections();
      event.target.complete();
    }, 2000);
  }

  constructor(private api: ApiService, private shared: Shared, private auth: Auth) {
    addIcons({ chevronForward, listCircle });
  }

  async ngOnInit() {
    this.user = await this.auth.getUser();
    console.log('User:', this.user);
  }


  async ionViewWillEnter() {
        try {
      // Fetch from API
      const res: any = await this.api.get('employee/meter-readers');

      // Store in shared service
      if (Array.isArray(res)) {
        await this.shared.setMeterReaders(res);
      }
    } catch (err) {
      console.error('Failed to fetch meter readers:', err);
    }
  
    // Subscribe to shared data
    this.discSub = this.shared.disconnection$.subscribe(list => {
      this.disconnections = list;
      this.totalDisconnections = list.length;
    });
      // Subscribe to reconnections
    this.reconSub = this.shared.reconnection$.subscribe(list => {
      this.reconnections = list;
      this.totalReconnections = list.length;
      console.log('Reconnections updated:', list);
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
    // Load reconnections if empty
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

  async loadDisconnections() {
    try {
      const res: any = await this.api.get('disconnection-list');
      if (res?.isSuccessful) {
        await this.shared.setDisconnectionList(res);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async loadReconnections() {
    try {
      const res: any = await this.api.get('reconnection-list');
      if (res?.isSuccessful) {
        await this.shared.setReconnectionList(res);
      }
    } catch (err) {
      console.error(err);
    }
  }

  ionViewWillLeave() {
    this.discSub.unsubscribe(); // prevent memory leaks
    this.reconSub.unsubscribe(); // prevent memory leaks
  }
}
