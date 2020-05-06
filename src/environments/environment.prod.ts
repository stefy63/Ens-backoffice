export const environment = {
    production: true,
    hmr: false,
    nav_title: 'Ermes',
    login_title: 'Benvenuti in Ermes!',
    beep_alarm : 'beep.wav',


    // Socket.io configuration url
    ws_url: 'http://localhost',
    ws_path: '/wss',
    ws_port: 9000,

    // API configuration url
    api_url: 'http://localhost',
    api_port: 3030,
    api_suffix: '/api',

  // VideoChat Config
  videoChat_room_suffix: 'Ens_',
  videoChat_server_url: null,
  videoChat_service_url:  'https://whereby.com/comunicaens_op',

  // App Config
  APP_TICKET_RETENTION_DAY: 2,

};
