import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class Storage {


  constructor() { }

  // Save any data
  async set(key: string, value: any): Promise<void> {
    await Preferences.set({ key, value: JSON.stringify(value) });
  }

  // Get stored data
  async get(key: string): Promise<any | null> {
    const { value } = await Preferences.get({ key });
    return value ? JSON.parse(value) : null;
  }

  // Remove a key
  async remove(key: string): Promise<void> {
    await Preferences.remove({ key });
  }

  // Clear all stored keys
  async clear(): Promise<void> {
    await Preferences.clear();
  }
}
