
export interface IOperator {

    id: number;
    id_sede: number;
    fk_headquarter: string;
    firstname: string;
    lastname: string;
    login: string;
    pwd: string;
    email: string;
    pwdmail: string;
    grant_level: number;
    token_session: string;
    token_expire_date: string;
    private_room: string;
    videochat_account: string;

}
