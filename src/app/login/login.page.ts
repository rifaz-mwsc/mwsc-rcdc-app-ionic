import { Component, OnInit } from '@angular/core';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { IonHeader, IonContent } from "@ionic/angular/standalone";
import { IonicModule } from '@ionic/angular'; // ✅ Must import IonicModule
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuController } from '@ionic/angular';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-login',
  standalone: true,  // ✅ Must be true
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = 'DU25852022';
  password: string = 'November@2025';
  loading = false;


  constructor(private menuCtrl: MenuController,private loadingCtrl: LoadingController,
    private api: ApiService, private auth: Auth, private router: Router, private alertCtrl: AlertController) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
  this.menuCtrl.enable(false);
}

ionViewDidLeave() {
  this.menuCtrl.enable(true);
}

  async login() {
      if (!this.username || !this.password) {
    this.api.presentToast('Please enter username and password', 'danger');
    return;
  }
      const loading = await this.loadingCtrl.create({
    message: 'Logging in...',
    spinner: 'crescent'
  });

  await loading.present();
  this.loading = true;
    this.auth.login(this.username, this.password).subscribe({
      next: async (res) => {
        await loading.dismiss();
      this.loading = false;
        console.log('Login success', res);
        this.api.presentToast('Login successful', 'success');
        this.router.navigateByUrl('/tabs/tab1'); // redirect after login
      },
      error: async (err) => {
        await loading.dismiss();
      this.loading = false;
        const alert = await this.alertCtrl.create({
          header: 'Login Failed',
          message: err.error?.error_message || 'Unable to login',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }

}
