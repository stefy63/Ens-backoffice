import { ITicketService } from './i-ticket-service';
import { ITokenSession } from './i-token-session';
import { IUserData } from './i-userdata';

export interface IUser {

    id: number;
    id_userdata: number;
    username: string;
    password: string;
    isOperator: boolean;
    disabled: boolean;
    date_creations: Date;
    date_update: Date;
    id_role: number;
    id_office: number;
    office: any;
    role: any;
    services: ITicketService;
    token: ITokenSession;
    userdata: IUserData;
}
