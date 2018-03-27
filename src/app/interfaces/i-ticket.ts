
export interface ITicket {

    id: number;
    id_service: number;
    id_operator: number;
    id_user: number;
    id_status: number;
    id_category: number;
    phone: string;
    date_time: Date;
    closed: number;
    deleted: number;

    service: any;
    status: any;
    operator: any;
    user: any;
    historys: any[];
}
