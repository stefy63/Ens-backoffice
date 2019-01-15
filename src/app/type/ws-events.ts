export const WsEvents = {
    operator: {
        login: 'onOperatorLogin',
        logout: 'onOperatorLogout',
    },
    user: {
        login: 'onUserLogin',
        logout: 'onUserLogout',
    },
    ticket: {
        create: 'onTicketCreate',
        open: 'onTicketOpen',
        close: 'onTicketClose',
        updated: 'onTicketUpdated',
        deleted: 'onTicketDeleted',
    },
    ticketHistory: {
        create: 'onTicketHistoryCreate',
        updated: 'onTichetHistoryUpdated',
    },
    serverMessage: {
        connect: 'connect',
        disconnect: 'connection-close',
        welcome: 'welcome-message'
    }
};



