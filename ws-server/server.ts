import * as dotenv from 'dotenv';
import { SocketManager } from './socket-manager';

dotenv.config({ quiet: true });
new SocketManager()

console.log('WebSocket server is running on ws://localhost:8081');