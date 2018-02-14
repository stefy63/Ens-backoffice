import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Dictionary} from 'lodash';
import {SocketService} from './socket.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';

@Injectable()
export class ReactiveHttpClientService {

  constructor(private http: HttpClient, private socketService: SocketService) {
  }

  get<T>(uri: string, params?: Dictionary<string>, headers?: Dictionary<string>): Observable<T> {
    return this.socketService.getMessage('update').startWith('')
      .flatMap(() => this.http.get<T>(uri, {
        headers: headers,
        params: params
      }));
  }
}
