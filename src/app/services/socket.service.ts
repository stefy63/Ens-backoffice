import {Injectable} from '@angular/core';
import {SocketIoModule, Socket} from 'ng-socket-io';


@Injectable()
export class SocketService {

  constructor(private socket: Socket) {
  }

  public sendMessage(messageName: string, msg: any) {
    this.socket.emit(messageName, msg);
  }

  public getMessage(event: string) {
    return this.socket
      .fromEvent(event)
      // .map( data => data.msg )
      ;
  }
}
