export const environment = {
    production: false,
    hmr: true,
    nav_title: 'Ermes',
    login_title: 'Benvenuti in Ermes!',
    beep_alarm : 'telefono_squillo.wav',



    // Socket.io configuration url
    // ws_url: 'https://preprodttms.3punto6.com',
    ws_url: 'http://localhost',
    ws_path: '/wss',
    ws_port: 9000,

    // API configuration url
    // api_url: 'https://preprodttms.3punto6.com',
    api_url: 'http://localhost',
    api_port: 3030,
    api_suffix: '/api',

    // VideoChat Config
    videoChat_room_suffix: 'Ens_',
    videoChat_server_url: null,
    videoChat_service_url:  'https://whereby.com/comunicaens_op',

    // App Config
    APP_TICKET_RETENTION_DAY: 2,

    HANDLE_ERROR: false,
    rollbar: {
        accessToken: '8d2f6baac31a495c98f6170bc3f9b675',
        captureUncaught: true,
        captureUnhandledRejections: true,
        environment: 'local'
    }
};
