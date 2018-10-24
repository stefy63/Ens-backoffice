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
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
  selector: 'fuse-exportmanager',
  templateUrl: './exportmanager.component.html',
  styleUrls: ['./exportmanager.component.scss']
})
export class ExportmanagerComponent implements OnInit {

  public category: ITicketCategory[];
  public state: ITicketStatus[];
  public id_category: number;
  public id_state: number;
  public phone_number: string;
  public startAt = moment(new Date()).subtract(90, 'day').toDate();
  public endAt = new Date();
  public start_date = moment().subtract(90, 'day').toDate();
  public end_date = new Date();
  public activeSpinner = false;
  public numberFormControl = new FormControl('', PhoneValidator.validPhone);
  public isValidForm = true;

  constructor(
    private storage: LocalStorageService,
    private ticketExportService: ApiTicketReportService,
    private spinner: NgxSpinnerService
    ) {
      this.category = this.storage.getItem('ticket_category');
      this.state = this.storage.getItem('ticket_status');
     }

  ngOnInit() {
  }


  onSubmit(){
    if (!this.start_date || !this.end_date) {
      console.log('data errata');
      return;
    }
    const filter: ITicketExportRequest = {};
    this.spinner.show();

    if (!!this.id_category) {filter.category = this.id_category; }
    if (!!this.phone_number) {filter.phone = this.phone_number; }
    if (!!this.start_date) {filter.date_start = moment(this.start_date).format('YYYY-MM-DD'); }
    if (!!this.end_date) {filter.date_end = moment(this.end_date).format('YYYY-MM-DD'); }
    if (!!this.id_state) {filter.status = this.id_state; }

    this.ticketExportService.get(filter).subscribe(data => {
      this.spinner.hide();
      const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
      a.href = window.URL.createObjectURL(data.file);
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
    });
    return;
  }

  addEvent(event: MatDatepickerInputEvent<Date>) {
    this.isValidForm = (event.value) ?  true : false;
  }

}
