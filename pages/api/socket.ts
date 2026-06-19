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

        io.on('connection', (socket) => {
            socket.on('note-content-change', (data) => {
                socket.broadcast.emit(`note-content-${data.noteId}-changed`, data.content)
            })
        })
    }

    res.end();
}