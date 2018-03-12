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
        open: 'onTichetOpen',
        close: 'onTichetClose',
        updated: 'onTichetUpdated',
        deleted: 'onTichetDeleted',
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



