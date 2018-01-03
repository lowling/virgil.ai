'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Path = require('path');

// Create a server with a host and port
const server = Hapi.server({ 
    host: 'localhost', 
    port: 8080 
});

// Add the route
server.route({
    method: 'GET',
    path:'/hello', 
    handler: function (request, h) {

        return 'hello world';
    }
});


// Start the server
async function start() {

    try {
        await server.register(Inert);
        await server.start();
        // Route requests to public folder
        server.route({
            method: 'GET',
            path: '/{param*}',
            handler: {
                directory: {
                    path: Path.join(__dirname, 'public')
                }
            }
        });
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
}

start();