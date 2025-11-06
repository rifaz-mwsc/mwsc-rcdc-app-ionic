import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Auth } from '../services/auth';
import { ModalController, IonList, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton } from '@ionic/angular';
import { Shared } from '../services/shared';
import { Router, RouterModule } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-meter-readers-modal',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-title>Meter Readers</ion-title>
      <ion-buttons slot="end">
        <ion-button (click)="close()">Close</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-list>
      <ion-item *ngFor="let reader of meterReaders">
        <ion-label>
          <h2>{{ reader.employeeName }}</h2>
          <p>ID: {{ reader.employeeId }} | Meter Reader: {{ reader.meterReaderId }}</p>
        </ion-label>
      </ion-item>
    </ion-list>
  </ion-content>
  `
})
export class MeterReadersModalComponent {
  @Input() meterReaders: any[] = [];

  constructor(private modalCtrl: ModalController) {}

  close() {
    this.modalCtrl.dismiss();
  }
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
})
export class Tab3Page {
  user: any = null;
  meterReaders: any[] = [];

  constructor(
    private auth: Auth,
    private shared: Shared,
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  async ngOnInit() {
    this.user = await this.auth.getUser();
    console.log('User:', this.user);
        this.shared.meterReaders$.subscribe(list => {
      this.meterReaders = list;
    });
  }
    async openMeterReadersModal() {
    const modal = await this.modalCtrl.create({
      component: MeterReadersModalComponent,
      componentProps: { meterReaders: this.meterReaders }
    });
    await modal.present();
  }

  
  async logout() {
    await Preferences.clear();
    this.router.navigate(['/login']);
  }



}
