import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Shared } from '../services/shared';
import { Subscription } from 'rxjs';
import { IonHeader } from "@ionic/angular/standalone";`
`

@Component({
  selector: 'app-reconnection-detail',
  templateUrl: './reconnection-detail.page.html',
  styleUrls: ['./reconnection-detail.page.scss'],
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    IonicModule],
  
})
export class ReconnectionDetailPage implements OnInit {
  reconnection: any = null;
  private sub!: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private shared: Shared) { }

  ngOnInit() {
  }
  async ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');

    // Subscribe to live updates
    this.sub = this.shared.reconnection$.subscribe(list => {
      this.reconnection = list.find(i => i.disconnectionNo.toString() === id);
    });
  }

  ionViewWillLeave() {
    this.sub.unsubscribe();
  }
  

   

  reconnect() {
    if (!this.reconnection) return;
    const updated = { ...this.reconnection, isReconnected: true, reconnectedOn: new Date().toISOString() };
    console.log('Reconnecting with data:', updated);
    this.shared.updateReconnection(updated);
  }
    markAsRead() {
    if (!this.reconnection) return;
    const updated = {
      ...this.reconnection, remarks: [...(this.reconnection.remarks || []), {
        remark: 'Marked as read',
        createdBy: 'AppUser',
        assignedUser: 'AppUser',
        createdOn: new Date().toISOString(),
        disconnectionNo: this.reconnection.disconnectionNo
      }]
    };
    console.log('Marking as read with data:', updated);
    this.shared.updateReconnection(updated);
  }
  
   addRemark() {
    const text = prompt('Enter remark:');
    if (!text) return;
    const updated = {
      ...this.reconnection, remarks: [...(this.reconnection.remarks || []), {
        remark: text,
        createdBy: 'AppUser',
        assignedUser: 'AppUser',
        createdOn: new Date().toISOString(),
        disconnectionNo: this.reconnection.disconnectionNo
      }]
    };
    this.shared.updateReconnection(updated);
  }

}
