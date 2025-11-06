import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { firstValueFrom } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'https://rcdc-api-uat-01.mwsc.com.mv/v1';

  constructor(private http: HttpClient, private toastController: ToastController, private auth: Auth) {}

  async getToken(): Promise<string | null> {
    const stored = await Preferences.get({ key: 'accessToken' });
    return stored.value;
  }
  //   async getRefreshToken(): Promise<string | null> {
  //   const token = await Preferences.get({ key: 'refreshToken' });
  //   return token.value;
  // }
async showToast(message: string) {
  const toast = await this.toastController.create({
    message,
    duration: 2000,
    color: 'danger'
  });
  toast.present();
}

 async get(path: string) {
  let token = await this.getToken();

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  try {
    return await firstValueFrom(this.http.get(`${this.baseUrl}/${path}`, { headers }));
    
  } catch (error: any) {
    // Check if error is 401 → token expired
    if (error.status === 401) {
      console.warn('Token expired, refreshing...');

      try {
        await this.auth.refreshToken(); // refresh tokens
        token = await this.getToken(); // get updated token

        // Retry original request with new token
        const newHeaders = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        return await firstValueFrom(
          this.http.get(`${this.baseUrl}/${path}`, { headers: newHeaders })
        );
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
        throw refreshError;
      }
    } else {
      console.error('Service GET error:', error);
      throw error;
    }
  }
}

}
