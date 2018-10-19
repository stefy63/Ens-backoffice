export interface ITicketReport {
  id_ticket: number;
  number: string;
  id_call_type: number;
  id_call_result: number;
}

export interface ITicketReportWithUUID extends ITicketReport {
  uuid: string;
}
