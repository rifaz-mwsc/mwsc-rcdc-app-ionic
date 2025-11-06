import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { NotificationModalComponent } from '../notification-modal/notification-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,               // ✅ Make it standalone
  imports: [IonicModule, CommonModule, ], // ✅ Import needed modules
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent {

  constructor(private router: Router, private modalCtrl: ModalController) {}


    async openModal(data?: any) {
    const modal = await this.modalCtrl.create({
      component: NotificationModalComponent,
      componentProps: { data }
    });
    return await modal.present();
  }

  openNotifications() {
    this.openModal('notifications');
  }
}
