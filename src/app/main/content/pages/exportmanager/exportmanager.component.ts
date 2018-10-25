import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import { ITicketCategory } from '../../../../interfaces/i-ticket-category';
import { PhoneValidator } from '../../../services/MaterialValidator/CustomNumericValidator.service';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { ITicketStatus } from '../../../../interfaces/i-ticket-status';
import { ITicketExportRequest } from '../../../../interfaces/i-ticket-export-request';
import { ApiTicketReportService } from '../../../services/api/api-ticket-report.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDatepickerInputEvent, MAT_DATE_LOCALE } from '@angular/material';
import { ToastOptions } from '../../../../type/toast-options';
import { NotificationsService } from 'angular2-notifications';


@Component({
  selector: 'fuse-exportmanager',
  templateUrl: './exportmanager.component.html',
  styleUrls: ['./exportmanager.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' }
  ]
})
export class ExportmanagerComponent implements OnInit {

  public category: ITicketCategory[];
  public state: ITicketStatus[];
  public id_category: number;
  public id_state: number;
  public phone_number: string;
  public startAt = moment(new Date()).subtract(31, 'day').toDate();
  public endAt = new Date();
  public start_date = new FormControl(moment().subtract(31, 'day').toDate());
  public end_date = new FormControl(new Date());
  public activeSpinner = false;
  public numberFormControl = new FormControl('', PhoneValidator.validPhone);
  public isValidForm = true;
  public options = ToastOptions;

  constructor(
    private storage: LocalStorageService,
    private ticketExportService: ApiTicketReportService,
    private spinner: NgxSpinnerService,
    private toast: NotificationsService
  ) {
    this.category = this.storage.getItem('ticket_category');
    this.state = this.storage.getItem('ticket_status');
  }

  ngOnInit() {
  }


  onSubmit() {
    if (!this.start_date.valid || !this.end_date.valid) {
      this.toast.error('Errore Date', 'Data non valida!');
      return;
    }
    const filter: ITicketExportRequest = {};
    this.spinner.show();

    if (!!this.id_category) { filter.category = this.id_category; }
    if (!!this.phone_number) { filter.phone = this.phone_number.trim(); }
    if (!!this.start_date) { filter.date_start = moment(this.start_date.value).format('YYYY-MM-DD'); }
    if (!!this.end_date) { filter.date_end = moment(this.end_date.value).format('YYYY-MM-DD'); }
    if (!!this.id_state) { filter.status = this.id_state; }

    this.ticketExportService.get(filter).subscribe(data => {
      const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
      a.href = window.URL.createObjectURL(data.file);
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      this.spinner.hide();
      this.toast.success('Download File!', 'Operazione conclusa!');
    });
    return;
  }

  addEvent(event: MatDatepickerInputEvent<Date>) {
    this.isValidForm = this.start_date.valid && this.end_date.valid;
  }

}
