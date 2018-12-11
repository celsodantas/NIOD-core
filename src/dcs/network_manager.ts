import * as net from "net";

let connected = false;
let connecting = false;

const connect = (options: net.NetConnectOpts) => {
  connecting = true;
  const socket = net.createConnection(options, () => {
    console.log("Niod client connected");
    connected = true;
    connecting = false;
  });

  socket.setTimeout(1000 * 60 * 5); //5 minutes
  socket.setEncoding("utf8");
  // When connection disconnected.
  socket.once("end", function() {
    console.log("Client socket disconnect. ");
    connected = false;
  });

  socket.once("close", function() {
    console.log("Client socket closed. ");
    connected = false;
  });

  socket.once("timeout", function() {
    console.log("Client connection timeout. ");
    connected = false;
  });

  socket.once("error", function(err) {
    console.error(JSON.stringify(err));
    connected = false;
  });

  return socket;
};

const send = (socket: net.Socket, data: { [key: string]: any }) => {
  if (!connected) {
    console.error("ERR: Socket isn't connected, aborting;");
    return;
  }
  const jsonData = JSON.stringify(data);
  socket.write(jsonData + "\n", () =>
    console.log(`Successfuly sent ${jsonData}`)
  );
};

const network_manager = {
  connect: connect,
  send: send,
  connected: connected,
  connecting: connecting
};

export default network_manager;
