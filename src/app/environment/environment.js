const env = process.env.NODE_ENV;
const app_mode = env ? env.trim() : "development";
console.log("env", env, process.env)

const environment = {
    development: {
        base_url: 'http://localhost:5000/api',
        websocket_url:'http://localhost:8000',
        base_url_front: '',
        paystack_api_key:'pk_test_18e1b66031dc64ef4cc27827419428bac31851e1',
        mapbox_token:'pk.eyJ1IjoiZ3JheWV5LWVtbXMiLCJhIjoiY2txODMzb2ZoMGM3ZzJvb2FnN3FpM2dpdyJ9.cC6x5fEQGF3gDJtr6JLNwg'
    },
    production: {
        base_url: 'https://c8c24ab41dee.ngrok.io/api',
        websocket_url:'https://c5853d42c26c.ngrok.io',
        base_url_front: '',
        paystack_api_key:'pk_test_18e1b66031dc64ef4cc27827419428bac31851e1',
        mapbox_token:'pk.eyJ1IjoiZ3JheWV5LWVtbXMiLCJhIjoiY2txODMzb2ZoMGM3ZzJvb2FnN3FpM2dpdyJ9.cC6x5fEQGF3gDJtr6JLNwg'
    }

}

export const APP_ENVIRONMENT = environment[app_mode];