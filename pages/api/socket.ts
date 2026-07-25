import { NextApiRequest, NextApiResponse } from "next";
import { Socket } from "net";
import { Server } from "http";
import { Server as IOServer } from 'socket.io'

type NextApiResponseServerIO = NextApiResponse & {
    socket: Socket & {
        server: Server & {
            io?: IOServer
        }
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
    if (!res.socket.server.io) {
        const io = new IOServer(res.socket.server);
        res.socket.server.io = io;

        // When connected, I want to store connected userIds for each note
        // Only broadcast content that the user is currently editing
        // I do not want to recieve an event for a note that I'm not connected to or editing
        // Broadcast everything and only read data that I'm editing
        io.on('connection', (socket) => {
            socket.on('note-content-change', (data) => {
                socket.broadcast.emit(`note-content-${data.noteId}-changed`, data.content)
            })
        })
    }

    res.end();
}