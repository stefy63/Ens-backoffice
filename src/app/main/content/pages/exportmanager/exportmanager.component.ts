import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import { ITicketCategory } from '../../../../interfaces/i-ticket-category';
import { PhoneValidator } from '../../../services/MaterialValidator/CustomNumericValidator.service';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ITicketStatus } from '../../../../interfaces/i-ticket-status';

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
  public startAt = moment(new Date()).subtract(180, 'day').toDate();
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
    console.log(this.id_category, this.phone_number, this.start_date.toLocaleDateString('it-IT'), this.end_date.toLocaleDateString('it-IT'), this.id_state);
    return false;
  }
}
