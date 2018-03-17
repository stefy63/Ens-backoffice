import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { }

  public setItem(key: string, data: string): void {
      sessionStorage.setItem(key, JSON.stringify(data));
  }

  public clear(): void {
    sessionStorage.clear();
  }

  public getKey(key: string): any {
    try {
      const data = JSON.parse(sessionStorage.getItem(key));
      return data;
    } catch (err) {
      return undefined;
    }
  }

  public getItem(key: string): any {
    try {
      const data = JSON.parse(sessionStorage.getItem('data'));
      return data[key];
    } catch (err) {
      return undefined;
    }
  }
}