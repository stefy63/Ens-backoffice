// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    hmr       : false,

    // Socket.io configuration url
    ws_url: 'http://localhost',
    ws_suffix: '',
    ws_port: 9000,

    // API configuration url
    api_url: 'http://localhost',
    api_port: 3000,
    api_suffix: '/api',
    
};
