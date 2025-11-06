import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonImg,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss'],
  standalone: true,
    imports: [IonIcon, 
    IonButton,
    IonButtons,
    IonContent,
    IonItem,
    IonIcon,
    IonLabel,
    IonList,
    IonTitle,
    IonToolbar,
  ],
})
export class NotificationModalComponent  implements OnInit {
  @Input() data: any;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}
    closeModal() {
    this.modalCtrl.dismiss();
  }

}
