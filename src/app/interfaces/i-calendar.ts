
import { Time } from '@angular/common';
import {ITicketService} from '../interfaces/i-ticket-service';

export interface ICalendar {
  id?: number;
  id_service: number;
  time_start: Time;
  time_end: Time;
  weekday_start: number ;
  weekday_end: number;
  monthday_start: number;
  monthday_end: number;
  month_start: number;
  month_end: number;
  service?: ITicketService;
}
