import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Shared {
  private disconnectionList: any = null; // in-memory cache
  private reconnectionList: any = null; // in-memory cache
  // BehaviorSubject to store disconnections list
  private disconnectionSubject = new BehaviorSubject<any[]>([]);
  disconnection$ = this.disconnectionSubject.asObservable();

  private reconnectionSubject = new BehaviorSubject<any[]>([]);
  reconnection$ = this.reconnectionSubject.asObservable();

  private meterReadersSubject = new BehaviorSubject<any[]>([]);
  meterReaders$ = this.meterReadersSubject.asObservable();


  constructor() {
    this.loadDisconnectionListFromPreferences();
        this.loadMeterReaders();
        this.loadReconnectionListFromPreferences();
  }
    private async loadMeterReaders() {
    const { value } = await Preferences.get({ key: 'meterReaders' });
    if (value) {
      this.meterReadersSubject.next(JSON.parse(value));
    }
  }

  // Save meter readers to storage + emit
  async setMeterReaders(data: any[]) {
    await Preferences.set({
      key: 'meterReaders',
      value: JSON.stringify(data)
    });
    this.meterReadersSubject.next(data);
  }

  // Clear cache
  async clearMeterReaders() {
    await Preferences.remove({ key: 'meterReaders' });
    this.meterReadersSubject.next([]);
  }

  async setDisconnectionList(data: any) {
    this.disconnectionList = data; // in-memory cache
    try {
      await Preferences.set({
        key: 'disconnectionList',
        value: JSON.stringify(data) // persist
      });
         this.disconnectionSubject.next(data.items); // emit
    } catch (err) {
      console.error('Failed to save data in Preferences', err);
    }
  }
  // Load from Preferences on app start
  private async loadDisconnectionListFromPreferences() {
    try {
      const stored = await Preferences.get({ key: 'disconnectionList' });
      if (stored.value) {
        const data = JSON.parse(stored.value);
        this.disconnectionSubject.next(data.items); // emit to all subscribers
      }
    } catch (err) {
      console.error('Failed to load cached data', err);
    }
  }

  async setReconnectionList(data: any) {
    this.reconnectionList = data; // in-memory cache
    try {
      await Preferences.set({
        key: 'reconnectionList',
        value: JSON.stringify(data)
      });
      this.reconnectionSubject.next(data.items); // emit
    } catch (err) {
      console.error('Failed to save data in Preferences', err);
    }
  }

  // Load from Preferences on app start
  private async loadReconnectionListFromPreferences() {
    try {
      const stored = await Preferences.get({ key: 'reconnectionList' });
      if (stored.value) {
        const data = JSON.parse(stored.value);
        this.reconnectionSubject.next(data.items); // emit to all subscribers
      }
    } catch (err) {
      console.error('Failed to load cached data', err);
    }
  }

  // -------------------------------
  // Get data (first from memory, else load from Preferences)
  // -------------------------------
  // async getDisconnectionList(): Promise<any> {
  //   if (this.disconnectionList) {
  //     return this.disconnectionList; // return memory cache
  //   }

  //   // Load from Preferences if memory cache is empty
  //   try {
  //     const stored = await Preferences.get({ key: 'disconnectionList' });
  //     if (stored.value) {
  //       this.disconnectionList = JSON.parse(stored.value);
  //       return this.disconnectionList;
  //     }
  //   } catch (err) {
  //     console.error('Failed to load cached data', err);
  //   }

  //   return null; // nothing found
  // }
   // Update a single disconnection by disconnectionNo
  updateDisconnection(updatedItem: any) {
    const current = this.disconnectionSubject.value;
    const index = current.findIndex(i => i.disconnectionNo === updatedItem.disconnectionNo);
    if (index !== -1) {
      current[index] = updatedItem;
      this.disconnectionSubject.next([...current]); // emit updated array
      // Update Preferences
      Preferences.set({
        key: 'disconnectionList',
        value: JSON.stringify({ totalCount: current.length, items: current, isSuccessful: true })
      });
    }
  }

  // -------------------------------
  // Clear cache (memory + Preferences)
  // -------------------------------
  async clearDisconnectionList() {
    this.disconnectionList = null;
    try {
      await Preferences.remove({ key: 'disconnectionList' });
    } catch (err) {
      console.error('Failed to clear cached data', err);
    }
  }

}
