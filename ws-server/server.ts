import { WebSocketServer, WebSocket, RawData } from "ws";
import { DB } from "./db";
import * as dotenv from 'dotenv';
import { Note } from "./definitions";

dotenv.config({ quiet: true });
const server = new WebSocketServer({
    port: 8081
})

type ConnectedUser = {
    userId: string,
    socket: WebSocket
}
const clients = new Map<string, ConnectedUser[]>()

const database = new DB();

server.on('connection', (socket: WebSocket) => {
    let init = false

    socket.on('message', async (message: RawData) => {
        try {

            // Initialize client
            let payload = JSON.parse(message.toString());
            if (!init) {
    
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
                const connectedUsers = clients.get(noteId) || [];
                
                // TODO: probably add a length constraint to how many users can be connected to a note at a single time
                if (connectedUsers.map(c => c.userId).includes(userId)) {
                    socket.send(`user ${userId} already connected to note ${noteId}`);
                    return
                }

                clients.set(noteId, [...connectedUsers, { userId: userId, socket: socket }])
                init = true
            }
            else {

                // Handle note edit
                // Possible race condition, if two users edit the same not at the same place
                // Updating the DB on each keystroke would be costly as the software scales
                // I could send the data back to everyone without synchronizing with the DB
                // I only want to broadcast the data if the save was successfull.
                console.log(payload);
                switch (payload?.type) {
                    case 'note-content-change':
                        // Save data to DB and send out if successfull
                        const noteId = payload.noteId;
                        if (await database.updateNoteContent(payload.noteId, payload.content)) {
                            const newNoteContent: Note | undefined = await database.getNoteContent(payload.noteId);
                            
                            // Send out the new content to every other connected client on the recieved note
                            const connectedClients = clients.get(noteId)
                            connectedClients?.forEach(connectedClient => {

                                const clientSocket = connectedClient.socket;
                                if (clientSocket !== socket && clientSocket.readyState === WebSocket.OPEN) {
                                    clientSocket.send(JSON.stringify({
                                        type: 'new-note-content',
                                        noteId: newNoteContent?.id,
                                        content: newNoteContent?.content
                                    }));
                                }
                            })
                        }
                        else {
                            socket.send(JSON.stringify({
                                type: 'error',
                                message: 'Saving note contant failed'
                            }))
                        }
                        break
                    case undefined:
                        socket.send('Provide type for message')
                        socket.close()
                        break
                    default:
                        socket.send('Provide type for message')
                        socket.close()
                        break
                }
            }
            
        }
        catch (error) {
            socket.send(`Error occured on initial handshake: ${error}`)
        }
    })

    socket.on('close', () => {
        console.log('Connection closed.');
    })

    socket.on('error', (error) => {
        console.warn(error)
    })
})

console.log('WebSocket server is running on ws://localhost:8081');