
export interface ITicketExportRequest {
    id_office?: number;
    id_service?: number;
    category?: number;
    phone?: string;
    date_start?: string;
    date_end?: string;
    status?: number;
}
