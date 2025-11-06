import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonHeader } from "@ionic/angular/standalone";
import { ActivatedRoute, Router } from '@angular/router';
import { Shared } from '../services/shared';
import { Subscription } from 'rxjs';

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

  constructor(private route: ActivatedRoute, private router: Router, private shared: Shared) { }

  ngOnInit() {
  }
  async ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');

    // Subscribe to live updates
    this.sub = this.shared.disconnection$.subscribe(list => {
      this.disconnection = list.find(i => i.disconnectionNo.toString() === id);
    });
  }

  ionViewWillLeave() {
    this.sub.unsubscribe();
  }

  // -----------------------
  // Action buttons
  // -----------------------
  markAsRead() {
    if (!this.disconnection) return;
    const updated = {
      ...this.disconnection, remarks: [...(this.disconnection.remarks || []), {
        remark: 'Marked as read',
        createdBy: 'AppUser',
        assignedUser: 'AppUser',
        createdOn: new Date().toISOString(),
        disconnectionNo: this.disconnection.disconnectionNo
      }]
    };
    this.shared.updateDisconnection(updated);
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
