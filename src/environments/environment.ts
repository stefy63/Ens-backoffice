// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    hmr       : false,

    // Socket.io configuration url
    ws_url: 'https://devens2.3punto6.com',
    // ws_url: 'http://localhost',
    ws_path: '/wss',
    ws_port: null,

    // API configuration url
    api_url: 'https://devens2.3punto6.com',
    // api_url: 'http://localhost',
    api_port: null,
    api_suffix: '/api',

    // VideoChat Config
    videoChat_room_suffix: 'Ens_',
    videoChat_server_url: null,
};
