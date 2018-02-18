import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ITicket } from '../interfaces/i-ticket';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ApiTicketService {

  private baseUrl: string = environment.api_url + ':' + environment.api_port + environment.api_suffix;

  // private behaviorSubject: any;

  constructor(
    private http: HttpClient,
  ) {
    // this.behaviorSubject = new BehaviorSubject(0);
  }

  public get() {
  // this.behaviorSubject.next(this.http.get<ITicket[]>(this.baseUrl + '/ticket'));
  // return this.behaviorSubject;

    return this.http.get<ITicket[]>(this.baseUrl + '/ticket').map(data => data as ITicket[]);
  }

  public getFromId(id: number) {
    // this.behaviorSubject.next(this.http.get<ITicket[]>(this.baseUrl + '/ticket'));
    // return this.behaviorSubject;

    return this.http.get<ITicket>(this.baseUrl + '/ticket/' + id).map(data => data as ITicket);
  }

}
