enum status {NEW, ONLINE, PENDING, CLOSED, ARCHIVED}

export class ITicketStatus {

    id: number;
    status: status;
}
