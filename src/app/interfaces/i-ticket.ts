
export interface ITicket {
    id: number;
    id_status: number;
    id_operator: number;
    id_service?: number;
    id_user?: number;
    id_category?: number;
    date_time?: Date;
    closed?: number;
    deleted?: number;
    service?: any;
    category?: any;
    status?: any;
    operator?: any;
    user?: any;
    historys?: any[];
    reports?: any[];
    unreaded_messages?: number;
}
