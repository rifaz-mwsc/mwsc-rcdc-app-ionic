import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private BASE_URL = 'https://rcdc-api-uat-01.mwsc.com.mv/';
  private LOGIN_URL = this.BASE_URL + 'auth/login';
  private REFRESH_URL = this.BASE_URL + 'auth/refresh';

  constructor(private http: HttpClient) {

  }
    // Login API call
   login(username: string, password: string, device: string = 'test device', client: string = 'web'): Observable<any> {
    const formData = new FormData();
    formData.append('domainUsername', username);
    formData.append('password', password);
    formData.append('device', device);
    formData.append('client', client);

    return this.http.post(this.LOGIN_URL, formData).pipe(
      tap(async (res: any) => {
        // Save tokens & user data in Preferences
        await Preferences.set({ key: 'accessToken', value: res.accessToken });
        await Preferences.set({ key: 'refreshToken', value: res.refreshToken });
        await Preferences.set({ key: 'user', value: JSON.stringify(res) });
      })
    );
  }

  // Get access token
  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: 'accessToken' });
    return value;
  }
    async getRefreshToken(): Promise<string | null> {
    const token = await Preferences.get({ key: 'refreshToken' });
    return token.value;
  }
    // Refresh token method
  async refreshToken(): Promise<void> {
    const accessToken = await this.getToken();
    const refreshToken = await this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      throw new Error('No token available for refresh.');
    }

    try {
      const body = { accessToken, refreshToken };
      const res: any = await firstValueFrom(
        this.http.post(this.REFRESH_URL, body)
      );

      if (res.accessToken && res.refreshToken) {
        // Save new tokens
        await Preferences.set({ key: 'accessToken', value: res.accessToken });
        await Preferences.set({ key: 'refreshToken', value: res.refreshToken });
      } else {
        throw new Error('Invalid refresh response');
      }
    } catch (error) {
      console.error('Refresh token failed', error);
      throw error;
    }
  }

  // Get stored user info
  async getUser(): Promise<any | null> {
    const { value } = await Preferences.get({ key: 'user' });
    return value ? JSON.parse(value) : null;
  }

  // Logout: remove all stored keys
  async logout(): Promise<void> {
    await Preferences.remove({ key: 'accessToken' });
    await Preferences.remove({ key: 'refreshToken' });
    await Preferences.remove({ key: 'user' });
  }
}
