
export interface ITicketMapped {

    id: number;
    id_operator: number;
    id_user: number;
    phone: string;
    date_time: Date;
    closed: number;
    deleted: number;

    operator_name: string;
    operator_surname: string;
    user_name: string;
    user_surname: string;
    service: string;
    status: string;
    historys: any[];
}
