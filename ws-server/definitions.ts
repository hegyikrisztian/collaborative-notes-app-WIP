import WebSocket from "ws"

export type Note = {
    id: string,
    title: string,
    content: string,
    last_modified: Date,
    creator: string,
}

export const NOTE_EVENTS = {
    NEW_NOTE_CONTENT: 'new-note-content',
    NOTE_CONTENT_CHANGE: 'note-content-change',
    NOTE_CONTENT_SYNCH_COMPLETE: 'note-content-synch-complete',
    NOTE_CONTENT_CONNECTED_USERS: 'note-content-connected-users',
    ERROR: 'error'
}

export type ConnectedUser = {
    userId: string,
    socket: WebSocket
}

export type User = {
    id: string,
    name: string,
}