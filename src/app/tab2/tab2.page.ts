import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Shared } from '../services/shared';
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
    searchTerm: string = '';
    loading = true;

filteredList: any[] = [];

  constructor(private shared: Shared, private api: ApiService) {}

  async ionViewWillEnter() {
    // Subscribe to shared data
    this.loading = true;

    this.sub = this.shared.disconnection$.subscribe(list => {
      this.disconnections = list;
      this.filteredList = [...this.disconnections];
      this.loading = false;
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
        this.loading=false;
      }
    }
  }
  filterData() {
  const term = this.searchTerm.toLowerCase();

  let list = [...this.disconnections];

  // ✅ Apply segment filter
  if (this.segmentValue === 'second') {
    list = list.filter(x => x.sapStatus?.toLowerCase() === 'pending');
  } 

  if (this.segmentValue === 'third') {
    list = list.filter(x => x.isCompleted === true);
  }
    // ✅ Apply search filter
  this.filteredList = list.filter(item =>
       item.contract.contractAccount.businessPartner.name?.toLowerCase().includes(term) ||
       item.contract.meter.id?.toString().includes(term) ||
       item.disconnectionNo?.toString().includes(term) ||
       item.tarifGroup?.toLowerCase().includes(term)
  );
}

  ionViewWillLeave() {
    this.sub.unsubscribe(); // prevent memory leaks
  }

}
