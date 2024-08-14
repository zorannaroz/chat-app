const WebSocket = require("ws");
const http = require("http");
const url = require("url");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const clients = new Set();

const AUTH_USERNAME = "s"; // Replace with your desired username
const AUTH_PASSWORD = "d"; // Replace with your desired password

wss.on("connection", (ws, req) => {
  const query = url.parse(req.url, true).query;
  const { username, password } = query;

  // Authenticate the client
  if (username !== AUTH_USERNAME || password !== AUTH_PASSWORD) {
    ws.close(4000, "Unauthorized"); // Close connection with an error code
    console.log("Client attempted to connect with invalid credentials");
    return;
  }

  console.log("New client connected");
  clients.add(ws);

  // Send a welcome message
  ws.send(JSON.stringify({ message: "Welcome to the WebSocket server!" }));

  ws.on("message", (message) => {
    // Check if message is a buffer, then convert it to a string
    const messageString = Buffer.isBuffer(message)
      ? message.toString()
      : message;
    console.log("Received message:", messageString);

    // Broadcast received message to all connected clients
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(messageString);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

server.listen(3001, () => {
  console.log("WebSocket server is running on port 3001");
});
