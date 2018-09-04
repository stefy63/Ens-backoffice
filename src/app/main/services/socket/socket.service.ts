import {Injectable} from '@angular/core';
import {Socket} from 'ng-socket-io';
import {LocalStorageService} from '../local-storage/local-storage.service';


@Injectable()
export class SocketService {

  constructor(
    private socket: Socket,
    private storage: LocalStorageService
  ) {
    socket.on('disconnect', () => {
      const token = this.storage.getItem('token');
      this.sendMessage(
        'welcome-message',
        {
            userToken: token.token_session,
            idUser: token.id_user,
            status: 'READY',
            userType: 'OPERATOR'
        });
    });
  }

  public sendMessage(messageName: string, msg: any) {
    this.socket.emit(messageName, msg);
  }

  public getMessage(event: string) {
    return this.socket
      .fromEvent(event);
  }

  public removeListener(event: string) {
    this.socket.removeListener(event);
  }

}
