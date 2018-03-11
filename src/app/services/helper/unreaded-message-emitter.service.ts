import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class UnreadedMessageEmitterService {

  // public events = new Subject();
  public events = new BehaviorSubject(1);

  constructor() { }

  subscribe(next?, error?, complete?) {
    return this.events.subscribe(next, error, complete);
  }
  next(event) {
    this.events.next(event);
  }
}

