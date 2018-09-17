// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    hmr       : false,
    nav_title : 'Ermes',
    login_title : 'Benvenuti in Ermes!',

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

    // App Config
    APP_TICKET_RETENTION_DAY: 2,
};
