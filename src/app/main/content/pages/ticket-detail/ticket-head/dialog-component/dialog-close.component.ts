import { Component, Inject } from '@angular/core';
import { ICallType } from '../../../../../../interfaces/i-call-type';
import { ICallResult } from '../../../../../../interfaces/i-call-result';
import { ITicketReport, ITicketReportWithUUID } from '../../../../../../interfaces/i-ticket-report';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorageService } from '../../../../../services/local-storage/local-storage.service';
import { ApiTicketReportService } from '../../../../../services/api/api-ticket-report.service';
import { ToastMessage } from '../../../../../services/toastMessage.service';
import { PhoneValidator } from '../../../../../services/MaterialValidator/CustomNumericValidator.service';
import * as _ from 'lodash';
import { uuidv4 } from '../../../../../services/UuidGenerator';
import { assign } from 'lodash';

@Component({
  selector: 'fuse-dialog-close-ticket',
  templateUrl: './dialog-close-ticket.html',
  styleUrls: ['../ticket-head.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class DialogCloseTicket {
  public call_type: ICallType[];
  public call_result: ICallResult[];
  public ticket_report: ITicketReportWithUUID[];

  private user;
  public formGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogCloseTicket>,
    private storage: LocalStorageService,
    private apiTicketReportService: ApiTicketReportService,
    private toastMessage: ToastMessage,
    // private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.call_type = this.storage.getItem('call_type');
    this.call_result = this.storage.getItem('call_result');
    this.user = this.storage.getItem('user');
    this.ticket_report = this.data.ticket.reports.length > 0 ? _.map(_.cloneDeep(this.data.ticket.reports), (report) => _.assign({}, report, {uuid: uuidv4()})) : [
      {
        uuid: uuidv4(),
        id_ticket: this.data.ticket.id,
        number: '',
        id_call_type: null,
        id_call_result: null
      }
    ];
    this.buildFormControl();
  }

  private buildFormControl(){
    const ctrls: any = {};
    this.ticket_report.forEach((report: ITicketReportWithUUID) => {
      const uuid: string = report.uuid;
      ctrls[`callType${uuid}`] = new FormControl('', Validators.required);
      ctrls[`number${uuid}`] = new FormControl('', [Validators.required, PhoneValidator.validPhone]);
      ctrls[`callResult${uuid}`] = new FormControl('', Validators.required);
    });
    this.formGroup = new FormGroup(ctrls);
  }

  async onYesClick() {
    if (this.formGroup.invalid) {
      return;
    }

    const confirm = await this.toastMessage.warning('Conferma chiusura Ticket?', 'Chiusura ticket da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname);

    if (confirm.value) {
      this.apiTicketReportService.create(this.ticket_report)
        .subscribe(() => {
          this.dialogRef.close('true');
        });
    }
  }

  onAddItem() {
    const uuid: string = uuidv4();
    this.ticket_report.push({
      uuid: uuid,
      id_ticket: this.data.ticket.id,
      number: '',
      id_call_type: null,
      id_call_result: null
    });
    this.formGroup.addControl(`callType${uuid}`, new FormControl('', Validators.required));
    this.formGroup.addControl(`number${uuid}`, new FormControl('', [Validators.required, PhoneValidator.validPhone]));
    this.formGroup.addControl(`callResult${uuid}`, new FormControl('', Validators.required));
  }

  onRemoveItem(index: number) {
    const uuid: string = this.ticket_report[index].uuid;
    this.formGroup.removeControl(`callType${uuid}`);
    this.formGroup.removeControl(`number${uuid}`);
    this.formGroup.removeControl(`callResult${uuid}`);
    this.ticket_report.splice(index, 1);
  }

}

