import { Component, ChangeDetectionStrategy  } from '@angular/core';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import * as _ from 'lodash';
import { IDefaultDialog } from '../../../../../interfaces/i-defaul-dialog';
import { UnreadedMessageEmitterService } from '../../../../services/helper/unreaded-message-emitter.service';

@Component({
  selector: 'fuse-ticket-note',
  templateUrl: './ticket-note.component.html',
  styleUrls: ['./ticket-note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketNoteComponent {
  public defaultDialog: IDefaultDialog;

  constructor(
    private storage: LocalStorageService,
  ) {
    this.defaultDialog =  _.orderBy(this.storage.getItem('default_dialog'), 'ordine');
  }

  onSelectChange(elem) {
    UnreadedMessageEmitterService.next('fast-reply-message', elem);
  }
}
