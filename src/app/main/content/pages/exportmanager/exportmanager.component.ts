import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import { ITicketCategory } from '../../../../interfaces/i-ticket-category';
import { PhoneValidator } from '../../../services/MaterialValidator/CustomNumericValidator.service';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { ITicketStatus } from '../../../../interfaces/i-ticket-status';
import { ITicketExportRequest } from '../../../../interfaces/i-ticket-export-request';

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

  public numberFormControl = new FormControl('', PhoneValidator.validPhone);

  constructor(
    private storage: LocalStorageService,
    ) {
      this.category = this.storage.getItem('ticket_category');
      this.state = this.storage.getItem('ticket_status');
     }

  ngOnInit() {
  }


  onSubmit(){

    let filter: ITicketExportRequest;
    console.log('FILTRO 1 ---> ', filter);
    // if (this.id_category) {filter.category = this.id_category}
    // if (this.phone_number) {filter.phone = this.phone_number}
    // if (this.start_date) {filter.date_start = this.start_date}
    // if (this.end_date) {filter.date_end = this.end_date}
    // if (this.id_state) {filter.status = this.id_state}

    console.log('FILTRO 2 ---> ', filter);
    
    // this.ticketExportService.get(filter);
    return false;
  }

}
