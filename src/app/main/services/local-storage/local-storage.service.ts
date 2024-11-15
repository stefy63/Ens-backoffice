import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  private storage = sessionStorage;

  constructor() { }

  public setItem(key: string, data: string): void {
    this.storage.setItem(key, JSON.stringify(data));
  }

  public clear(): void {
    this.storage.clear();
  }

  public getKey(key: string): any {
    try {
      const data = JSON.parse(this.storage.getItem(key));
      return data;
    } catch (err) {
      return undefined;
    }
  }

  public getItem(key: string): any {
    try {
      const data = JSON.parse(this.storage.getItem('data'));
      return data[key];
    } catch (err) {
      return undefined;
    }
  }

  public setDataItem(key: string, value: any): void {
      const data = JSON.parse(this.storage.getItem('data'));
      data[key] = value;
      this.storage.setItem('data', JSON.stringify(data));
  }

}
