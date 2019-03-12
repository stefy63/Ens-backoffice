
export class IUserDataRequest {
    name?: string;
    surname?: string;
}

export class IUserDataResponse {
    name: string;
    surname: string;
    phone: string;
    born_date: Date;
    born_city: string;
    born_province: number;
    gender: number;
    city: string;
    address: string;
    province: number;
    card_number: string;
    fiscalcode: string;
}
