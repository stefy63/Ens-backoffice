import { ITicketHistoryType } from './i-ticket-history-type';

export class ITicketHistory {

    id?: number;
    id_ticket: number;
    id_type: number;
    action: string;
    date_time?: string;
    readed?: number;
    type?: ITicketHistoryType;
}
