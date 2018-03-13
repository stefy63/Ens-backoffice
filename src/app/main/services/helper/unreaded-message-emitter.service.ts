import { Injectable } from '@angular/core';
import {assign} from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UnreadedMessageEmitterService {
  static subject = new BehaviorSubject<ManifestPayload>({channel: 'all', data: null});

  static subscribe(channel: string, next?, error?, complete?) {
    this.subject.filter((payload: ManifestPayload, index: number) => payload.channel == channel)
    .map(payload => payload.data)
    .subscribe(next, error, complete);
  }

  static next(channel, data) {
    this.subject.next( assign<ManifestPayload>({channel: channel}, {data: data}));
  }

}

export interface ManifestPayload {channel: string; data: any; }

