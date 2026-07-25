import { WebSocketServer, WebSocket, RawData } from "ws";

const server = new WebSocketServer({
    port: 8081
})

server.on('connection', (socket: WebSocket) => {
    console.log(socket, ' Connected');

    socket.on('message', (message: RawData) => {
        console.log('Message from client: ', message);
    })

    socket.on('close', () => {
        console.log('Connection closed.');
    })
})

console.log('WebSocket server is running on ws://localhost:8081');