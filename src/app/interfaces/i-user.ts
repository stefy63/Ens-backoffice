
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
}
