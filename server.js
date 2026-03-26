import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(handle)
  const io = new Server(server);
  global.io = io;

  io.on('connection', (socket) => {
    console.log("Web Socket connected")

    socket.on('disconnect', () => {
      console.log("Web Socket disconnected")
    })
  })


  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  })
})