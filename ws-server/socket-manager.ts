import { WebSocketServer, WebSocket } from "ws";
import { DB } from "./db";
import { ConnectedUser, Note, NOTE_EVENTS } from "./definitions";
import { RawData } from "ws";


/**
 * Manages users connected to different notes
 * Initializes with userId and noteId
 */
export class SocketManager {
    database: DB;
    clients: Map<string, ConnectedUser[]>;
    static server: WebSocketServer;

    constructor() {
        this.database = new DB();
        this.clients = new Map<string, ConnectedUser[]>();
        SocketManager.server = new WebSocketServer({
            port: Number(process.env.PORT)
        });

        SocketManager.server.on('connection', this.handleOnConnection.bind(this));
    }

    handleOnConnection(socket: WebSocket) {

        // Closure over init on each connection
        let init = false;
    
        socket.on('message', async (message: RawData) => {
            try {
                // Initialize client
                let payload = JSON.parse(message.toString());
                console.log('Value of init: ', init);
                console.log('Message with payload: ', payload);
                if (!init) {
        
                    if (!('noteId' in payload)) {
                        socket.send(JSON.stringify({
                            type: NOTE_EVENTS.ERROR,
                            message: 'No noteId was provided in initial payload.'
                        }));
                        socket.close();
                    }
                    if (!('userId' in payload)) {
                        socket.send(JSON.stringify({
                            type: NOTE_EVENTS.ERROR,
                            message: 'No userId was provided in initial payload.'
                        }));
                        socket.close();
                    }
                    
                    const noteId = payload.noteId;
                    const userId = payload.userId;
                    const connectedUsers = this.clients.get(noteId) || [];
                    
                    // TODO: probably add a length constraint to how many users can be connected to a note at a single time
                    if (connectedUsers.map(c => c.userId).includes(userId)) {
                        socket.send(JSON.stringify({
                            type: NOTE_EVENTS.ERROR,
                            message: `User ${userId} already connected to note ${noteId}`
                        }));
                        return
                    }
    
                    this.clients.set(noteId, [...connectedUsers, { userId: userId, socket: socket }])
                    init = true
                }
                else {

                    switch (payload?.type) {
                        case NOTE_EVENTS.NOTE_CONTENT_CHANGE:
                            // Save data to DB and send out if successfull
                            const noteId = payload.noteId;
                            if (await this.database.updateNoteContent(payload.noteId, payload.content)) {
                                const newNoteContent: Note | undefined = await this.database.getNoteContent(payload.noteId);
                                
                                // Send out the new content to every other connected client on the recieved note
                                const connectedClients = this.clients.get(noteId)
                                connectedClients?.forEach(connectedClient => {
    
                                    const clientSocket = connectedClient.socket;
                                    if (clientSocket !== socket && clientSocket.readyState === WebSocket.OPEN) {
                                        clientSocket.send(JSON.stringify({
                                            type: NOTE_EVENTS.NEW_NOTE_CONTENT,
                                            noteId: newNoteContent?.id,
                                            content: newNoteContent?.content
                                        }));
                                    }
                                })
                            }
                            else {
                                socket.send(JSON.stringify({
                                    type: NOTE_EVENTS.ERROR,
                                    message: 'Saving note contant failed'
                                }))
                            }
                            break
                        case undefined:
                            socket.send(JSON.stringify({
                                type: NOTE_EVENTS.ERROR,
                                message: 'Provide type for message'
                            }));
                            socket.close(1000, noteId)
                            break
                        default:
                             socket.send(JSON.stringify({
                                type: NOTE_EVENTS.ERROR,
                                message: 'Provide type for message'
                            }));
                            socket.close(1000, noteId)
                            break
                    }
                }
                
            }
            catch (error) {
                socket.send(JSON.stringify({
                    type: NOTE_EVENTS.ERROR,
                    message: `Error occured on initial handshake: ${error}`
                }));
                return
            }
        })
    
        socket.on('close', (code, reason) => {
            // Remove client, reset init when closing
            console.log('Disconnected: ', reason.toString());
            const noteId = reason.toString()
            if (noteId) {
                this.clients.delete(noteId);
                init = false
            }
        })
    
        socket.on('error', (error) => {
            console.log('I got an error: ', error)
        })
    }

 }