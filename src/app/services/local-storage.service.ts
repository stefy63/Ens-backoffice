import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { }

  public setItem(key: string, data: string): void {
      localStorage.setItem(key, data);
  }

  public clear(): void {
    localStorage.clear();
  }

  public getItem(key: string): string {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      return undefined;
    }
  }
}
