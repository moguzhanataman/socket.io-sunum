const { randomUUID } = require("crypto")
const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

const MESSAGE_TYPES = {
  chatMessage: "msg", // contains: nick(string), msg (string), time (UTC timestamp)
  join: "join", // nick, channelName
  typing: "typing", // nick, isStarted (true for started, false for ended)
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

io.on("connection", (socket) => {
  console.log("client connected", socket.id)
  socket.on(MESSAGE_TYPES.chatMessage, (payload) => {
    console.log({ payload })
    payload.id = randomUUID()
    io.emit("msg", payload)
  })

  socket.on("disconnect", (reason) => {
    console.log("a client disconnected, reason: ", reason)
  })
})

server.listen(3000, () => {
  console.log("listening on *:3000")
})
