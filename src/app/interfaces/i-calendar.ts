
import { ITicketService } from '../interfaces/i-ticket-service';

export interface ICalendar {
  id?: string;
  id_service: number;
  time_start: string;
  time_end: string;
  weekday_start: number ;
  weekday_end: number;
  monthday_start: number;
  monthday_end: number;
  month_start: number;
  month_end: number;
  service?: ITicketService;
}
