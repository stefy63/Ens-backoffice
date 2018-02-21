import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { }

  public setItem(key: string, data: string): void {
      localStorage.setItem(key, JSON.stringify(data));
  }

  public clear(): void {
    localStorage.clear();
  }

  public getItem(key: string): any {
    try {
      const data = JSON.parse(localStorage.getItem('data'));
      return data[key];
    } catch (err) {
      return undefined;
    }
  }
}
