enum service {CHAT, SMS, MAIL, SOCIAL}

export interface ITicketService {

    id: number;
    service: service;
    deleted: boolean;
}
