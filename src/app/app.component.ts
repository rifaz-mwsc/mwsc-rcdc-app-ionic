import { Component } from '@angular/core';
import { Auth } from './services/auth'; 
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private auth: Auth, private router: Router) {
    this.checkLogin();
  }

  async checkLogin() {
    const user = await this.auth.getUser();
    if (user) {
      this.router.navigateByUrl('/tabs/tab1');
    } else {
      this.router.navigateByUrl('/login');
    }
  }
    async logout() {
    await Preferences.clear();
    this.router.navigate(['/login']);
  }
}
