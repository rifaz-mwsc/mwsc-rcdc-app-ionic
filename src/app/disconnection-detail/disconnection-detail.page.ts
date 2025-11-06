import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonHeader } from "@ionic/angular/standalone";
import { ActivatedRoute, Router } from '@angular/router';
import { Shared } from '../services/shared';
import { Subscription } from 'rxjs';
import { ApiService } from '../services/api';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-disconnection-detail',
  templateUrl: './disconnection-detail.page.html',
  styleUrls: ['./disconnection-detail.page.scss'],
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    IonicModule],
})
export class DisconnectionDetailPage implements OnInit {
  disconnection: any = null;
  private sub!: Subscription;
  balanceData: any = null;
  loading = false;

  constructor(private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private shared: Shared,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController

  ) { }

  ngOnInit() {
  }
  async ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');

    // Subscribe to live updates
    this.sub = this.shared.disconnection$.subscribe(list => {
      this.disconnection = list.find(i => i.disconnectionNo.toString() === id);
    });
  }
  async loadBalance() {
    this.loading = true;

    try {
      this.balanceData = await this.api.getCustomerBalance(this.disconnection?.contract.id);
      console.log('Balance Data:', this.balanceData);
    } catch (err) {
      console.error('Balance fetch failed', err);
    }

    this.loading = false;
  }

  ionViewWillLeave() {
    this.sub.unsubscribe();
  }

  // -----------------------
  // Action buttons
  // -----------------------
  async confirmComplete() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Are you sure you want to mark this disconnection as completed?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Yes',
          handler: () => this.markAsRead() // ✅ call complete() only after confirm
        }
      ]
    });

    await alert.present();
  }
  async markAsRead() {
    if (!this.disconnection) return;
    this.loading = true;
    const disconnectionNo = this.disconnection.disconnectionNo;
    try {
      const success = await this.api.markDisconnectionComplete(disconnectionNo);
      if (success) {
         this.api.presentToast('Disconnection marked as completed ✅', 'success');
        this.loading = false;
        const updated = {
          ...this.disconnection,
          sapStatus: 'COMP',
        };

        console.log('Disconnection marked as complete on server.');
        await this.shared.updateDisconnection(updated);

        console.log("✅ Disconnection marked COMPLETE");
      }
      else {
        console.error('Failed to mark disconnection as complete on server.');
         this.api.presentToast('Unable to complete disconnection', 'danger');
        this.loading = false;
      }
    } catch (error) {
      this.loading = false;
      this.api.presentToast("Unable to complete disconnection", 'danger');
      console.error("Complete API Error:", error);
    }

    // const updated = {
    //   ...this.disconnection, remarks: [...(this.disconnection.remarks || []), {
    //     remark: 'Marked as read',
    //     createdBy: 'AppUser',
    //     assignedUser: 'AppUser',
    //     createdOn: new Date().toISOString(),
    //     disconnectionNo: this.disconnection.disconnectionNo
    //   }]
    // };
    // this.shared.updateDisconnection(updated);
  }

  disconnect() {
    if (!this.disconnection) return;
    const updated = { ...this.disconnection, isDisconnected: true, disconnectedOn: new Date().toISOString() };
    this.shared.updateDisconnection(updated);
  }

  addRemark() {
    const text = prompt('Enter remark:');
    if (!text) return;
    const updated = {
      ...this.disconnection, remarks: [...(this.disconnection.remarks || []), {
        remark: text,
        createdBy: 'AppUser',
        assignedUser: 'AppUser',
        createdOn: new Date().toISOString(),
        disconnectionNo: this.disconnection.disconnectionNo
      }]
    };
    this.shared.updateDisconnection(updated);
  }

}
