import Stream from "node:stream";
import { WebSocketServer, WebSocket, RawData } from "ws";

const server = new WebSocketServer({
    port: 8081
})


// Store clients to noteId
// [asd1234]: [userId1, userId2]
const clients = new Map<string, string[]>()


server.on('connection', (socket: WebSocket) => {
    let init = false
    socket.on('message', (message: RawData) => {
        try {
            console.log(clients);
            if (!init) {
                let payload = JSON.parse(message.toString());
    
                if (!('noteId' in payload)) {
                    socket.send('No noteId was provided in initial payload.');
                    socket.close();
                }
                if (!('userId' in payload)) {
                    socket.send('No userId was provided in initial payload.');
                    socket.close();
                }
                
                const noteId = payload.noteId;
                const userId = payload.userId;
                const connectedUsers = clients.get(noteId) || []
    
                if (connectedUsers.includes(userId)) {
                    socket.send(`user ${userId} already connected to note ${noteId}`);
                    return
                }

                clients.set(noteId, [...connectedUsers, userId])
                init = true
            }
            
        }
        catch (error) {
            socket.send(`Error occured on initial handshake: ${error}`)
        }
    })

    socket.on('close', () => {
        console.log('Connection closed.');
    })
})

console.log('WebSocket server is running on ws://localhost:8081');