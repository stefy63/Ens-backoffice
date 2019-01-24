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
import { MatDatepickerInputEvent, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { ToastOptions } from '../../../../type/toast-options';
import { NotificationsService } from 'angular2-notifications';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { ITicketService } from '../../../../interfaces/i-ticket-service';
import { ITicketOffice } from '../../../../interfaces/i-ticket-office';

@Component({
  selector: 'fuse-exportmanager',
  templateUrl: './exportmanager.component.html',
  styleUrls: ['./exportmanager.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'it-IT' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },

  ]
})

export class ExportmanagerComponent implements OnInit {

  public categories: ITicketCategory[];
  public statuses: ITicketStatus[];
  public services: ITicketService[];
  public offices: ITicketOffice[];
  public id_category: number;
  public id_state: number;
  public id_office: number;
  public id_service: number;
  public phone_number: string;
  public MINstartAt = moment(new Date()).subtract(180, 'day').toDate();
  public MAXendAt = new Date();
  public start_date = new FormControl(moment().subtract(31, 'day').toDate());
  public end_date = new FormControl(new Date());
  public numberFormControl = new FormControl('', PhoneValidator.validPhone);
  public isValidForm = true;
  public options = ToastOptions;

  constructor(
    private storage: LocalStorageService,
    private ticketExportService: ApiTicketReportService,
    private spinner: NgxSpinnerService,
    private toast: NotificationsService,
    private adapter: DateAdapter<any>
  ) {
    this.categories = this.storage.getItem('ticket_category');
    this.statuses = this.storage.getItem('ticket_status');
    this.services = this.storage.getItem('services');
    this.offices = this.storage.getItem('offices');
    this.adapter.setLocale('it');
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

    if (this.id_category) { filter.category = this.id_category; }
    if (this.phone_number) { filter.phone = this.phone_number.trim(); }
    if (this.start_date) { filter.date_start = moment(this.start_date.value).format('YYYY-MM-DD 00:00:00'); }
    if (this.end_date) { filter.date_end = moment(this.end_date.value).format('YYYY-MM-DD 23:59:59'); }
    if (this.id_state) { filter.status = this.id_state; }
    if (this.id_office) { filter.id_office = this.id_office; }
    if (this.id_service) { filter.id_service = this.id_service; }

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
